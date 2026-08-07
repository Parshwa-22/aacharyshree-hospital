package com.aacharyshree.hospital.controller;

import com.aacharyshree.hospital.dto.CreateOrderRequest;
import com.aacharyshree.hospital.dto.CreateOrderResponse;
import com.aacharyshree.hospital.dto.OrderStatusUpdateRequest;
import com.aacharyshree.hospital.dto.VerifyPaymentRequest;
import com.aacharyshree.hospital.entity.Order;
import com.aacharyshree.hospital.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService service;

    /** Step 1 of checkout: creates our Order + a matching Razorpay order. Public — no login needed to buy. */
    @PostMapping("/create-razorpay-order")
    public CreateOrderResponse createOrder(@Valid @RequestBody CreateOrderRequest request) {
        return service.createOrder(request);
    }

    /** Step 2 of checkout: called after Razorpay Checkout succeeds, to verify + confirm. Public. */
    @PostMapping("/verify-payment")
    public Order verifyPayment(@Valid @RequestBody VerifyPaymentRequest request) {
        return service.verifyPayment(request);
    }

    /** Public order tracking — requires BOTH the order id and the phone number used to place it. */
    @GetMapping("/track")
    public Order track(@RequestParam Long orderId, @RequestParam String phone) {
        return service.track(orderId, phone);
    }

    // ---- Admin ----

    @GetMapping
    public List<Order> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Order getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PutMapping("/{id}/status")
    public Order updateStatus(@PathVariable Long id, @RequestBody OrderStatusUpdateRequest request) {
        return service.updateStatus(id, request.getStatus());
    }
}
