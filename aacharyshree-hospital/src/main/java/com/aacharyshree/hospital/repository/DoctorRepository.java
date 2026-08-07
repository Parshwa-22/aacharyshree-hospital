package com.aacharyshree.hospital.repository;

import com.aacharyshree.hospital.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findAllByOrderByDisplayOrderAsc();
    List<Doctor> findByIsActiveTrueOrderByDisplayOrderAsc();
}
