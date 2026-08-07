package com.aacharyshree.hospital.repository;

import com.aacharyshree.hospital.entity.OtpCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OtpCodeRepository extends JpaRepository<OtpCode, Long> {
    Optional<OtpCode> findTopByEmailAndUsedFalseOrderByCreatedAtDesc(String email);
}
