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

    private String status;

    private Integer participantsCount = 0;

    private LocalDateTime createdAt = LocalDateTime.now();
}
