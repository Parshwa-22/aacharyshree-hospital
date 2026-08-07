package com.aacharyshree.hospital.service;

import com.aacharyshree.hospital.entity.Room;

import java.util.List;

public interface RoomService {
    List<Room> getAll();
    List<Room> getActive();
    Room getById(Long id);
    Room create(Room room);
    Room update(Long id, Room room);
    void delete(Long id);
}
