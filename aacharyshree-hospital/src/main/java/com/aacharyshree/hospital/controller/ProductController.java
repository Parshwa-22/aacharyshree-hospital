package com.aacharyshree.hospital.controller;

import com.aacharyshree.hospital.dto.ApiResponse;
import com.aacharyshree.hospital.dto.ReorderItemDto;
import com.aacharyshree.hospital.entity.Product;
import com.aacharyshree.hospital.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService service;

    @GetMapping
    public List<Product> getAll(@RequestParam(required = false) Boolean active) {
        return Boolean.TRUE.equals(active) ? service.getActive() : service.getAll();
    }

    @GetMapping("/{id}")
    public Product getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public Product create(@Valid @RequestBody Product product) {
        return service.create(product);
    }

    @PutMapping("/{id}")
    public Product update(@PathVariable Long id, @Valid @RequestBody Product product) {
        return service.update(id, product);
    }

    @DeleteMapping("/{id}")
    public ApiResponse delete(@PathVariable Long id) {
        service.delete(id);
        return ApiResponse.ok("Product deleted");
    }

    @PutMapping("/reorder")
    public ApiResponse reorder(@RequestBody List<ReorderItemDto> items) {
        service.reorder(items);
        return ApiResponse.ok("Order updated");
    }
}
