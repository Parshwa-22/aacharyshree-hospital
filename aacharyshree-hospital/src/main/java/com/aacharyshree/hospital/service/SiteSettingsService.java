package com.aacharyshree.hospital.service;

import com.aacharyshree.hospital.entity.SiteSettings;

public interface SiteSettingsService {
    SiteSettings get();
    SiteSettings update(SiteSettings incoming);
    SiteSettings openInauguration();
}
