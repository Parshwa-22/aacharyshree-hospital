package com.aacharyshree.hospital.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * The hospital's single governing trust (Vidya Sanmati Das Seva Sanstha) —
 * one row, id always 1. Shown on the public About page.
 */
@Entity
@Table(name = "trust_info")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrustInfo {

    @Id
    private Long id = 1L;

    private String name;
    private String establishedYear;

    @Column(length = 3000)
    private String description;

    // Comma-separated list of short achievement lines, e.g.
    // "50,000+ patients treated,3 medical streams under one roof,..."
    @Column(length = 2000)
    private String achievements;

    private String image;

    // Per-language override for name/description/achievements —
    // {"hi":{"name":"...","description":"...","achievements":"..."}, "mr":{...}, "kn":{...}}
    @Column(columnDefinition = "TEXT")
    private String translations;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
