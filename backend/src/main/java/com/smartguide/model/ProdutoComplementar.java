package com.smartguide.model;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;

/**
 * Entidade mapeada para a tabela PRODUTO_COMPLEMENTAR.
 * Relaciona dois produtos que podem ser usados em conjunto.
 */
@Entity
@Table(name = "PRODUTO_COMPLEMENTAR")
public class ProdutoComplementar {

    @EmbeddedId
    private ProdutoComplementarId id;

    @MapsId("idProduto")
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_PRODUTO", nullable = false)
    private Produto produto;

    @MapsId("idProdutoComplementar")
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_PRODUTO_COMPLEMENTAR", nullable = false)
    private Produto produtoComplementar;

    public ProdutoComplementar() {
    }

    public ProdutoComplementar(Produto produto, Produto produtoComplementar) {
        this.produto = produto;
        this.produtoComplementar = produtoComplementar;
        this.id = new ProdutoComplementarId(produto.getIdProduto(), produtoComplementar.getIdProduto());
    }

    public ProdutoComplementarId getId() {
        return id;
    }

    public void setId(ProdutoComplementarId id) {
        this.id = id;
    }

    public Produto getProduto() {
        return produto;
    }

    public void setProduto(Produto produto) {
        this.produto = produto;
    }

    public Produto getProdutoComplementar() {
        return produtoComplementar;
    }

    public void setProdutoComplementar(Produto produtoComplementar) {
        this.produtoComplementar = produtoComplementar;
    }
}
