package com.smartguide.dto;

/**
 * Dados de uma categoria retornados para o frontend.
 */
public record CategoriaDTO(
        Long id,
        String nome
) {
}
