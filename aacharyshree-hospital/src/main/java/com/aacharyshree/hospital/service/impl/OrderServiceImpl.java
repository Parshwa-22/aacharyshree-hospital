package com.aacharyshree.hospital.service.impl;

import com.aacharyshree.hospital.dto.CreateOrderRequest;
import com.aacharyshree.hospital.dto.CreateOrderResponse;
import com.aacharyshree.hospital.dto.VerifyPaymentRequest;
import com.aacharyshree.hospital.email.EmailService;
import com.aacharyshree.hospital.entity.Order;
import com.aacharyshree.hospital.entity.OrderItem;
import com.aacharyshree.hospital.entity.Product;
import com.aacharyshree.hospital.exception.ResourceNotFoundException;
import com.aacharyshree.hospital.payment.RazorpayService;
import com.aacharyshree.hospital.repository.OrderRepository;
import com.aacharyshree.hospital.repository.ProductRepository;
import com.aacharyshree.hospital.service.OrderService;
import com.aacharyshree.hospital.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final ProductService productService;
    private final RazorpayService razorpayService;
    private final EmailService emailService;

    @Override
    @Transactional
    public CreateOrderResponse createOrder(CreateOrderRequest request) {
        Order order = new Order();
        order.setCustomerName(request.getCustomerName());
        order.setCustomerPhone(request.getCustomerPhone());
        order.setCustomerEmail(request.getCustomerEmail());
        order.setCustomerAddress(request.getCustomerAddress());

        List<OrderItem> items = new ArrayList<>();
        double total = 0.0;

        // Prices always come from the database, never from the client —
        // otherwise anyone could just send whatever price they want.
        for (CreateOrderRequest.CartItemDto cartItem : request.getItems()) {
            Product product = productRepository.findById(cartItem.getProductId())
                    .orElseThrow(() -> ResourceNotFoundException.of("Product", cartItem.getProductId()));

            int quantity = cartItem.getQuantity() == null ? 1 : cartItem.getQuantity();
            double unitPrice = product.getPrice() == null ? 0.0 : product.getPrice();
            double subtotal = unitPrice * quantity;
            total += subtotal;

            OrderItem item = new OrderItem();
            item.setProductId(product.getId());
            item.setProductName(product.getName());
            item.setUnitPrice(unitPrice);
            item.setQuantity(quantity);
            item.setSubtotal(subtotal);
            item.setOrder(order);
            items.add(item);
        }

        order.setItems(items);
        order.setTotalAmount(total);
        order.setStatus(Order.OrderStatus.PLACED);
        order.setPaymentStatus(Order.PaymentStatus.PENDING);

        Order saved = orderRepository.save(order);

        long amountInPaise = Math.round(total * 100);
        String razorpayOrderId = razorpayService.createOrder(amountInPaise, "order_" + saved.getId());
        saved.setRazorpayOrderId(razorpayOrderId);
        orderRepository.save(saved);

        return new CreateOrderResponse(
                saved.getId(),
                razorpayOrderId,
                razorpayService.getKeyId(),
                amountInPaise,
                "INR"
        );
    }

    @Override
    @Transactional
    public Order verifyPayment(VerifyPaymentRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> ResourceNotFoundException.of("Order", request.getOrderId()));

        boolean valid = razorpayService.verifySignature(
                request.getRazorpayOrderId(),
                request.getRazorpayPaymentId(),
                request.getRazorpaySignature()
        );

        order.setRazorpayPaymentId(request.getRazorpayPaymentId());
        order.setRazorpaySignature(request.getRazorpaySignature());

        if (valid) {
            order.setPaymentStatus(Order.PaymentStatus.PAID);
            order.setStatus(Order.OrderStatus.CONFIRMED);
            // Reduce stock now that payment is actually confirmed.
            for (OrderItem item : order.getItems()) {
                try {
                    productService.reduceStock(item.getProductId(), item.getQuantity());
                } catch (Exception ignored) {
                    // Don't fail the whole payment confirmation over a stock
                    // mismatch — the admin can reconcile from the orders list.
                }
            }
            Order saved = orderRepository.save(order);
            emailService.sendOrderConfirmation(saved);
            return saved;
        } else {
            order.setPaymentStatus(Order.PaymentStatus.FAILED);
        }

        return orderRepository.save(order);
    }

    @Override
    public Order track(Long orderId, String phone) {
        return orderRepository.findByIdAndCustomerPhone(orderId, phone)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No order found with that Order ID and phone number combination"));
    }

    @Override
    public List<Order> getAll() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    public Order getById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Order", id));
    }

    @Override
    public Order updateStatus(Long id, Order.OrderStatus status) {
        Order order = getById(id);
        order.setStatus(status);
        Order saved = orderRepository.save(order);
        if (status == Order.OrderStatus.DELIVERED) {
            emailService.sendDeliveryConfirmation(saved);
        }
        return saved;
    }
}
