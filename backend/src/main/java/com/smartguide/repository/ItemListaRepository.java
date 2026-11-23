package com.smartguide.repository;

import com.smartguide.model.ItemLista;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio de acesso a tabela ITEM_LISTA.
 */
public interface ItemListaRepository extends JpaRepository<ItemLista, Long> {

    List<ItemLista> findByLista_IdListaOrderByIdItemAsc(Long idLista);

    Optional<ItemLista> findByLista_IdListaAndProduto_IdProduto(Long idLista, Long idProduto);
}
