package com.smartguide.controller;

import com.smartguide.dto.ItemListaDTO;
import com.smartguide.dto.ItemListaRequestDTO;
import com.smartguide.dto.ListaCompraDTO;
import com.smartguide.dto.ListaCompraRequestDTO;
import com.smartguide.dto.QuantidadeDTO;
import com.smartguide.dto.TotalListaDTO;
import com.smartguide.service.ListaComprasService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.web.server.ResponseStatusException;

import java.net.URI;
import java.util.List;

/**
 * Endpoints da lista de compras.
 */
@RestController
@RequestMapping("/api/lista-compras")
public class ListaComprasController {

    private final ListaComprasService listaComprasService;

    public ListaComprasController(ListaComprasService listaComprasService) {
        this.listaComprasService = listaComprasService;
    }

    @PostMapping
    public ResponseEntity<ListaCompraDTO> criar(@RequestBody ListaCompraRequestDTO requisicao) {
        ListaCompraDTO lista = listaComprasService.criar(requisicao != null ? requisicao.nome() : null);
        URI local = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(lista.id())
                .toUri();
        return ResponseEntity.created(local).body(lista);
    }

    @GetMapping
    public List<ListaCompraDTO> listar() {
        return listaComprasService.listar();
    }

    @GetMapping("/{id}")
    public ListaCompraDTO buscar(@PathVariable Long id) {
        return listaComprasService.buscar(id);
    }

    @GetMapping("/{id}/itens")
    public List<ItemListaDTO> consultarItens(@PathVariable Long id) {
        return listaComprasService.consultarItens(id);
    }

    @GetMapping("/{id}/total")
    public TotalListaDTO calcularTotal(@PathVariable Long id) {
        return new TotalListaDTO(id, listaComprasService.calcularTotal(id));
    }

    @PostMapping("/{id}/itens")
    public ListaCompraDTO adicionarItem(@PathVariable Long id,
                                        @RequestBody ItemListaRequestDTO requisicao) {
        if (requisicao == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Produto deve ser informado");
        }
        return listaComprasService.adicionarItem(id, requisicao.produtoId(), requisicao.quantidade());
    }

    @PutMapping("/{id}/itens/{idItem}")
    public ListaCompraDTO atualizarQuantidade(@PathVariable Long id,
                                              @PathVariable Long idItem,
                                              @RequestBody QuantidadeDTO requisicao) {
        if (requisicao == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantidade deve ser informada");
        }
        return listaComprasService.atualizarQuantidade(id, idItem, requisicao.quantidade());
    }

    @DeleteMapping("/{id}/itens/{idItem}")
    public ListaCompraDTO removerItem(@PathVariable Long id, @PathVariable Long idItem) {
        return listaComprasService.removerItem(id, idItem);
    }

    @DeleteMapping("/{id}/produtos/{idProduto}")
    public ListaCompraDTO removerProduto(@PathVariable Long id, @PathVariable Long idProduto) {
        return listaComprasService.removerProduto(id, idProduto);
    }

    @DeleteMapping("/{id}/itens")
    public ListaCompraDTO limpar(@PathVariable Long id) {
        return listaComprasService.limpar(id);
    }
}
