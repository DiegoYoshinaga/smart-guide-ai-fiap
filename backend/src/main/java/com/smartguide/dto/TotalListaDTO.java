package com.smartguide.dto;

import java.math.BigDecimal;

/**
 * Valor total de uma lista de compras.
 */
public record TotalListaDTO(
        Long id,
        BigDecimal total
) {
}
