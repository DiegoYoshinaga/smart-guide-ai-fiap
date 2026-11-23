package com.smartguide.controller;

import com.smartguide.dto.LocalizacaoDTO;
import com.smartguide.service.MapaService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Endpoint de localizacao do produto no mapa da loja.
 */
@RestController
@RequestMapping("/api/mapa")
public class MapaController {

    private final MapaService mapaService;

    public MapaController(MapaService mapaService) {
        this.mapaService = mapaService;
    }

    @GetMapping("/produto/{id}")
    public LocalizacaoDTO localizacaoDoProduto(@PathVariable Long id) {
        return mapaService.localizacaoDoProduto(id);
    }
}
