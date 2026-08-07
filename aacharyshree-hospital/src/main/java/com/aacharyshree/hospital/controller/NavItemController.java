package com.aacharyshree.hospital.controller;

import com.aacharyshree.hospital.dto.ApiResponse;
import com.aacharyshree.hospital.dto.ReorderItemDto;
import com.aacharyshree.hospital.entity.NavItem;
import com.aacharyshree.hospital.service.NavItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/nav-items")
@RequiredArgsConstructor
public class NavItemController {

    private final NavItemService service;

    /** e.g. GET /api/nav-items?location=NAVBAR&active=true */
    @GetMapping
    public List<NavItem> getAll(
            @RequestParam(required = false) NavItem.Location location,
            @RequestParam(required = false) Boolean active
    ) {
        return service.getAll(location, active);
    }

    @GetMapping("/{id}")
    public NavItem getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public NavItem create(@RequestBody NavItem navItem) {
        return service.create(navItem);
    }

    @PutMapping("/{id}")
    public NavItem update(@PathVariable Long id, @RequestBody NavItem navItem) {
        return service.update(id, navItem);
    }

    @DeleteMapping("/{id}")
    public ApiResponse delete(@PathVariable Long id) {
        service.delete(id);
        return ApiResponse.ok("Nav item deleted");
    }

    @PutMapping("/reorder")
    public ApiResponse reorder(@RequestBody List<ReorderItemDto> items) {
        service.reorder(items);
        return ApiResponse.ok("Order updated");
    }
}
