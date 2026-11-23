package com.smartguide.controller;

import com.smartguide.dto.ChatRequestDTO;
import com.smartguide.dto.ChatResponseDTO;
import com.smartguide.service.ChatService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Endpoint do assistente: recebe a mensagem e devolve a resposta
 * com os produtos recomendados.
 */
@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping
    public ChatResponseDTO responder(@RequestBody ChatRequestDTO mensagem) {
        return chatService.responder(mensagem);
    }
}
