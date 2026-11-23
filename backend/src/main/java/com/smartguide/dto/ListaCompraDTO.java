package com.smartguide.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Lista de compras com seus itens e totais calculados.
 */
public record ListaCompraDTO(
        Long id,
        String nome,
        LocalDateTime dataCriacao,
        List<ItemListaDTO> itens,
        Integer quantidadeTotal,
        BigDecimal total
) {
}
