package com.aacharyshree.hospital.repository;

import com.aacharyshree.hospital.entity.Counter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CounterRepository extends JpaRepository<Counter, Long> {
    List<Counter> findAllByOrderByDisplayOrderAsc();
    List<Counter> findByIsActiveTrueOrderByDisplayOrderAsc();
}
