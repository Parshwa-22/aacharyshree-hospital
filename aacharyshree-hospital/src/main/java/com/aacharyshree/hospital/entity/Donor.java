package com.aacharyshree.hospital.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "donors")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Donor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @DecimalMin(value = "0.0", message = "Donation amount cannot be negative")
    private Double donationAmount;

    // What the donation was for, e.g. "Equipment", "Building Fund",
    // "Ambulance". Replaces the old separate donationType + purpose pair —
    // they overlapped, so this is now the single field for that.
    private String donationType;

    private LocalDate donationDate;

    private String image;

    @Column(length = 1000)
    private String message;

    private Integer displayOrder = 0;

    private Boolean isActive = true;

    // Per-language override for donationType/message —
    // {"hi":{"donationType":"...","message":"..."}, "mr":{...}, "kn":{...}}
    @Column(columnDefinition = "TEXT")
    private String translations;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
