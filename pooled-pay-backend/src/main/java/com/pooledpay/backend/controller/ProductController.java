package com.pooledpay.backend.controller;

import com.pooledpay.backend.model.Product;
import com.pooledpay.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.PostConstruct;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @PostConstruct
    public void init() {
        if (productRepository.count() == 0) {
            Product p1 = new Product();
            p1.setName("Paracetamol 500mg (100 strips)");
            p1.setOriginalPrice(new BigDecimal("1200"));
            p1.setGroupPrice(new BigDecimal("850"));
            p1.setCategory("Pharma");

            Product p2 = new Product();
            p2.setName("Dettol Handwash 5L");
            p2.setOriginalPrice(new BigDecimal("950"));
            p2.setGroupPrice(new BigDecimal("700"));
            p2.setCategory("FMCG");

            productRepository.saveAll(List.of(p1, p2));
        }
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @PostMapping("/add")
    public Product addProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }
}
