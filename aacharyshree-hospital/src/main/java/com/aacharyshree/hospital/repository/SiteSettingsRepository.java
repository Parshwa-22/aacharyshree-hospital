package com.aacharyshree.hospital.repository;

import com.aacharyshree.hospital.entity.SiteSettings;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SiteSettingsRepository extends JpaRepository<SiteSettings, Long> {
}
