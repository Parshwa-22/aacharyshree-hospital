package com.aacharyshree.hospital.service;

import com.aacharyshree.hospital.dto.ReorderItemDto;
import com.aacharyshree.hospital.entity.Product;

import java.util.List;

public interface ProductService {
    List<Product> getAll();
    List<Product> getActive();
    Product getById(Long id);
    Product create(Product product);
    Product update(Long id, Product product);
    void delete(Long id);
    void reorder(List<ReorderItemDto> items);
    /** Reduces stock after a paid order — throws if not enough stock left. */
    void reduceStock(Long productId, int quantity);
}
