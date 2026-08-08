package com.aacharyshree.hospital.service.impl;

import com.aacharyshree.hospital.dto.ReorderItemDto;
import com.aacharyshree.hospital.entity.NavItem;
import com.aacharyshree.hospital.exception.ResourceNotFoundException;
import com.aacharyshree.hospital.repository.NavItemRepository;
import com.aacharyshree.hospital.service.NavItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NavItemServiceImpl implements NavItemService {

    private final NavItemRepository repository;

    @Override
    public List<NavItem> getAll(NavItem.Location location, Boolean activeOnly) {
        if (location != null && location != NavItem.Location.BOTH) {
            // NAVBAR query also returns BOTH items; FOOTER query also returns BOTH items.
            List<NavItem.Location> matching = List.of(location, NavItem.Location.BOTH);
            if (Boolean.TRUE.equals(activeOnly)) {
                return repository.findByLocationInAndIsActiveTrueOrderByDisplayOrderAsc(matching);
            }
            return repository.findByLocationInOrderByDisplayOrderAsc(matching);
        }
        if (location == NavItem.Location.BOTH) {
            if (Boolean.TRUE.equals(activeOnly)) {
                return repository.findByLocationAndIsActiveTrueOrderByDisplayOrderAsc(location);
            }
            return repository.findByLocationOrderByDisplayOrderAsc(location);
        }
        if (Boolean.TRUE.equals(activeOnly)) {
            return repository.findByIsActiveTrueOrderByDisplayOrderAsc();
        }
        return repository.findAllByOrderByDisplayOrderAsc();
    }

    @Override
    public NavItem getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("NavItem", id));
    }

    @Override
    public NavItem create(NavItem navItem) {
        if (navItem.getLocation() == null) {
            navItem.setLocation(NavItem.Location.NAVBAR);
        }
        if (navItem.getDisplayOrder() == null) {
            navItem.setDisplayOrder((int) repository.count());
        }
        return repository.save(navItem);
    }

    @Override
    public NavItem update(Long id, NavItem incoming) {
        NavItem existing = getById(id);
        existing.setLabel(incoming.getLabel());
        existing.setPath(incoming.getPath());
        if (incoming.getLocation() != null) {
            existing.setLocation(incoming.getLocation());
        }
        if (incoming.getOpenInNewTab() != null) {
            existing.setOpenInNewTab(incoming.getOpenInNewTab());
        }
        if (incoming.getDisplayOrder() != null) {
            existing.setDisplayOrder(incoming.getDisplayOrder());
        }
        if (incoming.getIsActive() != null) {
            existing.setIsActive(incoming.getIsActive());
        }
        existing.setTranslations(incoming.getTranslations());
        return repository.save(existing);
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw ResourceNotFoundException.of("NavItem", id);
        }
        repository.deleteById(id);
    }

    @Override
    @Transactional
    public void reorder(List<ReorderItemDto> items) {
        Map<Long, NavItem> byId = repository.findAllById(
                items.stream().map(ReorderItemDto::getId).collect(Collectors.toList())
        ).stream().collect(Collectors.toMap(NavItem::getId, n -> n));

        for (ReorderItemDto item : items) {
            NavItem n = byId.get(item.getId());
            if (n != null) {
                n.setDisplayOrder(item.getDisplayOrder());
            }
        }
        repository.saveAll(byId.values());
    }
}
