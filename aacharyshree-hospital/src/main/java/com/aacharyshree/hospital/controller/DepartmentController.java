package com.aacharyshree.hospital.controller;

import com.aacharyshree.hospital.dto.ApiResponse;
import com.aacharyshree.hospital.dto.ReorderItemDto;
import com.aacharyshree.hospital.entity.Department;
import com.aacharyshree.hospital.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService service;

    @GetMapping
    public List<Department> getAll(@RequestParam(required = false) Boolean active) {
        return Boolean.TRUE.equals(active) ? service.getActive() : service.getAll();
    }

    @GetMapping("/{id}")
    public Department getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping("/slug/{slug}")
    public Department getBySlug(@PathVariable String slug) {
        return service.getBySlug(slug);
    }

    @PostMapping
    public Department create(@RequestBody Department department) {
        return service.create(department);
    }

    @PutMapping("/{id}")
    public Department update(@PathVariable Long id, @RequestBody Department department) {
        return service.update(id, department);
    }

    @DeleteMapping("/{id}")
    public ApiResponse delete(@PathVariable Long id) {
        service.delete(id);
        return ApiResponse.ok("Department deleted");
    }

    @PutMapping("/reorder")
    public ApiResponse reorder(@RequestBody List<ReorderItemDto> items) {
        service.reorder(items);
        return ApiResponse.ok("Order updated");
    }
}
