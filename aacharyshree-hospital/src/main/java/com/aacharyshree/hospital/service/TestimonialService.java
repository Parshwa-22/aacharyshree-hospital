package com.aacharyshree.hospital.service;

import com.aacharyshree.hospital.dto.ReorderItemDto;
import com.aacharyshree.hospital.entity.Testimonial;

import java.util.List;

public interface TestimonialService {
    List<Testimonial> getAll();
    List<Testimonial> getActive();
    Testimonial getById(Long id);
    Testimonial create(Testimonial testimonial);
    Testimonial update(Long id, Testimonial testimonial);
    void delete(Long id);
    void reorder(List<ReorderItemDto> items);
}
