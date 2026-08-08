package com.aacharyshree.hospital.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "events")
@Data @NoArgsConstructor @AllArgsConstructor
public class Event {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @NotBlank private String name;
    @Column(length = 4000) private String description;
    private LocalDate eventDate;
    private LocalTime eventTime;
    private String place;
    private String guestSpeakers;
    @Enumerated(EnumType.STRING) private EventType eventType = EventType.ONE_TIME;
    private String recurrenceRule;
    @Column(columnDefinition = "TEXT") private String posterImages = "[]";
    @Column(columnDefinition = "TEXT") private String photos = "[]";
    @Column(columnDefinition = "TEXT") private String videos = "[]";
    private Boolean isNew = true;
    private Boolean isActive = true;
    @Column(columnDefinition = "TEXT") private String translations;
    @CreationTimestamp @Column(updatable = false) private LocalDateTime createdAt;
    @UpdateTimestamp private LocalDateTime updatedAt;
    public enum EventType { ONE_TIME, RECURRING }
}
