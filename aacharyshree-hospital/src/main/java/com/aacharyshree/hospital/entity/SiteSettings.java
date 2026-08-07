package com.aacharyshree.hospital.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Sitewide text settings — a single row (id is always 1). Currently just
 * the homepage hero heading/subtitle, which used to live on each hero
 * slide but is now site-level text shown once, positioned below the navbar
 * instead of overlapping it.
 */
@Entity
@Table(name = "site_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SiteSettings {

    @Id
    private Long id = 1L;

    private String heroTitle;
    private String heroSubtitle;

    // Per-language override for heroTitle/heroSubtitle —
    // {"hi":{"heroTitle":"...","heroSubtitle":"..."}, "mr":{...}, "kn":{...}}
    @Column(columnDefinition = "TEXT")
    private String translations;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
