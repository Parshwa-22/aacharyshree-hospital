package com.aacharyshree.hospital.repository;

import com.aacharyshree.hospital.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByIsActiveTrue();
}
