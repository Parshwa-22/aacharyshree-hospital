package com.aacharyshree.hospital.service.impl;

import com.aacharyshree.hospital.entity.TrustInfo;
import com.aacharyshree.hospital.repository.TrustInfoRepository;
import com.aacharyshree.hospital.service.TrustInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TrustInfoServiceImpl implements TrustInfoService {

    private final TrustInfoRepository repository;

    @Override
    public TrustInfo get() {
        return repository.findById(1L).orElseGet(() -> {
            TrustInfo fresh = new TrustInfo();
            fresh.setId(1L);
            fresh.setName("Vidya Sanmati Das Seva Sanstha");
            fresh.setDescription("Add your trust's story here from the admin panel.");
            return repository.save(fresh);
        });
    }

    @Override
    public TrustInfo update(TrustInfo incoming) {
        TrustInfo existing = get();
        existing.setName(incoming.getName());
        existing.setEstablishedYear(incoming.getEstablishedYear());
        existing.setDescription(incoming.getDescription());
        existing.setAchievements(incoming.getAchievements());
        existing.setImage(incoming.getImage());
        existing.setTranslations(incoming.getTranslations());
        return repository.save(existing);
    }
}
