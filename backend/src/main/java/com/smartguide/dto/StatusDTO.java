package com.smartguide.dto;

/**
 * Resposta simples de verificacao da API.
 */
public record StatusDTO(
        String aplicacao,
        String status
) {
}
