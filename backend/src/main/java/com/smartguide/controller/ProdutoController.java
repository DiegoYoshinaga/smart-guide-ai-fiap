package com.smartguide.controller;

import com.smartguide.dto.ProdutoDTO;
import com.smartguide.service.ProdutoService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Endpoints de consulta do catalogo de produtos.
 */
@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    private final ProdutoService produtoService;

    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    /**
     * Lista os produtos, permitindo pesquisa por nome/descricao e filtro por categoria.
     */
    @GetMapping
    public List<ProdutoDTO> listar(@RequestParam(required = false) String nome,
                                   @RequestParam(required = false) String categoria) {
        return produtoService.buscar(nome, categoria);
    }

    @GetMapping("/{id}")
    public ProdutoDTO buscarPorId(@PathVariable Long id) {
        return produtoService.buscarPorId(id);
    }

    @GetMapping("/{id}/complementares")
    public List<ProdutoDTO> listarComplementares(@PathVariable Long id) {
        return produtoService.listarComplementares(id);
    }
}
