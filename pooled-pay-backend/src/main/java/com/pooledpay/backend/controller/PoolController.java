package com.pooledpay.backend.controller;

import com.pooledpay.backend.model.PoolOrder;
import com.pooledpay.backend.model.Product;
import com.pooledpay.backend.model.User;
import com.pooledpay.backend.repository.PoolOrderRepository;
import com.pooledpay.backend.repository.ProductRepository;
import com.pooledpay.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/pools")
@CrossOrigin(origins = "*")
public class PoolController {

    @Autowired private PoolOrderRepository poolOrderRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private UserRepository userRepository;

    // All pools
    @GetMapping
    public List<PoolOrder> getAllPools() {
        return poolOrderRepository.findAll();
    }

    // Active pools for a specific product (retailer can see & join)
    @GetMapping("/product/{productId}")
    public List<PoolOrder> getPoolsByProduct(@PathVariable Long productId) {
        return poolOrderRepository.findByProductIdAndStatus(productId, "ACTIVE");
    }

    // Pools linked to a supplier's products (supplier dashboard)
    @GetMapping("/supplier/{supplierId}")
    public List<PoolOrder> getPoolsBySupplierId(@PathVariable Long supplierId) {
        return poolOrderRepository.findBySupplierId(supplierId);
    }

    // Create or join a pool (auto-pooling)
    @PostMapping("/order")
    public ResponseEntity<?> placeOrder(@RequestBody Map<String, Object> orderRequest) {
        Long userId    = Long.valueOf(orderRequest.get("userId").toString());
        Long productId = Long.valueOf(orderRequest.get("productId").toString());
        Integer quantity = Integer.valueOf(orderRequest.get("quantity").toString());
        
        Long poolId = null;
        if (orderRequest.containsKey("poolId") && orderRequest.get("poolId") != null) {
            try {
                poolId = Long.valueOf(orderRequest.get("poolId").toString());
            } catch (Exception e) {
                // ignore invalid format
            }
        }

        User user       = userRepository.findById(userId).orElse(null);
        Product product = productRepository.findById(productId).orElse(null);

        if (user == null || product == null) {
            return ResponseEntity.badRequest().body("User or Product not found");
        }

        String location = user.getLocation() != null ? user.getLocation() : "Unknown";

        PoolOrder poolOrder = null;
        boolean canJoinByPoolId = false;
        if (poolId != null) {
            poolOrder = poolOrderRepository.findById(poolId).orElse(null);
            if (poolOrder != null && !"CLOSED".equals(poolOrder.getStatus()) && !"DELIVERED".equals(poolOrder.getStatus())) {
                int maxQty = poolOrder.getMaxQuantity() != null ? poolOrder.getMaxQuantity() : product.getTotalStockQuantity();
                if (poolOrder.getCurrentQuantity() < maxQty) {
                    canJoinByPoolId = true;
                }
            }
        }

        if (canJoinByPoolId) {
            int maxQty = poolOrder.getMaxQuantity() != null ? poolOrder.getMaxQuantity() : product.getTotalStockQuantity();
            int remaining = maxQty - poolOrder.getCurrentQuantity();
            if (quantity > remaining) {
                return ResponseEntity.badRequest().body("Order quantity (" + quantity + ") exceeds the remaining available pool quantity of " + remaining + " units.");
            }
            int newQty = poolOrder.getCurrentQuantity() + quantity;
            poolOrder.setCurrentQuantity(newQty);
            poolOrder.setParticipantsCount(poolOrder.getParticipantsCount() + 1);
            if (newQty >= maxQty) {
                poolOrder.setStatus("CLOSED"); // Auto-close since it's full
            }
        } else {
            // Otherwise, look for an existing ACTIVE or FULFILLED pool for the same product + location that is not full
            Optional<PoolOrder> existingPoolOpt =
                poolOrderRepository.findFirstByProductIdAndLocationAndStatus(productId, location, "ACTIVE");
            
            if (!existingPoolOpt.isPresent()) {
                existingPoolOpt = poolOrderRepository
                    .findFirstByProductIdAndLocationAndStatus(productId, location, "FULFILLED");
            }

            PoolOrder existingPool = null;
            if (existingPoolOpt.isPresent()) {
                PoolOrder p = existingPoolOpt.get();
                int maxQty = p.getMaxQuantity() != null ? p.getMaxQuantity() : product.getTotalStockQuantity();
                if (p.getCurrentQuantity() < maxQty) {
                    existingPool = p;
                }
            }

            if (existingPool != null) {
                // Join the matched pool
                poolOrder = existingPool;
                int maxQty = poolOrder.getMaxQuantity() != null ? poolOrder.getMaxQuantity() : product.getTotalStockQuantity();
                int remaining = maxQty - poolOrder.getCurrentQuantity();
                if (quantity > remaining) {
                    return ResponseEntity.badRequest().body("Order quantity (" + quantity + ") exceeds the remaining available pool quantity of " + remaining + " units.");
                }
                int newQty = poolOrder.getCurrentQuantity() + quantity;
                poolOrder.setCurrentQuantity(newQty);
                poolOrder.setParticipantsCount(poolOrder.getParticipantsCount() + 1);
                if (newQty >= maxQty) {
                    poolOrder.setStatus("CLOSED"); // Auto-close since it's full
                }
            } else {
                // Create a brand new pool
                poolOrder = new PoolOrder();
                poolOrder.setProductId(productId);
                poolOrder.setLocation(location);
                poolOrder.setStatus("ACTIVE");
                poolOrder.setCategory(product.getCategory());
                poolOrder.setParticipantsCount(1);
                int maxQty = product.getTotalStockQuantity() != null ? product.getTotalStockQuantity() : product.getAvailableQuantity();
                poolOrder.setMaxQuantity(maxQty);
                if (quantity > maxQty) {
                    return ResponseEntity.badRequest().body("Order quantity (" + quantity + ") exceeds the wholesaler's total stock of " + maxQty + " units.");
                }
                poolOrder.setCurrentQuantity(quantity);
                if (quantity >= maxQty) {
                    poolOrder.setStatus("CLOSED"); // Auto-close
                }
                poolOrder.setCreatedAt(LocalDateTime.now());
            }
        }

        // Auto-fulfill if min order quantity reached
        if (("ACTIVE".equals(poolOrder.getStatus()) || "CLOSED".equals(poolOrder.getStatus())) && poolOrder.getCurrentQuantity() >= product.getMinOrderQuantity()) {
            if ("ACTIVE".equals(poolOrder.getStatus())) {
                poolOrder.setStatus("FULFILLED");
            }
            poolOrder.setSupplierId(product.getSupplierId());
            poolOrder.setSupplierStatus("PENDING");
            if (poolOrder.getDeliveryStatus() == null) {
                poolOrder.setDeliveryStatus("PREPARING");
            }
        }

        // Deduct available stock
        product.setAvailableQuantity(Math.max(0, product.getAvailableQuantity() - quantity));
        productRepository.save(product);

        PoolOrder saved = poolOrderRepository.save(poolOrder);
        return ResponseEntity.ok(saved);
    }

    // Admin: update pool status (close pool, confirm delivery, etc.)
    @PatchMapping("/{poolId}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long poolId, @RequestBody Map<String, String> body) {
        return poolOrderRepository.findById(poolId).map(pool -> {
            if (body.containsKey("status"))         pool.setStatus(body.get("status"));
            if (body.containsKey("deliveryStatus")) pool.setDeliveryStatus(body.get("deliveryStatus"));
            if (body.containsKey("supplierId"))     pool.setSupplierId(Long.valueOf(body.get("supplierId")));
            if (body.containsKey("paymentStatus"))  pool.setPaymentStatus(body.get("paymentStatus"));
            return ResponseEntity.ok(poolOrderRepository.save(pool));
        }).orElse(ResponseEntity.notFound().build());
    }
}
