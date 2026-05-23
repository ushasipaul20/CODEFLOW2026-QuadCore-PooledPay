package com.pooledpay.backend.repository;

import com.pooledpay.backend.model.PoolOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PoolOrderRepository extends JpaRepository<PoolOrder, Long> {
}
