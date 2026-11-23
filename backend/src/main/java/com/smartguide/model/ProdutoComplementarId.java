package com.smartguide.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

/**
 * Chave composta da tabela PRODUTO_COMPLEMENTAR.
 */
@Embeddable
public class ProdutoComplementarId implements Serializable {

    @Column(name = "ID_PRODUTO", nullable = false)
    private Long idProduto;

    @Column(name = "ID_PRODUTO_COMPLEMENTAR", nullable = false)
    private Long idProdutoComplementar;

    public ProdutoComplementarId() {
    }

    public ProdutoComplementarId(Long idProduto, Long idProdutoComplementar) {
        this.idProduto = idProduto;
        this.idProdutoComplementar = idProdutoComplementar;
    }

    public Long getIdProduto() {
        return idProduto;
    }

    public void setIdProduto(Long idProduto) {
        this.idProduto = idProduto;
    }

    public Long getIdProdutoComplementar() {
        return idProdutoComplementar;
    }

    public void setIdProdutoComplementar(Long idProdutoComplementar) {
        this.idProdutoComplementar = idProdutoComplementar;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ProdutoComplementarId that)) {
            return false;
        }
        return Objects.equals(idProduto, that.idProduto)
                && Objects.equals(idProdutoComplementar, that.idProdutoComplementar);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idProduto, idProdutoComplementar);
    }
}
