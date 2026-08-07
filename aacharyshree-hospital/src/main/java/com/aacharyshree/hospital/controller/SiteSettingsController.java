package com.aacharyshree.hospital.controller;

import com.aacharyshree.hospital.entity.SiteSettings;
import com.aacharyshree.hospital.service.SiteSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/site-settings")
@RequiredArgsConstructor
public class SiteSettingsController {

    private final SiteSettingsService service;

    @GetMapping
    public SiteSettings get() {
        return service.get();
    }

    @PutMapping
    public SiteSettings update(@RequestBody SiteSettings settings) {
        return service.update(settings);
    }
}
