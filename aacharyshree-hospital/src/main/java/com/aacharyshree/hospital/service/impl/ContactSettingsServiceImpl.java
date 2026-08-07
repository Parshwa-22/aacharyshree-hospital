package com.aacharyshree.hospital.service.impl;

import com.aacharyshree.hospital.entity.ContactSettings;
import com.aacharyshree.hospital.repository.ContactSettingsRepository;
import com.aacharyshree.hospital.service.ContactSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ContactSettingsServiceImpl implements ContactSettingsService {

    private final ContactSettingsRepository repository;

    @Override
    public ContactSettings get() {
        return repository.findById(1L).orElseGet(() -> {
            ContactSettings fresh = new ContactSettings();
            fresh.setId(1L);
            // Pre-filled with the numbers provided — editable from the admin panel.
            fresh.setAppointmentPhone("9090641008");
            fresh.setDonationPhone("9090641008");
            return repository.save(fresh);
        });
    }

    @Override
    public ContactSettings update(ContactSettings incoming) {
        ContactSettings existing = get();
        existing.setAppointmentPhone(incoming.getAppointmentPhone());
        existing.setDonationPhone(incoming.getDonationPhone());
        return repository.save(existing);
    }
}
