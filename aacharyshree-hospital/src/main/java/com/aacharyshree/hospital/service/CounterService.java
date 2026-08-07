package com.aacharyshree.hospital.service;

import com.aacharyshree.hospital.dto.ReorderItemDto;
import com.aacharyshree.hospital.entity.Counter;

import java.util.List;

public interface CounterService {
    List<Counter> getAll();
    List<Counter> getActive();
    Counter getById(Long id);
    Counter create(Counter counter);
    Counter update(Long id, Counter counter);
    void delete(Long id);
    void reorder(List<ReorderItemDto> items);
}
