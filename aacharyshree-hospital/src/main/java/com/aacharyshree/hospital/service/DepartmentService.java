package com.aacharyshree.hospital.service;

import com.aacharyshree.hospital.dto.ReorderItemDto;
import com.aacharyshree.hospital.entity.Department;

import java.util.List;

public interface DepartmentService {
    List<Department> getAll();
    List<Department> getActive();
    Department getById(Long id);
    Department getBySlug(String slug);
    Department create(Department department);
    Department update(Long id, Department department);
    void delete(Long id);
    void reorder(List<ReorderItemDto> items);
}
