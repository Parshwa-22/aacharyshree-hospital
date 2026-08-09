package com.aacharyshree.hospital.service.impl;

import com.aacharyshree.hospital.entity.SiteSettings;
import com.aacharyshree.hospital.repository.SiteSettingsRepository;
import com.aacharyshree.hospital.service.SiteSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SiteSettingsServiceImpl implements SiteSettingsService {

    private final SiteSettingsRepository repository;

    @Override
    public SiteSettings get() {
        return repository.findById(1L).orElseGet(() -> {
            SiteSettings fresh = new SiteSettings();
            fresh.setId(1L);
            fresh.setHeroTitle("Welcome to Aacharyshree Hospital");
            fresh.setHeroSubtitle("Your Health, Our Priority");
            fresh.setOpeningStatus(SiteSettings.OpeningStatus.CLOSED);
            return repository.save(fresh);
        });
    }

    @Override
    public SiteSettings update(SiteSettings incoming) {
        SiteSettings existing = get();
        existing.setHeroTitle(incoming.getHeroTitle());
        existing.setHeroSubtitle(incoming.getHeroSubtitle());
        existing.setTranslations(incoming.getTranslations());
        existing.setOpeningStatus(incoming.getOpeningStatus() == null
            ? SiteSettings.OpeningStatus.CLOSED
            : incoming.getOpeningStatus());
        return repository.save(existing);
    }

    @Override
    public SiteSettings openInauguration() {
        SiteSettings existing = get();
        if (existing.getOpeningStatus() != SiteSettings.OpeningStatus.OPEN) {
            existing.setOpeningStatus(SiteSettings.OpeningStatus.OPEN);
            return repository.save(existing);
        }
        return existing;
    }
}
