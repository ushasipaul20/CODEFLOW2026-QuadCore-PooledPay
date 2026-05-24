package com.pooledpay.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonFormat;

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

    private Integer maxQuantity;   // Pool closes when currentQuantity >= maxQuantity

    private String paymentStatus = "PENDING"; // PENDING, PAID

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt = LocalDateTime.now();
}
