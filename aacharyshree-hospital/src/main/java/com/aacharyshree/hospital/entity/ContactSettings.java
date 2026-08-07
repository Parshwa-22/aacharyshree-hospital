package com.aacharyshree.hospital.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Click-to-call phone numbers used across the site (single row, id always
 * 1) — e.g. "Book Appointment" on a doctor card, "Donate" on the donors
 * page. Editable from the admin panel instead of hardcoded.
 */
@Entity
@Table(name = "contact_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactSettings {

    @Id
    private Long id = 1L;

    // Used by "Book Appointment" buttons (doctor cards, doctor detail).
    private String appointmentPhone;

    // Used by "Donate" / "Contact for Donation" buttons on the donors page.
    private String donationPhone;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
