package com.aacharyshree.hospital.repository;

import com.aacharyshree.hospital.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContactRepository extends JpaRepository<Contact, Long> {
    List<Contact> findAllByOrderByDisplayOrderAsc();
    List<Contact> findByIsActiveTrueOrderByDisplayOrderAsc();
}
