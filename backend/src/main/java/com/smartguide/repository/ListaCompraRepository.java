package com.smartguide.repository;

import com.smartguide.model.ListaCompra;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio de acesso a tabela LISTA_COMPRAS.
 */
public interface ListaCompraRepository extends JpaRepository<ListaCompra, Long> {
}
