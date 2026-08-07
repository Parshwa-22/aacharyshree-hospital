package com.aacharyshree.hospital.service.impl;

import com.aacharyshree.hospital.dto.ReorderItemDto;
import com.aacharyshree.hospital.entity.Testimonial;
import com.aacharyshree.hospital.exception.ResourceNotFoundException;
import com.aacharyshree.hospital.repository.TestimonialRepository;
import com.aacharyshree.hospital.service.TestimonialService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TestimonialServiceImpl implements TestimonialService {

    private final TestimonialRepository repository;

    @Override
    public List<Testimonial> getAll() {
        return repository.findAllByOrderByDisplayOrderAsc();
    }

    @Override
    public List<Testimonial> getActive() {
        return repository.findByIsActiveTrueOrderByDisplayOrderAsc();
    }

    @Override
    public Testimonial getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Testimonial", id));
    }

    @Override
    public Testimonial create(Testimonial testimonial) {
        if (testimonial.getDisplayOrder() == null) {
            testimonial.setDisplayOrder((int) repository.count());
        }
        return repository.save(testimonial);
    }

    @Override
    public Testimonial update(Long id, Testimonial incoming) {
        Testimonial existing = getById(id);
        existing.setPatientName(incoming.getPatientName());
        existing.setType(incoming.getType());
        existing.setMessage(incoming.getMessage());
        existing.setImage(incoming.getImage());
        existing.setVideoUrl(incoming.getVideoUrl());
        existing.setThumbnail(incoming.getThumbnail());
        existing.setRating(incoming.getRating());
        if (incoming.getDisplayOrder() != null) {
            existing.setDisplayOrder(incoming.getDisplayOrder());
        }
        if (incoming.getIsActive() != null) {
            existing.setIsActive(incoming.getIsActive());
        }
        existing.setTranslations(incoming.getTranslations());
        return repository.save(existing);
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw ResourceNotFoundException.of("Testimonial", id);
        }
        repository.deleteById(id);
    }

    @Override
    @Transactional
    public void reorder(List<ReorderItemDto> items) {
        Map<Long, Testimonial> byId = repository.findAllById(
                items.stream().map(ReorderItemDto::getId).collect(Collectors.toList())
        ).stream().collect(Collectors.toMap(Testimonial::getId, t -> t));

        for (ReorderItemDto item : items) {
            Testimonial t = byId.get(item.getId());
            if (t != null) {
                t.setDisplayOrder(item.getDisplayOrder());
            }
        }
        repository.saveAll(byId.values());
    }
}
