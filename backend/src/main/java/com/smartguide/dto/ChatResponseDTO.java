package com.smartguide.dto;

import java.util.List;

/**
 * Resposta do assistente com a mensagem e os produtos recomendados.
 */
public record ChatResponseDTO(
        String resposta,
        String intencao,
        List<ProdutoDTO> produtos
) {
}
