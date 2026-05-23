package com.pooledpay.backend.controller;

import com.pooledpay.backend.model.PoolOrder;
import com.pooledpay.backend.repository.PoolOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pools")
public class PoolController {

    @Autowired
    private PoolOrderRepository poolOrderRepository;

    @PostMapping("/create")
    public ResponseEntity<?> createPool(@RequestBody PoolOrder poolOrder) {
        poolOrder.setStatus("ACTIVE");
        poolOrder.setParticipantsCount(1);
        poolOrderRepository.save(poolOrder);
        return ResponseEntity.ok(poolOrder);
    }
    
    @PostMapping("/join/{id}")
    public ResponseEntity<?> joinPool(@PathVariable Long id) {
        return poolOrderRepository.findById(id).map(pool -> {
            pool.setParticipantsCount(pool.getParticipantsCount() + 1);
            poolOrderRepository.save(pool);
            return ResponseEntity.ok("Joined pool successfully. Total participants: " + pool.getParticipantsCount());
        }).orElse(ResponseEntity.notFound().build());
    }
}
