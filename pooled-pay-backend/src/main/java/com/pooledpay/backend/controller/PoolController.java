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

        User user       = userRepository.findById(userId).orElse(null);
        Product product = productRepository.findById(productId).orElse(null);

        if (user == null || product == null) {
            return ResponseEntity.badRequest().body("User or Product not found");
        }

        String location = user.getLocation() != null ? user.getLocation() : "Unknown";

        // Look for an existing ACTIVE pool for same product + location
        Optional<PoolOrder> existingPool =
            poolOrderRepository.findFirstByProductIdAndLocationAndStatus(productId, location, "ACTIVE");

        PoolOrder poolOrder;
        if (existingPool.isPresent()) {
            // Join the existing pool
            poolOrder = existingPool.get();
            poolOrder.setParticipantsCount(poolOrder.getParticipantsCount() + 1);
            poolOrder.setCurrentQuantity(poolOrder.getCurrentQuantity() + quantity);
        } else {
            // Create a brand new pool
            poolOrder = new PoolOrder();
            poolOrder.setProductId(productId);
            poolOrder.setLocation(location);
            poolOrder.setStatus("ACTIVE");
            poolOrder.setCategory(product.getCategory());
            poolOrder.setParticipantsCount(1);
            poolOrder.setCurrentQuantity(quantity);
            poolOrder.setCreatedAt(LocalDateTime.now());
        }

        // Auto-fulfill if min order quantity reached
        if (poolOrder.getCurrentQuantity() >= product.getMinOrderQuantity()) {
            poolOrder.setStatus("FULFILLED");
            poolOrder.setSupplierId(product.getSupplierId());
            poolOrder.setSupplierStatus("PENDING_ADMIN_APPROVAL");
            poolOrder.setDeliveryStatus("PREPARING");
            poolOrder.setPaymentStatus("PENDING");
            poolOrder.setDeliveryCode(String.format("%06d", new java.util.Random().nextInt(1000000)));
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
            return ResponseEntity.ok(poolOrderRepository.save(pool));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Admin approves request and pays supplier
    @PatchMapping("/{poolId}/admin-approve")
    public ResponseEntity<?> adminApprove(@PathVariable Long poolId) {
        return poolOrderRepository.findById(poolId).map(pool -> {
            pool.setSupplierStatus("ADMIN_APPROVED");
            pool.setPaymentStatus("PAID_TO_SUPPLIER");
            return ResponseEntity.ok(poolOrderRepository.save(pool));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Supplier starts shipment
    @PatchMapping("/{poolId}/ship")
    public ResponseEntity<?> shipOrder(@PathVariable Long poolId) {
        return poolOrderRepository.findById(poolId).map(pool -> {
            pool.setDeliveryStatus("SHIPPED");
            return ResponseEntity.ok(poolOrderRepository.save(pool));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Retailer confirms delivery using unique code
    @PostMapping("/{poolId}/confirm-delivery")
    public ResponseEntity<?> confirmDelivery(@PathVariable Long poolId, @RequestBody Map<String, String> body) {
        String code = body.get("deliveryCode");
        return poolOrderRepository.findById(poolId).map(pool -> {
            if (pool.getDeliveryCode() != null && pool.getDeliveryCode().equals(code)) {
                pool.setStatus("COMPLETED");
                pool.setDeliveryStatus("DELIVERED");
                pool.setSupplierStatus("COMPLETED");
                return ResponseEntity.ok(poolOrderRepository.save(pool));
            }
            return ResponseEntity.badRequest().body("Invalid delivery code");
        }).orElse(ResponseEntity.notFound().build());
    }
}
