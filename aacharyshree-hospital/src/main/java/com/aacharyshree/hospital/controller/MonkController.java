package com.aacharyshree.hospital.controller;

import com.aacharyshree.hospital.entity.Monk;
import com.aacharyshree.hospital.repository.MonkRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/monks")
@RequiredArgsConstructor
public class MonkController {
    private final MonkRepository repository;

    @GetMapping public List<Monk> list(@RequestParam(required = false) Boolean active) {
        return repository.findAll().stream().filter(m -> active == null || !active || Boolean.TRUE.equals(m.getIsActive())).toList();
    }
    @PostMapping public Monk create(@Valid @RequestBody Monk monk) { return repository.save(monk); }
    @PutMapping("/{id}") public ResponseEntity<Monk> update(@PathVariable Long id, @Valid @RequestBody Monk input) {
        return repository.findById(id).map(m -> {
            m.setName(input.getName()); m.setLatitude(input.getLatitude()); m.setLongitude(input.getLongitude());
            m.setLocationLabel(input.getLocationLabel()); m.setLocationUpdates(input.getLocationUpdates()); m.setIsActive(input.getIsActive());
            return ResponseEntity.ok(repository.save(m));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repository.existsById(id)) return ResponseEntity.notFound().build();
        repository.deleteById(id); return ResponseEntity.noContent().build();
    }
    @PostMapping("/{id}/location") public ResponseEntity<Monk> updateLocation(@PathVariable Long id, @RequestBody LocationUpdate update) {
        return repository.findById(id).map(m -> {
            m.setLatitude(update.latitude()); m.setLongitude(update.longitude()); m.setLocationLabel(update.label());
            String old = m.getLocationUpdates() == null || m.getLocationUpdates().isBlank() ? "[]" : m.getLocationUpdates();
            String item = String.format("{\"latitude\":%s,\"longitude\":%s,\"label\":\"%s\",\"source\":\"%s\",\"timestamp\":\"%s\"}", update.latitude(), update.longitude(), update.label() == null ? "" : update.label().replace("\"", "\\\""), update.source() == null ? "MANUAL" : update.source(), Instant.now());
            m.setLocationUpdates(old.equals("[]") ? "[" + item + "]" : old.substring(0, old.length() - 1) + "," + item + "]");
            return ResponseEntity.ok(repository.save(m));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
    public record LocationUpdate(Double latitude, Double longitude, String label, String source) {}
}
