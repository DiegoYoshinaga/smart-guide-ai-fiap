package com.smartguide.dto;

/**
 * Mensagem enviada pelo usuario ao assistente.
 * O frontend envia os campos "mensagem" e "message"; qualquer um dos dois e aceito.
 */
public record ChatRequestDTO(
        String mensagem,
        String message
) {

    public String texto() {
        if (mensagem != null && !mensagem.isBlank()) {
            return mensagem;
        }
        return message != null ? message : "";
    }
}
