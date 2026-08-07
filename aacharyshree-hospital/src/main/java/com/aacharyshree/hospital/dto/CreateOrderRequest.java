package com.aacharyshree.hospital.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class CreateOrderRequest {

    @NotBlank
    private String customerName;

    @NotBlank
    private String customerPhone;

    private String customerEmail;
    private String customerAddress;

    @NotEmpty
    private List<CartItemDto> items;

    @Data
    public static class CartItemDto {
        private Long productId;
        private Integer quantity;
    }
}
