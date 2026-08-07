package com.aacharyshree.hospital.dto;

import com.aacharyshree.hospital.entity.Order;
import lombok.Data;

@Data
public class OrderStatusUpdateRequest {
    private Order.OrderStatus status;
}
