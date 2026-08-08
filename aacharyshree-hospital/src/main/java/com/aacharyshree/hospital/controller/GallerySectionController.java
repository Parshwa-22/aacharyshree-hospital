package com.aacharyshree.hospital.controller;
import com.aacharyshree.hospital.entity.GallerySection;
import com.aacharyshree.hospital.repository.GallerySectionRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/gallery") @RequiredArgsConstructor
public class GallerySectionController {
    private final GallerySectionRepository repository;
    @GetMapping public List<GallerySection> list(@RequestParam(required=false) Boolean active) { return Boolean.TRUE.equals(active) ? repository.findByIsActiveTrueOrderByDisplayOrderAsc() : repository.findAll(); }
    @PostMapping public GallerySection create(@Valid @RequestBody GallerySection section) { return repository.save(section); }
    @PutMapping("/{id}") public ResponseEntity<GallerySection> update(@PathVariable Long id, @Valid @RequestBody GallerySection input) { return repository.findById(id).map(s -> { s.setTitle(input.getTitle()); s.setPhotos(input.getPhotos()); s.setDisplayOrder(input.getDisplayOrder()); s.setIsActive(input.getIsActive()); s.setTranslations(input.getTranslations()); return ResponseEntity.ok(repository.save(s)); }).orElseGet(() -> ResponseEntity.notFound().build()); }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id) { if (!repository.existsById(id)) return ResponseEntity.notFound().build(); repository.deleteById(id); return ResponseEntity.noContent().build(); }
}
