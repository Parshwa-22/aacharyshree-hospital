package com.aacharyshree.hospital.service;

import com.aacharyshree.hospital.dto.ReorderItemDto;
import com.aacharyshree.hospital.entity.Donor;

import java.util.List;

public interface DonorService {
    List<Donor> getAll();
    List<Donor> getActive();
    Donor getById(Long id);
    Donor create(Donor donor);
    Donor update(Long id, Donor donor);
    void delete(Long id);
    void reorder(List<ReorderItemDto> items);
}
