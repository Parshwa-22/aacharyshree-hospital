package com.aacharyshree.hospital.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** One row of a reorder request: which record moves to which position. */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReorderItemDto {
    private Long id;
    private Integer displayOrder;
}
