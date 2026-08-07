package com.aacharyshree.hospital.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * A navbar or footer link, fully managed from the admin panel.
 * Lets the admin add/remove/reorder tabs without touching frontend code.
 */
@Entity
@Table(name = "nav_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NavItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // What the visitor sees, e.g. "Donors"
    private String label;

    // Where it goes, e.g. "/donors" (internal route) or a full external URL
    private String path;

    // Opens in a new tab if true (useful for external links)
    private Boolean openInNewTab = false;

    @Enumerated(EnumType.STRING)
    private Location location = Location.NAVBAR;

    private Integer displayOrder = 0;

    private Boolean isActive = true;

    // Per-language override for `label` — {"hi":{"label":"..."}, "mr":{...}, "kn":{...}}
    @Column(columnDefinition = "TEXT")
    private String translations;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum Location {
        NAVBAR, FOOTER, BOTH
    }
}
