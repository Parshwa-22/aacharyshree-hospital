package com.aacharyshree.hospital.service.impl;

import com.aacharyshree.hospital.dto.ReorderItemDto;
import com.aacharyshree.hospital.entity.Product;
import com.aacharyshree.hospital.exception.ResourceNotFoundException;
import com.aacharyshree.hospital.repository.ProductRepository;
import com.aacharyshree.hospital.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository repository;

    private void initialize(Product product) {
        if (product == null) return;
        product.getImages().size(); // force-load within the transaction, see RoomServiceImpl for why
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> getAll() {
        List<Product> products = repository.findAllByOrderByDisplayOrderAsc();
        products.forEach(this::initialize);
        return products;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> getActive() {
        List<Product> products = repository.findByIsActiveTrueOrderByDisplayOrderAsc();
        products.forEach(this::initialize);
        return products;
    }

    @Override
    @Transactional(readOnly = true)
    public Product getById(Long id) {
        Product product = repository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Product", id));
        initialize(product);
        return product;
    }

    @Override
    @Transactional
    public Product create(Product product) {
        if (product.getDisplayOrder() == null) {
            product.setDisplayOrder((int) repository.count());
        }
        if (product.getImages() != null) {
            for (int i = 0; i < product.getImages().size(); i++) {
                product.getImages().get(i).setProduct(product);
                if (product.getImages().get(i).getDisplayOrder() == null) {
                    product.getImages().get(i).setDisplayOrder(i);
                }
            }
        }
        Product saved = repository.save(product);
        initialize(saved);
        return saved;
    }

    @Override
    @Transactional
    public Product update(Long id, Product incoming) {
        Product existing = repository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Product", id));

        existing.setName(incoming.getName());
        existing.setDescription(incoming.getDescription());
        existing.setPrice(incoming.getPrice());
        existing.setStock(incoming.getStock());
        existing.setCategory(incoming.getCategory());
        existing.setTranslations(incoming.getTranslations());
        if (incoming.getDisplayOrder() != null) {
            existing.setDisplayOrder(incoming.getDisplayOrder());
        }
        if (incoming.getIsActive() != null) {
            existing.setIsActive(incoming.getIsActive());
        }

        existing.getImages().clear();
        if (incoming.getImages() != null) {
            for (int i = 0; i < incoming.getImages().size(); i++) {
                var img = incoming.getImages().get(i);
                img.setProduct(existing);
                if (img.getDisplayOrder() == null) {
                    img.setDisplayOrder(i);
                }
                existing.getImages().add(img);
            }
        }

        Product saved = repository.save(existing);
        initialize(saved);
        return saved;
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Product product = repository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Product", id));
        product.getImages().clear();
        repository.saveAndFlush(product);
        repository.delete(product);
    }

    @Override
    @Transactional
    public void reorder(List<ReorderItemDto> items) {
        Map<Long, Product> byId = repository.findAllById(
                items.stream().map(ReorderItemDto::getId).collect(Collectors.toList())
        ).stream().collect(Collectors.toMap(Product::getId, p -> p));

        for (ReorderItemDto item : items) {
            Product p = byId.get(item.getId());
            if (p != null) {
                p.setDisplayOrder(item.getDisplayOrder());
            }
        }
        repository.saveAll(byId.values());
    }

    @Override
    @Transactional
    public void reduceStock(Long productId, int quantity) {
        Product product = repository.findById(productId)
                .orElseThrow(() -> ResourceNotFoundException.of("Product", productId));
        int remaining = (product.getStock() == null ? 0 : product.getStock()) - quantity;
        if (remaining < 0) {
            throw new IllegalStateException("Not enough stock for " + product.getName());
        }
        product.setStock(remaining);
        repository.save(product);
    }
}
