package com.aacharyshree.hospital.service.impl;

import com.aacharyshree.hospital.dto.ReorderItemDto;
import com.aacharyshree.hospital.entity.Doctor;
import com.aacharyshree.hospital.exception.ResourceNotFoundException;
import com.aacharyshree.hospital.repository.DoctorRepository;
import com.aacharyshree.hospital.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository repository;

    @Override
    public List<Doctor> getAll() {
        return repository.findAllByOrderByDisplayOrderAsc();
    }

    @Override
    public List<Doctor> getActive() {
        return repository.findByIsActiveTrueOrderByDisplayOrderAsc();
    }

    @Override
    public Doctor getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Doctor", id));
    }

    @Override
    public Doctor create(Doctor doctor) {
        if (doctor.getDisplayOrder() == null) {
            doctor.setDisplayOrder((int) repository.count());
        }
        return repository.save(doctor);
    }

    @Override
    public Doctor update(Long id, Doctor incoming) {
        Doctor existing = getById(id);
        existing.setName(incoming.getName());
        existing.setSpecialization(incoming.getSpecialization());
        existing.setDepartment(incoming.getDepartment());
        existing.setExperience(incoming.getExperience());
        existing.setQualification(incoming.getQualification());
        existing.setImage(incoming.getImage());
        existing.setAvailableDays(incoming.getAvailableDays());
        existing.setStartTime(incoming.getStartTime());
        existing.setEndTime(incoming.getEndTime());
        existing.setAvailableDates(incoming.getAvailableDates());
        if (incoming.getAvailabilityType() != null) {
            existing.setAvailabilityType(incoming.getAvailabilityType());
        }
        existing.setDescription(incoming.getDescription());
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
            throw ResourceNotFoundException.of("Doctor", id);
        }
        repository.deleteById(id);
    }

    @Override
    @Transactional
    public void reorder(List<ReorderItemDto> items) {
        Map<Long, Doctor> byId = repository.findAllById(
                items.stream().map(ReorderItemDto::getId).collect(Collectors.toList())
        ).stream().collect(Collectors.toMap(Doctor::getId, d -> d));

        for (ReorderItemDto item : items) {
            Doctor doctor = byId.get(item.getId());
            if (doctor != null) {
                doctor.setDisplayOrder(item.getDisplayOrder());
            }
        }
        repository.saveAll(byId.values());
    }
}
