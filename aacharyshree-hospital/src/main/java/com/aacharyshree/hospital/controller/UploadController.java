package com.aacharyshree.hospital.controller;

import com.aacharyshree.hospital.service.MediaStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

/** Generic media upload used by the admin panel for doctor photos, hero
 *  images/videos, testimonial videos, donor photos, room images, etc. */
@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
public class UploadController {

    private final MediaStorageService storageService;

    @PostMapping
    public Map<String, String> upload(@RequestParam("file") MultipartFile file) {
        String url = storageService.store(file);
        return Map.of("url", url);
    }
}
