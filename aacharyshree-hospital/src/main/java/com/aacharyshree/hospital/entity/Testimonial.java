package com.aacharyshree.hospital.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "testimonials")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Testimonial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String patientName;

    @Enumerated(EnumType.STRING)
    private Type type = Type.VIDEO;

    @Column(length = 1000)
    private String message;

    private String image;
    private String videoUrl;
    private String thumbnail;

    private Integer rating;

    private Integer displayOrder = 0;

    private Boolean isActive = true;

    // Per-language override for `message` — {"hi":{"message":"..."}, "mr":{...}, "kn":{...}}
    @Column(columnDefinition = "TEXT")
    private String translations;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum Type {
        TEXT, IMAGE, VIDEO
    }
}
