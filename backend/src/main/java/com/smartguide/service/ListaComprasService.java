package com.smartguide.service;

import com.smartguide.dto.ItemListaDTO;
import com.smartguide.dto.ListaCompraDTO;
import com.smartguide.model.ItemLista;
import com.smartguide.model.ListaCompra;
import com.smartguide.model.Produto;
import com.smartguide.repository.ItemListaRepository;
import com.smartguide.repository.ListaCompraRepository;
import com.smartguide.repository.ProdutoRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

/**
 * Regras de negocio da lista de compras.
 */
@Service
public class ListaComprasService {

    private final ListaCompraRepository listaCompraRepository;
    private final ItemListaRepository itemListaRepository;
    private final ProdutoRepository produtoRepository;

    public ListaComprasService(ListaCompraRepository listaCompraRepository,
                               ItemListaRepository itemListaRepository,
                               ProdutoRepository produtoRepository) {
        this.listaCompraRepository = listaCompraRepository;
        this.itemListaRepository = itemListaRepository;
        this.produtoRepository = produtoRepository;
    }

    @Transactional
    public ListaCompraDTO criar(String nome) {
        ListaCompra lista = new ListaCompra();
        lista.setNomeLista(nome == null || nome.isBlank() ? null : nome.trim());
        return montarDTO(listaCompraRepository.save(lista));
    }

    @Transactional(readOnly = true)
    public List<ListaCompraDTO> listar() {
        return listaCompraRepository.findAll(Sort.by("idLista")).stream()
                .map(this::montarDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public ListaCompraDTO buscar(Long idLista) {
        return montarDTO(buscarEntidade(idLista));
    }

    @Transactional(readOnly = true)
    public List<ItemListaDTO> consultarItens(Long idLista) {
        buscarEntidade(idLista);
        return itemListaRepository.findByLista_IdListaOrderByIdItemAsc(idLista).stream()
                .map(this::paraItemDTO)
                .toList();
    }

    /**
     * Adiciona um produto a lista. Se o produto ja estiver na lista,
     * a quantidade e somada a existente.
     */
    @Transactional
    public ListaCompraDTO adicionarItem(Long idLista, Long idProduto, Integer quantidade) {
        ListaCompra lista = buscarEntidade(idLista);
        Produto produto = buscarProduto(idProduto);
        int quantidadeNova = quantidade == null ? 1 : validarQuantidade(quantidade);

        itemListaRepository.findByLista_IdListaAndProduto_IdProduto(idLista, idProduto)
                .ifPresentOrElse(
                        item -> item.setQuantidade(item.getQuantidade() + quantidadeNova),
                        () -> {
                            ItemLista item = new ItemLista();
                            item.setLista(lista);
                            item.setProduto(produto);
                            item.setQuantidade(quantidadeNova);
                            itemListaRepository.save(item);
                        }
                );

        return montarDTO(lista);
    }

    @Transactional
    public ListaCompraDTO atualizarQuantidade(Long idLista, Long idItem, Integer quantidade) {
        buscarEntidade(idLista);
        ItemLista item = buscarItem(idLista, idItem);
        item.setQuantidade(validarQuantidade(quantidade));
        return montarDTO(item.getLista());
    }

    @Transactional
    public ListaCompraDTO removerItem(Long idLista, Long idItem) {
        ListaCompra lista = buscarEntidade(idLista);
        itemListaRepository.delete(buscarItem(idLista, idItem));
        return montarDTO(lista);
    }

    @Transactional
    public ListaCompraDTO removerProduto(Long idLista, Long idProduto) {
        ListaCompra lista = buscarEntidade(idLista);
        ItemLista item = itemListaRepository.findByLista_IdListaAndProduto_IdProduto(idLista, idProduto)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto nao encontrado na lista"));
        itemListaRepository.delete(item);
        return montarDTO(lista);
    }

    @Transactional
    public ListaCompraDTO limpar(Long idLista) {
        ListaCompra lista = buscarEntidade(idLista);
        itemListaRepository.deleteAll(itemListaRepository.findByLista_IdListaOrderByIdItemAsc(idLista));
        return montarDTO(lista);
    }

    @Transactional(readOnly = true)
    public BigDecimal calcularTotal(Long idLista) {
        buscarEntidade(idLista);
        return itemListaRepository.findByLista_IdListaOrderByIdItemAsc(idLista).stream()
                .map(this::calcularSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private ListaCompra buscarEntidade(Long idLista) {
        return listaCompraRepository.findById(idLista)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lista de compras nao encontrada"));
    }

    private Produto buscarProduto(Long idProduto) {
        if (idProduto == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Produto deve ser informado");
        }
        return produtoRepository.findById(idProduto)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto nao encontrado"));
    }

    private ItemLista buscarItem(Long idLista, Long idItem) {
        ItemLista item = itemListaRepository.findById(idItem)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item da lista nao encontrado"));
        if (!item.getLista().getIdLista().equals(idLista)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Item nao pertence a lista informada");
        }
        return item;
    }

    private int validarQuantidade(Integer quantidade) {
        if (quantidade == null || quantidade <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantidade deve ser maior que zero");
        }
        return quantidade;
    }

    private ListaCompraDTO montarDTO(ListaCompra lista) {
        List<ItemListaDTO> itens = itemListaRepository.findByLista_IdListaOrderByIdItemAsc(lista.getIdLista()).stream()
                .map(this::paraItemDTO)
                .toList();

        int quantidadeTotal = itens.stream()
                .mapToInt(ItemListaDTO::quantidade)
                .sum();

        BigDecimal total = itens.stream()
                .map(ItemListaDTO::subtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new ListaCompraDTO(
                lista.getIdLista(),
                lista.getNomeLista(),
                lista.getDataCriacao(),
                itens,
                quantidadeTotal,
                total
        );
    }

    private ItemListaDTO paraItemDTO(ItemLista item) {
        Produto produto = item.getProduto();
        return new ItemListaDTO(
                item.getIdItem(),
                produto.getIdProduto(),
                produto.getNome(),
                produto.getPreco(),
                item.getQuantidade(),
                calcularSubtotal(item)
        );
    }

    private BigDecimal calcularSubtotal(ItemLista item) {
        return item.getProduto().getPreco()
                .multiply(BigDecimal.valueOf(item.getQuantidade()));
    }
}
