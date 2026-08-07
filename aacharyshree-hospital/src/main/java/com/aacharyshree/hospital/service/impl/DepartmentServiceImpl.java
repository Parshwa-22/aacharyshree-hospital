package com.aacharyshree.hospital.service.impl;

import com.aacharyshree.hospital.dto.ReorderItemDto;
import com.aacharyshree.hospital.entity.Department;
import com.aacharyshree.hospital.exception.ResourceNotFoundException;
import com.aacharyshree.hospital.repository.DepartmentRepository;
import com.aacharyshree.hospital.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository repository;

    @Override
    public List<Department> getAll() {
        return repository.findAllByOrderByDisplayOrderAsc();
    }

    @Override
    public List<Department> getActive() {
        return repository.findByIsActiveTrueOrderByDisplayOrderAsc();
    }

    @Override
    public Department getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Department", id));
    }

    @Override
    public Department getBySlug(String slug) {
        return repository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found: " + slug));
    }

    @Override
    public Department create(Department department) {
        if (department.getDisplayOrder() == null) {
            department.setDisplayOrder((int) repository.count());
        }
        return repository.save(department);
    }

    @Override
    public Department update(Long id, Department incoming) {
        Department existing = getById(id);
        existing.setTitle(incoming.getTitle());
        existing.setSlug(incoming.getSlug());
        existing.setImage(incoming.getImage());
        existing.setDescription(incoming.getDescription());
        existing.setServices(incoming.getServices());
        if (incoming.getDisplayOrder() != null) {
            existing.setDisplayOrder(incoming.getDisplayOrder());
        }
        if (incoming.getIsActive() != null) {
            existing.setIsActive(incoming.getIsActive());
        }
        existing.setTranslations(incoming.getTranslations());
        return repository.save(existing);
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw ResourceNotFoundException.of("Department", id);
        }
        repository.deleteById(id);
    }

    @Override
    @Transactional
    public void reorder(List<ReorderItemDto> items) {
        Map<Long, Department> byId = repository.findAllById(
                items.stream().map(ReorderItemDto::getId).collect(Collectors.toList())
        ).stream().collect(Collectors.toMap(Department::getId, d -> d));

        for (ReorderItemDto item : items) {
            Department d = byId.get(item.getId());
            if (d != null) {
                d.setDisplayOrder(item.getDisplayOrder());
            }
        }
        repository.saveAll(byId.values());
    }
}
