package com.aacharyshree.hospital.controller;

import com.aacharyshree.hospital.dto.ApiResponse;
import com.aacharyshree.hospital.dto.ReorderItemDto;
import com.aacharyshree.hospital.entity.Testimonial;
import com.aacharyshree.hospital.service.TestimonialService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/testimonials")
@RequiredArgsConstructor
public class TestimonialController {

    private final TestimonialService service;

    @GetMapping
    public List<Testimonial> getAll(@RequestParam(required = false) Boolean active) {
        return Boolean.TRUE.equals(active) ? service.getActive() : service.getAll();
    }

    @GetMapping("/{id}")
    public Testimonial getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public Testimonial create(@RequestBody Testimonial testimonial) {
        return service.create(testimonial);
    }

    @PutMapping("/{id}")
    public Testimonial update(@PathVariable Long id, @RequestBody Testimonial testimonial) {
        return service.update(id, testimonial);
    }

    @DeleteMapping("/{id}")
    public ApiResponse delete(@PathVariable Long id) {
        service.delete(id);
        return ApiResponse.ok("Testimonial deleted");
    }

    @PutMapping("/reorder")
    public ApiResponse reorder(@RequestBody List<ReorderItemDto> items) {
        service.reorder(items);
        return ApiResponse.ok("Order updated");
    }
}
