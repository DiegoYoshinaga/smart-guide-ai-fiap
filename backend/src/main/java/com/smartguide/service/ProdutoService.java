package com.smartguide.service;

import com.smartguide.dto.LocalizacaoDTO;
import com.smartguide.dto.ProdutoDTO;
import com.smartguide.model.Produto;
import com.smartguide.repository.ProdutoComplementarRepository;
import com.smartguide.repository.ProdutoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * Consultas do catalogo de produtos.
 */
@Service
public class ProdutoService {

    private static final String DISPONIVEL = "S";

    private final ProdutoRepository produtoRepository;
    private final ProdutoComplementarRepository produtoComplementarRepository;

    public ProdutoService(ProdutoRepository produtoRepository,
                          ProdutoComplementarRepository produtoComplementarRepository) {
        this.produtoRepository = produtoRepository;
        this.produtoComplementarRepository = produtoComplementarRepository;
    }

    /**
     * Lista todos os produtos cadastrados.
     */
    @Transactional(readOnly = true)
    public List<ProdutoDTO> listar() {
        return paraDTOs(produtoRepository.buscar(null, null));
    }

    /**
     * Pesquisa por nome ou descricao e/ou filtra por categoria.
     * Filtros em branco sao ignorados.
     */
    @Transactional(readOnly = true)
    public List<ProdutoDTO> buscar(String nome, String categoria) {
        String trechoNome = (nome == null || nome.isBlank()) ? null : nome.trim();
        String nomeCategoria = (categoria == null || categoria.isBlank()) ? null : categoria.trim();
        return paraDTOs(produtoRepository.buscar(trechoNome, nomeCategoria));
    }

    @Transactional(readOnly = true)
    public List<ProdutoDTO> pesquisarPorNome(String nome) {
        return buscar(nome, null);
    }

    @Transactional(readOnly = true)
    public List<ProdutoDTO> listarPorCategoria(String categoria) {
        return buscar(null, categoria);
    }

    @Transactional(readOnly = true)
    public ProdutoDTO buscarPorId(Long id) {
        return paraDTO(buscarEntidade(id));
    }

    /**
     * Produtos que podem ser usados em conjunto com o produto informado.
     */
    @Transactional(readOnly = true)
    public List<ProdutoDTO> listarComplementares(Long id) {
        buscarEntidade(id);
        return paraDTOs(produtoComplementarRepository.buscarComplementares(id));
    }

    /**
     * Localizacao do produto na loja (corredor, secao e prateleira).
     */
    @Transactional(readOnly = true)
    public LocalizacaoDTO localizacao(Long id) {
        return paraLocalizacao(buscarEntidade(id));
    }

    Produto buscarEntidade(Long id) {
        return produtoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto nao encontrado"));
    }

    private List<ProdutoDTO> paraDTOs(List<Produto> produtos) {
        return produtos.stream().map(this::paraDTO).toList();
    }

    ProdutoDTO paraDTO(Produto produto) {
        return new ProdutoDTO(
                produto.getIdProduto(),
                produto.getNome(),
                produto.getDescricao(),
                produto.getPreco(),
                produto.getCategoria() != null ? produto.getCategoria().getNome() : null,
                DISPONIVEL.equals(produto.getAtivo()),
                produto.getCorredor(),
                produto.getSecao(),
                produto.getPrateleira(),
                produto.getImagemUrl()
        );
    }

    private LocalizacaoDTO paraLocalizacao(Produto produto) {
        return new LocalizacaoDTO(
                produto.getIdProduto(),
                produto.getNome(),
                produto.getCorredor(),
                produto.getSecao(),
                produto.getPrateleira(),
                DISPONIVEL.equals(produto.getAtivo())
        );
    }
}
