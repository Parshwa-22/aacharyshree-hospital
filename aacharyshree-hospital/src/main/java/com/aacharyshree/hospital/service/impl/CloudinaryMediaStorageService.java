package com.aacharyshree.hospital.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.aacharyshree.hospital.service.MediaStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

/**
 * Uploads every doctor photo / hero image / hero video / testimonial video /
 * donor photo / room photo — anything sent to POST /api/upload — straight to
 * Cloudinary instead of local disk. Cloudinary auto-optimizes (compresses)
 * on the way in via quality=auto + fetch_format=auto, and we store the
 * resulting CDN URL in the database.
 *
 * resource_type="auto" lets one endpoint accept both images and videos.
 */
@Service
public class CloudinaryMediaStorageService implements MediaStorageService {

    private final Cloudinary cloudinary;

    public CloudinaryMediaStorageService(
            @Value("${cloudinary.cloud-name}") String cloudName,
            @Value("${cloudinary.api-key}") String apiKey,
            @Value("${cloudinary.api-secret}") String apiSecret
    ) {
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true
        ));
    }

    @Override
    public String store(MultipartFile file) {
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> result = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "resource_type", "auto",   // image or video, auto-detected
                            "folder", "aacharyshree-hospital",
                            "quality", "auto",         // compress
                            "fetch_format", "auto"     // serve the best format automatically
                    )
            );
            return (String) result.get("secure_url");
        } catch (IOException e) {
            throw new RuntimeException("Cloudinary upload failed: " + e.getMessage(), e);
        }
    }
}
