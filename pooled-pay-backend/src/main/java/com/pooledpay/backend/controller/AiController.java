package com.pooledpay.backend.controller;

import com.pooledpay.backend.model.CashflowRecord;
import com.pooledpay.backend.repository.CashflowRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.PostConstruct;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AiController {

    @Autowired
    private CashflowRecordRepository cashflowRecordRepository;

    @PostConstruct
    public void seedCashflow() {
        if (cashflowRecordRepository.count() == 0) {
            // Seed a few transaction items for Retailer ID 1 to show on demo launch
            CashflowRecord c1 = new CashflowRecord();
            c1.setRetailerId(1L);
            c1.setAmount(new BigDecimal("48000"));
            c1.setType("INFLOW");
            c1.setDescription("Weekly Pharmacy Sales Receipt");
            c1.setCreatedAt(LocalDateTime.now().minusDays(2));

            CashflowRecord c2 = new CashflowRecord();
            c2.setRetailerId(1L);
            c2.setAmount(new BigDecimal("15000"));
            c2.setType("OUTFLOW");
            c2.setDescription("Previous supplier procurement invoice");
            c2.setCreatedAt(LocalDateTime.now().minusDays(5));

            cashflowRecordRepository.saveAll(List.of(c1, c2));
        }
    }

    @GetMapping("/copilot")
    public ResponseEntity<?> getCopilotAssessment(@RequestParam Long userId, @RequestParam(defaultValue = "12000") BigDecimal gstDue) {
        List<CashflowRecord> records = cashflowRecordRepository.findByRetailerIdOrderByCreatedAtDesc(userId);
        
        BigDecimal totalInflows = records.stream()
                .filter(r -> "INFLOW".equalsIgnoreCase(r.getType()))
                .map(CashflowRecord::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalOutflows = records.stream()
                .filter(r -> "OUTFLOW".equalsIgnoreCase(r.getType()))
                .map(CashflowRecord::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .add(gstDue);

        String risk;
        String reason;
        String suggestion;
        String prediction;

        if (totalOutflows.compareTo(totalInflows) > 0) {
            risk = "HIGH";
            reason = "Total upcoming liabilities (GST ₹" + gstDue + " + pool orders) exceed total recorded sales inflows by ₹" + totalOutflows.subtract(totalInflows) + ".";
            suggestion = "CRITICAL Suggestion: Delay non-essential bulk items immediately. Leverage group buy (Pooled Pay) orders to gain 29% discount and use BNPL toggle.";
            prediction = "Potential cash crunch expected within 5-7 days.";
        } else if (totalOutflows.compareTo(totalInflows.multiply(new BigDecimal("0.7"))) > 0) {
            risk = "MEDIUM";
            reason = "GST and procurement outflows consume over 70% of weekly pharmacy inflows. Cash margins are narrow.";
            suggestion = "Suggestion: Join the current Paracetamol pool order to save ₹350 per strip. Use the BNPL credit feature to defer checkout cost.";
            prediction = "Cash flows remain tight but stable for next 10-12 days.";
        } else {
            risk = "LOW";
            reason = "Strong cashflow position. Recorded inflows exceed liabilities by over 40%. Cash reserve safe.";
            suggestion = "Suggestion: Safe to purchase. Consider starting a pool order to capture premium group buying volume discount.";
            prediction = "Cash liquidity is robust. No shortage predicted within the next 30 days.";
        }

        Map<String, Object> result = new HashMap<>();
        result.put("risk", risk);
        result.put("reason", reason);
        result.put("suggestion", suggestion);
        result.put("prediction", prediction);
        result.put("totalInflows", totalInflows);
        result.put("totalOutflows", totalOutflows);
        result.put("gstDue", gstDue);

        return ResponseEntity.ok(result);
    }

    @PostMapping("/simulate-cashflow")
    public ResponseEntity<?> addSimulatedEvent(@RequestBody CashflowRecord record) {
        record.setCreatedAt(LocalDateTime.now());
        CashflowRecord saved = cashflowRecordRepository.save(record);
        return ResponseEntity.ok(saved);
    }
}
