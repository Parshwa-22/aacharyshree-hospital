package com.aacharyshree.hospital.controller;

import com.aacharyshree.hospital.dto.ApiResponse;
import com.aacharyshree.hospital.entity.Room;
import com.aacharyshree.hospital.service.RoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService service;

    @GetMapping
    public List<Room> getAll(@RequestParam(required = false) Boolean active) {
        return Boolean.TRUE.equals(active) ? service.getActive() : service.getAll();
    }

    @GetMapping("/{id}")
    public Room getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public Room create(@Valid @RequestBody Room room) {
        return service.create(room);
    }

    @PutMapping("/{id}")
    public Room update(@PathVariable Long id, @Valid @RequestBody Room room) {
        return service.update(id, room);
    }

    @DeleteMapping("/{id}")
    public ApiResponse delete(@PathVariable Long id) {
        service.delete(id);
        return ApiResponse.ok("Room deleted");
    }
}
