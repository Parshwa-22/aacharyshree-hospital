package com.aacharyshree.hospital.service;

import com.aacharyshree.hospital.dto.ReorderItemDto;
import com.aacharyshree.hospital.entity.NavItem;

import java.util.List;

public interface NavItemService {
    List<NavItem> getAll(NavItem.Location location, Boolean activeOnly);
    NavItem getById(Long id);
    NavItem create(NavItem navItem);
    NavItem update(Long id, NavItem navItem);
    void delete(Long id);
    void reorder(List<ReorderItemDto> items);
}
