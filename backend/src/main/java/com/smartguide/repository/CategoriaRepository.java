package com.smartguide.repository;

import com.smartguide.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio de acesso a tabela CATEGORIA.
 */
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
}
