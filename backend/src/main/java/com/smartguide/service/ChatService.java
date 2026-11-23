package com.smartguide.service;

import com.smartguide.dto.ChatRequestDTO;
import com.smartguide.dto.ChatResponseDTO;
import com.smartguide.dto.ProdutoDTO;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Processa a mensagem do cliente e monta a resposta do assistente
 * com os produtos recomendados.
 */
@Service
public class ChatService {

    private static final int LIMITE_RECOMENDACOES = 3;

    private final RespostaService respostaService;
    private final ProdutoService produtoService;

    public ChatService(RespostaService respostaService, ProdutoService produtoService) {
        this.respostaService = respostaService;
        this.produtoService = produtoService;
    }

    public ChatResponseDTO responder(ChatRequestDTO requisicao) {
        String mensagem = requisicao != null ? requisicao.texto() : "";

        return respostaService.identificar(mensagem)
                .map(intencao -> new ChatResponseDTO(
                        intencao.resposta(),
                        intencao.nome(),
                        recomendar(intencao.categorias())
                ))
                .orElseGet(() -> new ChatResponseDTO(
                        respostaService.respostaPadrao(),
                        null,
                        List.of()
                ));
    }

    /**
     * Seleciona ate tres produtos das categorias relacionadas a intencao.
     */
    private List<ProdutoDTO> recomendar(List<String> categorias) {
        List<String> termos = categorias.stream()
                .map(RespostaService::normalizar)
                .toList();

        return produtoService.listar().stream()
                .filter(produto -> produto.categoria() != null)
                .filter(produto -> {
                    String categoria = RespostaService.normalizar(produto.categoria());
                    return termos.stream().anyMatch(categoria::contains);
                })
                .limit(LIMITE_RECOMENDACOES)
                .toList();
    }
}
