package com.aacharyshree.hospital.service;

import com.aacharyshree.hospital.dto.ReorderItemDto;
import com.aacharyshree.hospital.entity.HeroSlide;

import java.util.List;

public interface HeroSlideService {
    List<HeroSlide> getAll();
    List<HeroSlide> getActive();
    HeroSlide getById(Long id);
    HeroSlide create(HeroSlide slide);
    HeroSlide update(Long id, HeroSlide slide);
    void delete(Long id);
    void reorder(List<ReorderItemDto> items);
}
