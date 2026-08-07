package com.aacharyshree.hospital.repository;

import com.aacharyshree.hospital.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findAllByOrderByDisplayOrderAsc();
    List<Product> findByIsActiveTrueOrderByDisplayOrderAsc();
}
