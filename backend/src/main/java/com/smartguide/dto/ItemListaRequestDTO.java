package com.smartguide.dto;

/**
 * Dados para adicionar um produto a uma lista de compras.
 * A quantidade e opcional; quando ausente, o valor 1 e utilizado.
 */
public record ItemListaRequestDTO(
        Long produtoId,
        Integer quantidade
) {
}
