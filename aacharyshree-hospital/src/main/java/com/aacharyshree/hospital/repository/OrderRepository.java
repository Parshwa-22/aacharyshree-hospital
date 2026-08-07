package com.aacharyshree.hospital.repository;

import com.aacharyshree.hospital.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findAllByOrderByCreatedAtDesc();
    Optional<Order> findByIdAndCustomerPhone(Long id, String customerPhone);
}
