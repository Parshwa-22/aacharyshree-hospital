package com.aacharyshree.hospital.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Issues/reads JWTs for CUSTOMERS (email+OTP login) — deliberately separate
 * from JwtUtil, which is for admin panel logins backed by AdminUserDetailsService.
 * Customers aren't Spring Security principals here; their token is just
 * proof-of-email-verification the frontend attaches to checkout calls.
 */
@Component
public class CustomerJwtService {

    @Value("${jwt.secret}")
    private String secret;

    private static final long EXPIRATION_MS = 30L * 24 * 60 * 60 * 1000; // 30 days

    private SecretKey key() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(String email) {
        Date now = new Date();
        return Jwts.builder()
                .subject(email)
                .claim("type", "customer")
                .issuedAt(now)
                .expiration(new Date(now.getTime() + EXPIRATION_MS))
                .signWith(key())
                .compact();
    }

    public String extractEmail(String token) {
        return Jwts.parser().verifyWith(key()).build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }
}
