package com.aacharyshree.hospital.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "monk_locations")
@Data
@NoArgsConstructor
public class MonkLocation {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "monk_id", nullable = false) @JsonIgnore
    private Monk monk;
    @Column(nullable = false) private Double latitude;
    @Column(nullable = false) private Double longitude;
    private String locationLabel;
    @Column(columnDefinition = "TEXT") private String googleMapsLink;
    @Column(columnDefinition = "TEXT") private String travelReason;
    private String photo;
    private String source;
    @CreationTimestamp @Column(nullable = false, updatable = false) private LocalDateTime recordedAt;
}
