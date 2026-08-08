package com.aacharyshree.hospital.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity @Table(name = "gallery_sections")
@Data @NoArgsConstructor @AllArgsConstructor
public class GallerySection {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @NotBlank private String title;
    /** JSON array of image URLs; unlimited entries are supported. */
    @Column(columnDefinition = "TEXT") private String photos = "[]";
    private Integer displayOrder = 0;
    private Boolean isActive = true;
    @Column(columnDefinition = "TEXT") private String translations;
    @CreationTimestamp @Column(updatable = false) private LocalDateTime createdAt;
    @UpdateTimestamp private LocalDateTime updatedAt;
}
