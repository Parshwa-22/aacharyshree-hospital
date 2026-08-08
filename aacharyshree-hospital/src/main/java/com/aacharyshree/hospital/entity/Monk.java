package com.aacharyshree.hospital.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/** A travelling monk/group with a current coordinate and an append-only history. */
@Entity
@Table(name = "monks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Monk {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank private String name;
    private Double latitude;
    private Double longitude;
    private String locationLabel;
    /** JSON array of timestamped updates; ready for a future GPS device feed. */
    @Column(columnDefinition = "TEXT")
    private String locationUpdates = "[]";
    private Boolean isActive = true;
    @CreationTimestamp @Column(updatable = false) private LocalDateTime createdAt;
    @UpdateTimestamp private LocalDateTime updatedAt;
}
