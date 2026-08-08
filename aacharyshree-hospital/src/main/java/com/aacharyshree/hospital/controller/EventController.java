package com.aacharyshree.hospital.controller;

import com.aacharyshree.hospital.entity.Event;
import com.aacharyshree.hospital.repository.EventRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {
    private final EventRepository repository;
    @GetMapping public List<Event> list(@RequestParam(required = false) Boolean active) {
        return Boolean.TRUE.equals(active) ? repository.findByIsActiveTrueOrderByEventDateAsc() : repository.findAll();
    }
    @GetMapping("/{id}") public ResponseEntity<Event> get(@PathVariable Long id) {
        return repository.findById(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    @PostMapping public Event create(@Valid @RequestBody Event event) { return repository.save(event); }
    @PutMapping("/{id}") public ResponseEntity<Event> update(@PathVariable Long id, @Valid @RequestBody Event input) {
        return repository.findById(id).map(e -> {
            e.setName(input.getName()); e.setDescription(input.getDescription()); e.setEventDate(input.getEventDate());
            e.setEventTime(input.getEventTime()); e.setPlace(input.getPlace()); e.setGuestSpeakers(input.getGuestSpeakers());
            e.setEventType(input.getEventType()); e.setRecurrenceRule(input.getRecurrenceRule()); e.setPosterImages(input.getPosterImages());
            e.setPhotos(input.getPhotos()); e.setVideos(input.getVideos()); e.setIsNew(input.getIsNew()); e.setIsActive(input.getIsActive());
            e.setTranslations(input.getTranslations()); return ResponseEntity.ok(repository.save(e));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repository.existsById(id)) return ResponseEntity.notFound().build();
        repository.deleteById(id); return ResponseEntity.noContent().build();
    }
}
