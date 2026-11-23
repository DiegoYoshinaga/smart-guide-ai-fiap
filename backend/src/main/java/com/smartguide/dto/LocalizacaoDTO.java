package com.smartguide.dto;

/**
 * Localizacao de um produto na loja, usada pelo mapa do frontend.
 */
public record LocalizacaoDTO(
        Long id,
        String nome,
        String corredor,
        String secao,
        String prateleira,
        Boolean disponivel
) {
}
