package com.smartguide.controller;

import com.smartguide.dto.ErroDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.server.ResponseStatusException;

/**
 * Converte as excecoes da aplicacao em respostas JSON simples,
 * sem expor stack trace ou detalhes internos.
 */
@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErroDTO> tratarStatus(ResponseStatusException excecao) {
        HttpStatusCode status = excecao.getStatusCode();
        String mensagem = excecao.getReason() != null
                ? excecao.getReason()
                : "Nao foi possivel concluir a solicitacao";
        return ResponseEntity.status(status).body(new ErroDTO(status.value(), mensagem));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErroDTO> tratarCorpoInvalido(HttpMessageNotReadableException excecao) {
        return ResponseEntity.badRequest()
                .body(new ErroDTO(HttpStatus.BAD_REQUEST.value(), "Corpo da requisicao invalido ou ausente"));
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErroDTO> tratarParametroInvalido(MethodArgumentTypeMismatchException excecao) {
        return ResponseEntity.badRequest()
                .body(new ErroDTO(HttpStatus.BAD_REQUEST.value(), "Parametro informado em formato invalido"));
    }
}
