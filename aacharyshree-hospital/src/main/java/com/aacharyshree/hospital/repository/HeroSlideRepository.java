package com.aacharyshree.hospital.repository;

import com.aacharyshree.hospital.entity.HeroSlide;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HeroSlideRepository extends JpaRepository<HeroSlide, Long> {
    List<HeroSlide> findAllByOrderByDisplayOrderAsc();
    List<HeroSlide> findByIsActiveTrueOrderByDisplayOrderAsc();
}
