package com.aacharyshree.hospital.service.impl;

import com.aacharyshree.hospital.dto.ReorderItemDto;
import com.aacharyshree.hospital.entity.Contact;
import com.aacharyshree.hospital.exception.ResourceNotFoundException;
import com.aacharyshree.hospital.repository.ContactRepository;
import com.aacharyshree.hospital.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContactServiceImpl implements ContactService {

    private final ContactRepository repository;

    @Override
    public List<Contact> getAll() {
        return repository.findAllByOrderByDisplayOrderAsc();
    }

    @Override
    public List<Contact> getActive() {
        return repository.findByIsActiveTrueOrderByDisplayOrderAsc();
    }

    @Override
    public Contact getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Contact", id));
    }

    @Override
    public Contact create(Contact contact) {
        if (contact.getDisplayOrder() == null) {
            contact.setDisplayOrder((int) repository.count());
        }
        return repository.save(contact);
    }

    @Override
    public Contact update(Long id, Contact incoming) {
        Contact existing = getById(id);
        existing.setDepartment(incoming.getDepartment());
        existing.setPhone(incoming.getPhone());
        existing.setAvailability(incoming.getAvailability());
        existing.setTranslations(incoming.getTranslations());
        if (incoming.getDisplayOrder() != null) {
            existing.setDisplayOrder(incoming.getDisplayOrder());
        }
        if (incoming.getIsActive() != null) {
            existing.setIsActive(incoming.getIsActive());
        }
        return repository.save(existing);
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw ResourceNotFoundException.of("Contact", id);
        }
        repository.deleteById(id);
    }

    @Override
    @Transactional
    public void reorder(List<ReorderItemDto> items) {
        Map<Long, Contact> byId = repository.findAllById(
                items.stream().map(ReorderItemDto::getId).collect(Collectors.toList())
        ).stream().collect(Collectors.toMap(Contact::getId, c -> c));

        for (ReorderItemDto item : items) {
            Contact c = byId.get(item.getId());
            if (c != null) {
                c.setDisplayOrder(item.getDisplayOrder());
            }
        }
        repository.saveAll(byId.values());
    }
}
