package com.smartguide.service;

import com.smartguide.dto.LocalizacaoDTO;
import org.springframework.stereotype.Service;

/**
 * Prepara as informacoes de localizacao usadas pelo mapa da loja.
 */
@Service
public class MapaService {

    private final ProdutoService produtoService;

    public MapaService(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    /**
     * Recupera corredor, secao e prateleira do produto.
     */
    public LocalizacaoDTO localizacaoDoProduto(Long idProduto) {
        return produtoService.localizacao(idProduto);
    }
}
