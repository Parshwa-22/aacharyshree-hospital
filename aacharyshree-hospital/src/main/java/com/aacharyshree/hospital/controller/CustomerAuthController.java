package com.aacharyshree.hospital.controller;

import com.aacharyshree.hospital.dto.ApiResponse;
import com.aacharyshree.hospital.dto.CustomerAuthResponse;
import com.aacharyshree.hospital.dto.RequestOtpRequest;
import com.aacharyshree.hospital.dto.VerifyOtpRequest;
import com.aacharyshree.hospital.email.EmailService;
import com.aacharyshree.hospital.entity.OtpCode;
import com.aacharyshree.hospital.entity.User;
import com.aacharyshree.hospital.repository.OtpCodeRepository;
import com.aacharyshree.hospital.repository.UserRepository;
import com.aacharyshree.hospital.security.CustomerJwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.time.LocalDateTime;

/**
 * Amazon/Flipkart-style auth: browse freely, only this endpoint pair is
 * ever needed — email in, OTP in, done. If the email is new, an account is
 * created automatically; no separate registration form.
 */
@RestController
@RequestMapping("/api/customer-auth")
@RequiredArgsConstructor
public class CustomerAuthController {

    private final OtpCodeRepository otpCodeRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final CustomerJwtService jwtService;

    private static final SecureRandom RANDOM = new SecureRandom();

    @PostMapping("/request-otp")
    public ApiResponse requestOtp(@Valid @RequestBody RequestOtpRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        String code = String.format("%06d", RANDOM.nextInt(1_000_000));

        OtpCode otp = new OtpCode();
        otp.setEmail(email);
        otp.setCode(code);
        otp.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        otp.setUsed(false);
        otpCodeRepository.save(otp);

        emailService.sendOtp(email, code);

        return ApiResponse.ok("OTP sent — check your email (it expires in 5 minutes).");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        var otpOpt = otpCodeRepository.findTopByEmailAndUsedFalseOrderByCreatedAtDesc(email);
        if (otpOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, "No OTP was requested for this email. Request one first."));
        }

        OtpCode otp = otpOpt.get();
        if (otp.getExpiresAt().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, "This code has expired — request a new one."));
        }
        if (!otp.getCode().equals(request.getOtp().trim())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, "Incorrect code."));
        }

        otp.setUsed(true);
        otpCodeRepository.save(otp);

        boolean isNew = userRepository.findByEmail(email).isEmpty();
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User fresh = new User();
            fresh.setEmail(email);
            return userRepository.save(fresh);
        });

        String token = jwtService.generateToken(user.getEmail());
        return ResponseEntity.ok(new CustomerAuthResponse(token, user.getEmail(), isNew));
    }
}
