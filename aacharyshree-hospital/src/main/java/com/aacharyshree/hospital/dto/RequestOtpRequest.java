package com.aacharyshree.hospital.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RequestOtpRequest {
    @NotBlank
    @Email
    private String email;
}
