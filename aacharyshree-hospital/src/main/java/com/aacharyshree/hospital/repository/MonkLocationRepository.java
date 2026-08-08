package com.aacharyshree.hospital.repository;

import com.aacharyshree.hospital.entity.MonkLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MonkLocationRepository extends JpaRepository<MonkLocation, Long> {
    List<MonkLocation> findByMonkIdOrderByRecordedAtAsc(Long monkId);
}
