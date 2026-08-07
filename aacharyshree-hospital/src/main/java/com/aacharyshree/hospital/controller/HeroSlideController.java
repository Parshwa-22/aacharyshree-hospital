package com.aacharyshree.hospital.controller;

import com.aacharyshree.hospital.dto.ApiResponse;
import com.aacharyshree.hospital.dto.ReorderItemDto;
import com.aacharyshree.hospital.entity.HeroSlide;
import com.aacharyshree.hospital.service.HeroSlideService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hero")
@RequiredArgsConstructor
public class HeroSlideController {

    private final HeroSlideService service;

    @GetMapping
    public List<HeroSlide> getAll(@RequestParam(required = false) Boolean active) {
        return Boolean.TRUE.equals(active) ? service.getActive() : service.getAll();
    }

    @GetMapping("/{id}")
    public HeroSlide getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public HeroSlide create(@RequestBody HeroSlide slide) {
        return service.create(slide);
    }

    @PutMapping("/{id}")
    public HeroSlide update(@PathVariable Long id, @RequestBody HeroSlide slide) {
        return service.update(id, slide);
    }

    @DeleteMapping("/{id}")
    public ApiResponse delete(@PathVariable Long id) {
        service.delete(id);
        return ApiResponse.ok("Hero slide deleted");
    }

    @PutMapping("/reorder")
    public ApiResponse reorder(@RequestBody List<ReorderItemDto> items) {
        service.reorder(items);
        return ApiResponse.ok("Order updated");
    }
}
