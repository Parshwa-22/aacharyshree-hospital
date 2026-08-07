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
 * One stat box on the homepage counter section (e.g. "Patients Treated" /
 * 25000). Fully admin-managed — add as many as you like, in any order.
 */
@Entity
@Table(name = "counters")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Counter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String label;

    private Long value = 0L;

    // Shown after the number, e.g. "+" -> "25000+"
    private String suffix = "+";

    private Integer displayOrder = 0;

    private Boolean isActive = true;

    // Per-language override for `label` — {"hi":{"label":"..."}, "mr":{...}, "kn":{...}}
    @Column(columnDefinition = "TEXT")
    private String translations;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
