package com.aacharyshree.hospital.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * A customer account — created automatically the first time someone
 * verifies an OTP with a new email address. No password: this system is
 * email + OTP only, like the brief specified (Amazon/Flipkart-style
 * "browse freely, only log in at checkout/wishlist/cart").
 */
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    private String name; // optional, filled in later (e.g. from checkout)

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
