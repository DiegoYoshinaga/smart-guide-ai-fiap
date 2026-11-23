package com.smartguide.service;

import com.smartguide.dto.CategoriaDTO;
import com.smartguide.repository.CategoriaRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Consultas de categorias para o catalogo do frontend.
 */
@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoriaDTO> listar() {
        return categoriaRepository.findAll(Sort.by("nome")).stream()
                .map(categoria -> new CategoriaDTO(categoria.getIdCategoria(), categoria.getNome()))
                .toList();
    }
}
