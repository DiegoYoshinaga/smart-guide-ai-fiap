package com.smartguide.repository;

import com.smartguide.model.Produto;
import com.smartguide.model.ProdutoComplementar;
import com.smartguide.model.ProdutoComplementarId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Repositorio de acesso a tabela PRODUTO_COMPLEMENTAR.
 */
public interface ProdutoComplementarRepository extends JpaRepository<ProdutoComplementar, ProdutoComplementarId> {

    /**
     * Produtos complementares de um produto informado.
     */
    @Query("""
            select pc.produtoComplementar from ProdutoComplementar pc
            where pc.produto.idProduto = :idProduto
            order by pc.produtoComplementar.nome
            """)
    List<Produto> buscarComplementares(@Param("idProduto") Long idProduto);
}
