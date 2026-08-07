package com.aacharyshree.hospital.service;

import com.aacharyshree.hospital.dto.ReorderItemDto;
import com.aacharyshree.hospital.entity.Doctor;

import java.util.List;

public interface DoctorService {
    List<Doctor> getAll();
    List<Doctor> getActive();
    Doctor getById(Long id);
    Doctor create(Doctor doctor);
    Doctor update(Long id, Doctor doctor);
    void delete(Long id);
    void reorder(List<ReorderItemDto> items);
}
