package com.aacharyshree.hospital.repository;

import com.aacharyshree.hospital.entity.NavItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface NavItemRepository extends JpaRepository<NavItem, Long> {
    List<NavItem> findAllByOrderByDisplayOrderAsc();
    List<NavItem> findByIsActiveTrueOrderByDisplayOrderAsc();
    List<NavItem> findByLocationOrderByDisplayOrderAsc(NavItem.Location location);
    List<NavItem> findByLocationAndIsActiveTrueOrderByDisplayOrderAsc(NavItem.Location location);

    // Used so a BOTH-location item shows up in both navbar and footer queries.
    List<NavItem> findByLocationInAndIsActiveTrueOrderByDisplayOrderAsc(Collection<NavItem.Location> locations);
    List<NavItem> findByLocationInOrderByDisplayOrderAsc(Collection<NavItem.Location> locations);
}
