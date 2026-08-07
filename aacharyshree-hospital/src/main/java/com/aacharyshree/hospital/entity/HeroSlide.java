package com.aacharyshree.hospital.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * A single image/video in the homepage hero slider. No title/subtitle here
 * on purpose — those are sitewide text, not per-slide, and live in
 * {@link SiteSettings} instead so they don't fight with the navbar visually.
 */
@Entity
@Table(name = "hero_slides")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HeroSlide {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private Type type = Type.IMAGE;

    private String image;
    private String videoUrl;
    private String thumbnail;

    @Enumerated(EnumType.STRING)
    private AnimationType animationType = AnimationType.SLIDE;

    private Integer displayOrder = 0;

    private Boolean isActive = true;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum Type {
        IMAGE, VIDEO
    }

    public enum AnimationType {
        SLIDE, FADE
    }
}
