package com.aacharyshree.hospital.repository;
import com.aacharyshree.hospital.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByIsActiveTrueOrderByEventDateAsc();
}
