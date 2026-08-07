package com.aacharyshree.hospital.service;

import com.aacharyshree.hospital.entity.ContactSettings;

public interface ContactSettingsService {
    ContactSettings get();
    ContactSettings update(ContactSettings incoming);
}
