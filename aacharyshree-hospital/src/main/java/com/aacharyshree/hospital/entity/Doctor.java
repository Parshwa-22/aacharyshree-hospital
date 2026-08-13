package com.aacharyshree.hospital.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "doctors")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    // Free text, but the admin panel presents this as a searchable dropdown
    // built from a comprehensive list of specializations (Cardiologist,
    // Panchakarma Specialist, etc.) — see entityConfigs.js on the frontend.
    private String specialization;

    private String experience;

    // Also a searchable-dropdown field in the admin panel (MBBS, BAMS, MD, ...).
    private String qualification;

    private String image;

    // Groups doctors on the public /doctors page (e.g. "Ayurvedic",
    // "Allopathic", "Diagnostic"). Distinct from `specialization`, which is
    // the doctor's specific title (e.g. "Cardiologist"). Also a searchable
    // dropdown in the admin panel.
    private String department;

    // Structured availability, replacing the old free-text field:
    // comma-separated day codes, e.g. "MON,TUE,WED,FRI"
    private String availableDays;

    // "HH:mm" 24-hour strings, e.g. "09:00" / "17:30"
    private String startTime;
    private String endTime;

    // Comma-separated ISO dates for doctors who visit on selected calendar
    // dates rather than a recurring weekly schedule, e.g. "2026-08-15,2026-08-29".
    @Column(length = 1000)
    private String availableDates;

    @Enumerated(EnumType.STRING)
    private AvailabilityType availabilityType = AvailabilityType.DAILY;

    @Column(length = 1000)
    private String description;

    // Order in which doctors are displayed on the site (lower = first)
    private Integer displayOrder = 0;

    private Boolean isActive = true;

    // JSON blob of per-language overrides for translatable fields, e.g.
    // {"hi":{"specialization":"...","qualification":"...","department":"...","description":"..."},
    //  "mr":{...}, "kn":{...}}
    // The base fields above (specialization, qualification, department,
    // description) stay in English; the frontend falls back to them
    // whenever the current language has no entry here. Not parsed
    // server-side — stored and returned as-is.
    @Column(columnDefinition = "TEXT")
    private String translations;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum AvailabilityType {
        DAILY, ON_CALL, SPECIFIC_DATES
    }
}
