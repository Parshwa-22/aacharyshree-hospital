package com.aacharyshree.hospital.service;

import org.springframework.web.multipart.MultipartFile;

/**
 * Abstraction over where uploaded media actually lives.
 * Stage 1 ships a local-disk implementation (LocalMediaStorageService).
 * Swapping to S3 / Cloudinary later means adding a new implementation of
 * this interface — no controller or service code needs to change.
 */
public interface MediaStorageService {
    /** Stores the file and returns a URL the frontend can use directly. */
    String store(MultipartFile file);
}
