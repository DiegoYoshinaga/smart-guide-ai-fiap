package com.smartguide.dto;

import java.math.BigDecimal;

/**
 * Dados de um produto retornados para o frontend.
 * Os nomes dos campos seguem o formato ja consumido pelo JavaScript.
 */
public record ProdutoDTO(
        Long id,
        String nome,
        String descricao,
        BigDecimal preco,
        String categoria,
        Boolean disponivel,
        String corredor,
        String secao,
        String prateleira,
        String imagem
) {
}
