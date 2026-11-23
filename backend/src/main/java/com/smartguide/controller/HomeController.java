package com.smartguide.controller;

import com.smartguide.dto.StatusDTO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Endpoints de verificacao de disponibilidade da API.
 */
@RestController
public class HomeController {

    @GetMapping("/")
    public StatusDTO raiz() {
        return status();
    }

    @GetMapping("/api/status")
    public StatusDTO status() {
        return new StatusDTO("smart-guide-backend", "UP");
    }
}
