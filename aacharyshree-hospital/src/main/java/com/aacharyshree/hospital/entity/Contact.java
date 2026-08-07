package com.aacharyshree.hospital.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * One row in the Contact page's department directory
 * (Department / Phone / Availability), fully admin-managed.
 */
@Entity
@Table(name = "contacts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Contact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String department;

    @NotBlank
    private String phone;

    private String availability;

    private Integer displayOrder = 0;

    private Boolean isActive = true;

    // Per-language override for department/availability —
    // {"hi":{"department":"...","availability":"..."}, "mr":{...}, "kn":{...}}
    @Column(columnDefinition = "TEXT")
    private String translations;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
