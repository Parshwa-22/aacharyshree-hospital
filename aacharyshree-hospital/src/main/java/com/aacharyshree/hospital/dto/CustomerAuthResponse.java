package com.aacharyshree.hospital.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerAuthResponse {
    private String token;
    private String email;
    private boolean newAccount;
}
