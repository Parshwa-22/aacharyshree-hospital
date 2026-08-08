package com.aacharyshree.hospital.controller;

import com.aacharyshree.hospital.entity.Monk;
import com.aacharyshree.hospital.entity.MonkLocation;
import com.aacharyshree.hospital.repository.MonkRepository;
import com.aacharyshree.hospital.repository.MonkLocationRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/monks")
@RequiredArgsConstructor
public class MonkController {
    private final MonkRepository repository;
    private final MonkLocationRepository locationRepository;
    private static final Pattern COORDINATES = Pattern.compile("(?:@|!3d)(-?\\d+(?:\\.\\d+)?)[,!](?:4d)?(-?\\d+(?:\\.\\d+)?)|(?:[?&](?:q|query|ll)=)(-?\\d+(?:\\.\\d+)?)(?:,|%2C)(-?\\d+(?:\\.\\d+)?)", Pattern.CASE_INSENSITIVE);

    @GetMapping public List<Monk> list(@RequestParam(required = false) Boolean active) {
        return repository.findAll().stream().filter(m -> active == null || !active || Boolean.TRUE.equals(m.getIsActive())).toList();
    }
    @PostMapping public Monk create(@Valid @RequestBody Monk monk) {
        if ((monk.getLatitude() == null || monk.getLongitude() == null) && monk.getLocationLink() != null) {
            Matcher matcher = COORDINATES.matcher(monk.getLocationLink());
            if (matcher.find()) { monk.setLatitude(Double.valueOf(matcher.group(1) != null ? matcher.group(1) : matcher.group(3))); monk.setLongitude(Double.valueOf(matcher.group(2) != null ? matcher.group(2) : matcher.group(4))); }
        }
        if ((monk.getLatitude() != null) != (monk.getLongitude() != null)) throw new IllegalArgumentException("Latitude and longitude must be supplied together");
        if (monk.getLatitude() != null) validate(monk.getLatitude(), monk.getLongitude());
        Monk saved = repository.save(monk);
        if (saved.getLatitude() != null && saved.getLongitude() != null) appendHistory(saved, saved.getLatitude(), saved.getLongitude(), saved.getLocationLabel(), saved.getLocationLink(), "INITIAL");
        return saved;
    }
    @PutMapping("/{id}") public ResponseEntity<Monk> update(@PathVariable Long id, @Valid @RequestBody Monk input) {
        return repository.findById(id).map(m -> {
            Double previousLatitude = m.getLatitude();
            Double previousLongitude = m.getLongitude();
            m.setName(input.getName()); m.setGroupName(input.getGroupName()); m.setPhoto(input.getPhoto()); m.setTravelReason(input.getTravelReason());
            if (input.getLocationLink() != null) m.setLocationLink(input.getLocationLink());
            if ((input.getLatitude() != null) != (input.getLongitude() != null)) throw new IllegalArgumentException("Latitude and longitude must be supplied together");
            if (input.getLatitude() != null && input.getLongitude() != null) { validate(input.getLatitude(), input.getLongitude()); m.setLatitude(input.getLatitude()); m.setLongitude(input.getLongitude()); }
            boolean changed = input.getLatitude() != null && input.getLongitude() != null && (!input.getLatitude().equals(previousLatitude) || !input.getLongitude().equals(previousLongitude));
            if (input.getLocationLabel() != null) m.setLocationLabel(input.getLocationLabel());
            if (input.getLocationUpdates() != null) m.setLocationUpdates(input.getLocationUpdates());
            if (input.getIsActive() != null) m.setIsActive(input.getIsActive());
            Monk saved = repository.save(m);
            if (changed) appendHistory(saved, input.getLatitude(), input.getLongitude(), input.getLocationLabel(), input.getLocationLink(), "ADMIN");
            return ResponseEntity.ok(saved);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repository.existsById(id)) return ResponseEntity.notFound().build();
        repository.deleteById(id); return ResponseEntity.noContent().build();
    }
    @PostMapping("/{id}/location") public ResponseEntity<Monk> updateLocation(@PathVariable Long id, @RequestBody LocationUpdate update) {
        return repository.findById(id).map(m -> {
            Double latitude = update.latitude(); Double longitude = update.longitude();
            if ((latitude == null || longitude == null) && update.link() != null) {
                Matcher matcher = COORDINATES.matcher(update.link());
                if (matcher.find()) { latitude = Double.valueOf(matcher.group(1) != null ? matcher.group(1) : matcher.group(3)); longitude = Double.valueOf(matcher.group(2) != null ? matcher.group(2) : matcher.group(4)); }
            }
            validate(latitude, longitude);
            m.setLatitude(latitude); m.setLongitude(longitude); m.setLocationLink(update.link()); m.setLocationLabel(update.label());
            m.setTravelReason(update.travelReason());
            appendHistory(m, latitude, longitude, update.label(), update.link(), update.source() == null ? "LINK" : update.source());
            String old = m.getLocationUpdates() == null || m.getLocationUpdates().isBlank() ? "[]" : m.getLocationUpdates();
            String item = String.format("{\"latitude\":%s,\"longitude\":%s,\"label\":\"%s\",\"source\":\"%s\",\"timestamp\":\"%s\"}", latitude, longitude, update.label() == null ? "" : update.label().replace("\"", "\\\""), update.source() == null ? "LINK" : update.source(), Instant.now());
            m.setLocationUpdates(old.equals("[]") ? "[" + item + "]" : old.substring(0, old.length() - 1) + "," + item + "]");
            return ResponseEntity.ok(repository.save(m));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
    private void validate(Double latitude, Double longitude) {
        if (latitude == null || longitude == null || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) throw new IllegalArgumentException("Valid coordinates are required (latitude -90..90, longitude -180..180)");
    }
    private void appendHistory(Monk monk, Double latitude, Double longitude, String label, String link, String source) {
        validate(latitude, longitude);
        MonkLocation point = new MonkLocation(); point.setMonk(monk); point.setLatitude(latitude); point.setLongitude(longitude); point.setLocationLabel(label); point.setGoogleMapsLink(link); point.setTravelReason(monk.getTravelReason()); point.setPhoto(monk.getPhoto()); point.setSource(source);
        locationRepository.save(point);
    }
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<java.util.Map<String, String>> badRequest(IllegalArgumentException exception) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(java.util.Map.of("message", exception.getMessage()));
    }
    public record LocationUpdate(Double latitude, Double longitude, String label, String source, String link, String travelReason) {}
}
