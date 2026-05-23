package com.pooledpay.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "pool_orders")
public class PoolOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long productId;

    private String status; // e.g., OPEN, CLOSED, FULFILLED

    private Integer participantsCount = 0;

    private Integer currentQuantity = 0; // Tracks quantity towards minOrderQuantity

    private String location; // Used for auto-matching pools

    private Long supplierId;

    private String supplierStatus;

    private String deliveryStatus;

    private String category;

    private LocalDateTime createdAt = LocalDateTime.now();
}
