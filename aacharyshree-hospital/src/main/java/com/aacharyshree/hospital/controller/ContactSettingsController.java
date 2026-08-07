package com.aacharyshree.hospital.controller;

import com.aacharyshree.hospital.entity.ContactSettings;
import com.aacharyshree.hospital.service.ContactSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact-settings")
@RequiredArgsConstructor
public class ContactSettingsController {

    private final ContactSettingsService service;

    @GetMapping
    public ContactSettings get() {
        return service.get();
    }

    @PutMapping
    public ContactSettings update(@RequestBody ContactSettings settings) {
        return service.update(settings);
    }
}
