package com.aacharyshree.hospital.service;

import com.aacharyshree.hospital.dto.CreateOrderRequest;
import com.aacharyshree.hospital.dto.CreateOrderResponse;
import com.aacharyshree.hospital.dto.VerifyPaymentRequest;
import com.aacharyshree.hospital.entity.Order;

import java.util.List;

public interface OrderService {
    CreateOrderResponse createOrder(CreateOrderRequest request);
    Order verifyPayment(VerifyPaymentRequest request);
    Order track(Long orderId, String phone);
    List<Order> getAll();
    Order getById(Long id);
    Order updateStatus(Long id, Order.OrderStatus status);
}
