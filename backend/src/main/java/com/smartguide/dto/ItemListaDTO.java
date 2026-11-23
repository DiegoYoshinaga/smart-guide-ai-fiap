package com.smartguide.dto;

import java.math.BigDecimal;

/**
 * Item de uma lista de compras com o subtotal calculado.
 */
public record ItemListaDTO(
        Long id,
        Long produtoId,
        String produtoNome,
        BigDecimal preco,
        Integer quantidade,
        BigDecimal subtotal
) {
}
