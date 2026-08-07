package com.aacharyshree.hospital.service.impl;

import com.aacharyshree.hospital.dto.ReorderItemDto;
import com.aacharyshree.hospital.entity.HeroSlide;
import com.aacharyshree.hospital.exception.ResourceNotFoundException;
import com.aacharyshree.hospital.repository.HeroSlideRepository;
import com.aacharyshree.hospital.service.HeroSlideService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HeroSlideServiceImpl implements HeroSlideService {

    private final HeroSlideRepository repository;

    @Override
    public List<HeroSlide> getAll() {
        return repository.findAllByOrderByDisplayOrderAsc();
    }

    @Override
    public List<HeroSlide> getActive() {
        return repository.findByIsActiveTrueOrderByDisplayOrderAsc();
    }

    @Override
    public HeroSlide getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("HeroSlide", id));
    }

    @Override
    public HeroSlide create(HeroSlide slide) {
        if (slide.getDisplayOrder() == null) {
            slide.setDisplayOrder((int) repository.count());
        }
        return repository.save(slide);
    }

    @Override
    public HeroSlide update(Long id, HeroSlide incoming) {
        HeroSlide existing = getById(id);
        existing.setType(incoming.getType());
        existing.setImage(incoming.getImage());
        existing.setVideoUrl(incoming.getVideoUrl());
        existing.setThumbnail(incoming.getThumbnail());
        if (incoming.getAnimationType() != null) {
            existing.setAnimationType(incoming.getAnimationType());
        }
        if (incoming.getDisplayOrder() != null) {
            existing.setDisplayOrder(incoming.getDisplayOrder());
        }
        if (incoming.getIsActive() != null) {
            existing.setIsActive(incoming.getIsActive());
        }
        return repository.save(existing);
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw ResourceNotFoundException.of("HeroSlide", id);
        }
        repository.deleteById(id);
    }

    @Override
    @Transactional
    public void reorder(List<ReorderItemDto> items) {
        Map<Long, HeroSlide> byId = repository.findAllById(
                items.stream().map(ReorderItemDto::getId).collect(Collectors.toList())
        ).stream().collect(Collectors.toMap(HeroSlide::getId, h -> h));

        for (ReorderItemDto item : items) {
            HeroSlide h = byId.get(item.getId());
            if (h != null) {
                h.setDisplayOrder(item.getDisplayOrder());
            }
        }
        repository.saveAll(byId.values());
    }
}
