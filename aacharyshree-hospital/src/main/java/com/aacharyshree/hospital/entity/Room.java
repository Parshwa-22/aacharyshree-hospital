package com.aacharyshree.hospital.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "rooms")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String roomName;

    // Free text, but the admin panel presents this as a dropdown of
    // standard hospital room types (see entityConfigs.js on the frontend).
    private String type;

    @DecimalMin(value = "0.0", message = "Price cannot be negative")
    private Double price;

    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    private String view360Url;

    @Column(length = 1000)
    private String description;

    private Boolean availability = true;

    private Boolean isActive = true;

    // How the photo gallery transitions between images — a preset
    // ("Fade", "Slide", "Zoom") or any custom value the admin types in.
    private String animationType = "Fade";

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<RoomImage> images = new ArrayList<>();

    // A single unified "what's in this room" checklist (amenities and
    // features were merged into one list per admin feedback — no more
    // separate free-text features table).
    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<RoomAmenity> amenities = new ArrayList<>();

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
