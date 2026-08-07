package com.aacharyshree.hospital.service;

import com.aacharyshree.hospital.dto.ReorderItemDto;
import com.aacharyshree.hospital.entity.Contact;

import java.util.List;

public interface ContactService {
    List<Contact> getAll();
    List<Contact> getActive();
    Contact getById(Long id);
    Contact create(Contact contact);
    Contact update(Long id, Contact contact);
    void delete(Long id);
    void reorder(List<ReorderItemDto> items);
}
