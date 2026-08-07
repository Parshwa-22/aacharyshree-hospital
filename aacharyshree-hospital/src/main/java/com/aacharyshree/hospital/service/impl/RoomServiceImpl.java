package com.aacharyshree.hospital.service.impl;

import com.aacharyshree.hospital.entity.Room;
import com.aacharyshree.hospital.exception.ResourceNotFoundException;
import com.aacharyshree.hospital.repository.RoomRepository;
import com.aacharyshree.hospital.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

    private final RoomRepository repository;

    /**
     * Forces the lazy images/amenities collections to load NOW, while the
     * transaction (and therefore the Hibernate session) is still open. This
     * is what was missing before — with spring.jpa.open-in-view=false, the
     * session closes the instant the service method returns, so if Jackson
     * tries to serialize an un-touched lazy collection afterwards (during
     * the HTTP response), it fails with
     * "failed to lazily initialize a collection... no session" /
     * "could not initialize proxy". Touching .size() here loads the real
     * data into a plain in-memory list before that session closes, so it's
     * safe to serialize later no matter what.
     */
    private void initialize(Room room) {
        if (room == null) return;
        room.getImages().size();
        room.getAmenities().size();
    }

    private void initializeAll(List<Room> rooms) {
        rooms.forEach(this::initialize);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Room> getAll() {
        List<Room> rooms = repository.findAll();
        initializeAll(rooms);
        return rooms;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Room> getActive() {
        List<Room> rooms = repository.findByIsActiveTrue();
        initializeAll(rooms);
        return rooms;
    }

    @Override
    @Transactional(readOnly = true)
    public Room getById(Long id) {
        Room room = repository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Room", id));
        initialize(room);
        return room;
    }

    @Override
    @Transactional
    public Room create(Room room) {
        if (room.getImages() != null) {
            for (int i = 0; i < room.getImages().size(); i++) {
                room.getImages().get(i).setRoom(room);
                if (room.getImages().get(i).getDisplayOrder() == null) {
                    room.getImages().get(i).setDisplayOrder(i);
                }
            }
        }
        if (room.getAmenities() != null) {
            room.getAmenities().forEach(a -> a.setRoom(room));
        }
        Room saved = repository.save(room);
        initialize(saved);
        return saved;
    }

    @Override
    @Transactional
    public Room update(Long id, Room incoming) {
        Room existing = repository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Room", id));

        existing.setRoomName(incoming.getRoomName());
        existing.setType(incoming.getType());
        existing.setPrice(incoming.getPrice());
        existing.setCapacity(incoming.getCapacity());
        existing.setView360Url(incoming.getView360Url());
        existing.setDescription(incoming.getDescription());
        if (incoming.getAvailability() != null) {
            existing.setAvailability(incoming.getAvailability());
        }
        if (incoming.getIsActive() != null) {
            existing.setIsActive(incoming.getIsActive());
        }
        if (incoming.getAnimationType() != null) {
            existing.setAnimationType(incoming.getAnimationType());
        }

        existing.getImages().clear();
        if (incoming.getImages() != null) {
            for (int i = 0; i < incoming.getImages().size(); i++) {
                var img = incoming.getImages().get(i);
                img.setRoom(existing);
                if (img.getDisplayOrder() == null) {
                    img.setDisplayOrder(i);
                }
                existing.getImages().add(img);
            }
        }

        existing.getAmenities().clear();
        if (incoming.getAmenities() != null) {
            incoming.getAmenities().forEach(a -> {
                a.setRoom(existing);
                existing.getAmenities().add(a);
            });
        }

        Room saved = repository.save(existing);
        initialize(saved);
        return saved;
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Room room = repository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Room", id));
        // Explicitly clear owned collections first so Hibernate issues the
        // child-table deletes before the parent delete, rather than relying
        // on a bulk deleteById() to cascade correctly on its own.
        room.getImages().clear();
        room.getAmenities().clear();
        repository.saveAndFlush(room);
        repository.delete(room);
    }
}
