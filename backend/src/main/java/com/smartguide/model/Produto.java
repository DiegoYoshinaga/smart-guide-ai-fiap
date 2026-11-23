package com.smartguide.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Entidade mapeada para a tabela PRODUTO.
 */
@Entity
@Table(name = "PRODUTO")
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_PRODUTO")
    private Long idProduto;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_CATEGORIA", nullable = false)
    private Categoria categoria;

    @Column(name = "NOME", nullable = false, length = 150)
    private String nome;

    @Column(name = "DESCRICAO", length = 1000)
    private String descricao;

    @Column(name = "PRECO", nullable = false, precision = 10, scale = 2)
    private BigDecimal preco;

    @Column(name = "IMAGEM_URL", length = 500)
    private String imagemUrl;

    @Column(name = "QUANTIDADE_DISPONIVEL", nullable = false)
    private Integer quantidadeDisponivel = 0;

    @Column(name = "CORREDOR", length = 50)
    private String corredor;

    @Column(name = "SECAO", length = 50)
    private String secao;

    @Column(name = "PRATELEIRA", length = 50)
    private String prateleira;

    /**
     * Coluna ATIVO do tipo CHAR(1) com os valores 'S' ou 'N'.
     */
    @Column(name = "ATIVO", nullable = false, length = 1)
    private String ativo = "S";

    @OneToMany(mappedBy = "produto", fetch = FetchType.LAZY)
    private List<ProdutoComplementar> complementares = new ArrayList<>();

    public Produto() {
    }

    public Long getIdProduto() {
        return idProduto;
    }

    public void setIdProduto(Long idProduto) {
        this.idProduto = idProduto;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public BigDecimal getPreco() {
        return preco;
    }

    public void setPreco(BigDecimal preco) {
        this.preco = preco;
    }

    public String getImagemUrl() {
        return imagemUrl;
    }

    public void setImagemUrl(String imagemUrl) {
        this.imagemUrl = imagemUrl;
    }

    public Integer getQuantidadeDisponivel() {
        return quantidadeDisponivel;
    }

    public void setQuantidadeDisponivel(Integer quantidadeDisponivel) {
        this.quantidadeDisponivel = quantidadeDisponivel;
    }

    public String getCorredor() {
        return corredor;
    }

    public void setCorredor(String corredor) {
        this.corredor = corredor;
    }

    public String getSecao() {
        return secao;
    }

    public void setSecao(String secao) {
        this.secao = secao;
    }

    public String getPrateleira() {
        return prateleira;
    }

    public void setPrateleira(String prateleira) {
        this.prateleira = prateleira;
    }

    public String getAtivo() {
        return ativo;
    }

    public void setAtivo(String ativo) {
        this.ativo = ativo;
    }

    public List<ProdutoComplementar> getComplementares() {
        return complementares;
    }

    public void setComplementares(List<ProdutoComplementar> complementares) {
        this.complementares = complementares;
    }
}
