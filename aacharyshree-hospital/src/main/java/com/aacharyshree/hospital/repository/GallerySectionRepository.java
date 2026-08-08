package com.aacharyshree.hospital.repository;
import com.aacharyshree.hospital.entity.GallerySection;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface GallerySectionRepository extends JpaRepository<GallerySection, Long> {
    List<GallerySection> findByIsActiveTrueOrderByDisplayOrderAsc();
}
