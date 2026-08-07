package com.aacharyshree.hospital.repository;

import com.aacharyshree.hospital.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
    List<Department> findAllByOrderByDisplayOrderAsc();
    List<Department> findByIsActiveTrueOrderByDisplayOrderAsc();
    Optional<Department> findBySlug(String slug);
}
