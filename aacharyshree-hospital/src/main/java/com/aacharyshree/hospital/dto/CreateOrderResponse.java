package com.aacharyshree.hospital.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** What the frontend needs to open the Razorpay Checkout widget. */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderResponse {
    private Long orderId;          // our own Order.id
    private String razorpayOrderId;
    private String razorpayKeyId;  // public key, safe to send to the browser
    private Long amountInPaise;
    private String currency;
}
