package com.aacharyshree.hospital.controller;

import com.aacharyshree.hospital.entity.TrustInfo;
import com.aacharyshree.hospital.service.TrustInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trust-info")
@RequiredArgsConstructor
public class TrustInfoController {

    private final TrustInfoService service;

    @GetMapping
    public TrustInfo get() {
        return service.get();
    }

    @PutMapping
    public TrustInfo update(@RequestBody TrustInfo trustInfo) {
        return service.update(trustInfo);
    }
}
