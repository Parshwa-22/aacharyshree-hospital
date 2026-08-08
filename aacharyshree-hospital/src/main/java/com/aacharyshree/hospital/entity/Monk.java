package com.aacharyshree.hospital.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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
    private String groupName;
    private String photo;
    @Column(columnDefinition = "TEXT") private String travelReason;
    /** Shared Google Maps link supplied by admin or a future GPS client. */
    @Column(columnDefinition = "TEXT") private String locationLink;
    private Double latitude;
    private Double longitude;
    private String locationLabel;
    /** JSON array of timestamped updates; ready for a future GPS device feed. */
    @Column(columnDefinition = "TEXT")
    private String locationUpdates = "[]";
    @OneToMany(mappedBy = "monk", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @OrderBy("recordedAt ASC")
    private List<MonkLocation> locationHistory = new ArrayList<>();
    private Boolean isActive = true;
    @CreationTimestamp @Column(updatable = false) private LocalDateTime createdAt;
    @UpdateTimestamp private LocalDateTime updatedAt;
}
