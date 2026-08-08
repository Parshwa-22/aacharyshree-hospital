package com.aacharyshree.hospital.service.impl;

import com.aacharyshree.hospital.dto.ReorderItemDto;
import com.aacharyshree.hospital.entity.Donor;
import com.aacharyshree.hospital.exception.ResourceNotFoundException;
import com.aacharyshree.hospital.repository.DonorRepository;
import com.aacharyshree.hospital.service.DonorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DonorServiceImpl implements DonorService {

    private final DonorRepository repository;

    @Override
    public List<Donor> getAll() {
        return repository.findAllByOrderByDisplayOrderAsc();
    }

    @Override
    public List<Donor> getActive() {
        return repository.findByIsActiveTrueOrderByDisplayOrderAsc();
    }

    @Override
    public Donor getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Donor", id));
    }

    @Override
    public Donor create(Donor donor) {
        if (donor.getDisplayOrder() == null) {
            donor.setDisplayOrder((int) repository.count());
        }
        return repository.save(donor);
    }

    @Override
    public Donor update(Long id, Donor incoming) {
        Donor existing = getById(id);
        existing.setName(incoming.getName());
        existing.setDonationAmount(incoming.getDonationAmount());
        existing.setDonationType(incoming.getDonationType());
        existing.setDonationDate(incoming.getDonationDate());
        existing.setImage(incoming.getImage());
        existing.setMessage(incoming.getMessage());
        if (incoming.getDisplayOrder() != null) {
            existing.setDisplayOrder(incoming.getDisplayOrder());
        }
        if (incoming.getIsActive() != null) {
            existing.setIsActive(incoming.getIsActive());
        }
        if (incoming.getVip() != null) {
            existing.setVip(incoming.getVip());
        }
        existing.setTranslations(incoming.getTranslations());
        return repository.save(existing);
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw ResourceNotFoundException.of("Donor", id);
        }
        repository.deleteById(id);
    }

    @Override
    @Transactional
    public void reorder(List<ReorderItemDto> items) {
        Map<Long, Donor> byId = repository.findAllById(
                items.stream().map(ReorderItemDto::getId).collect(Collectors.toList())
        ).stream().collect(Collectors.toMap(Donor::getId, d -> d));

        for (ReorderItemDto item : items) {
            Donor d = byId.get(item.getId());
            if (d != null) {
                d.setDisplayOrder(item.getDisplayOrder());
            }
        }
        repository.saveAll(byId.values());
    }
}
