package com.aacharyshree.hospital.service.impl;

import com.aacharyshree.hospital.dto.ReorderItemDto;
import com.aacharyshree.hospital.entity.Counter;
import com.aacharyshree.hospital.exception.ResourceNotFoundException;
import com.aacharyshree.hospital.repository.CounterRepository;
import com.aacharyshree.hospital.service.CounterService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CounterServiceImpl implements CounterService {

    private final CounterRepository repository;

    @Override
    public List<Counter> getAll() {
        return repository.findAllByOrderByDisplayOrderAsc();
    }

    @Override
    public List<Counter> getActive() {
        return repository.findByIsActiveTrueOrderByDisplayOrderAsc();
    }

    @Override
    public Counter getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Counter", id));
    }

    @Override
    public Counter create(Counter counter) {
        if (counter.getDisplayOrder() == null) {
            counter.setDisplayOrder((int) repository.count());
        }
        return repository.save(counter);
    }

    @Override
    public Counter update(Long id, Counter incoming) {
        Counter existing = getById(id);
        existing.setLabel(incoming.getLabel());
        existing.setValue(incoming.getValue());
        existing.setSuffix(incoming.getSuffix());
        existing.setTranslations(incoming.getTranslations());
        if (incoming.getDisplayOrder() != null) {
            existing.setDisplayOrder(incoming.getDisplayOrder());
        }
        if (incoming.getIsActive() != null) {
            existing.setIsActive(incoming.getIsActive());
        }
        return repository.save(existing);
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw ResourceNotFoundException.of("Counter", id);
        }
        repository.deleteById(id);
    }

    @Override
    @Transactional
    public void reorder(List<ReorderItemDto> items) {
        Map<Long, Counter> byId = repository.findAllById(
                items.stream().map(ReorderItemDto::getId).collect(Collectors.toList())
        ).stream().collect(Collectors.toMap(Counter::getId, c -> c));

        for (ReorderItemDto item : items) {
            Counter c = byId.get(item.getId());
            if (c != null) {
                c.setDisplayOrder(item.getDisplayOrder());
            }
        }
        repository.saveAll(byId.values());
    }
}
