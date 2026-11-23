package com.smartguide.dto;

/**
 * Erro retornado pela API sem detalhes internos da aplicacao.
 */
public record ErroDTO(
        int status,
        String mensagem
) {
}
