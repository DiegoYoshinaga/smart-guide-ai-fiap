package com.smartguide.repository;

import com.smartguide.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Repositorio de acesso a tabela PRODUTO.
 */
public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    /**
     * Busca produtos por nome ou descricao e/ou por categoria.
     * Os filtros nulos sao ignorados.
     *
     * @param nome       trecho do nome ou da descricao
     * @param categoria  nome exato da categoria
     */
    @Query("""
            select p from Produto p
            where (:categoria is null or upper(p.categoria.nome) = upper(:categoria))
              and (:nome is null
                   or locate(upper(:nome), upper(p.nome)) > 0
                   or locate(upper(:nome), upper(p.descricao)) > 0)
            order by p.nome
            """)
    List<Produto> buscar(@Param("nome") String nome, @Param("categoria") String categoria);
}
