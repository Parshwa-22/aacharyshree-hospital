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
 * A hospital department shown on the homepage ("Cardiology", "Neurology",
 * etc.) and its own detail page. Was previously a hardcoded array in the
 * frontend — now fully admin-managed.
 */
@Entity
@Table(name = "departments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;

    // URL-friendly identifier used in the public page's link, e.g. "cardiology"
    @Column(unique = true)
    private String slug;

    private String image;

    @Column(length = 2000)
    private String description;

    // Comma-separated list of services under this department, e.g.
    // "Heart Failure,Cardiac Surgery,Interventional Cardiology"
    @Column(length = 1000)
    private String services;

    private Integer displayOrder = 0;

    private Boolean isActive = true;

    // Per-language override for title/description/services —
    // {"hi":{"title":"...","description":"...","services":"..."}, "mr":{...}, "kn":{...}}
    @Column(columnDefinition = "TEXT")
    private String translations;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
