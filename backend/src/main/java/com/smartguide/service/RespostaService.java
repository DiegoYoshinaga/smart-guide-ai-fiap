package com.smartguide.service;

import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

/**
 * Centraliza as respostas predefinidas do assistente.
 * A identificacao e feita por palavras-chave, sem uso de IA real ou APIs externas.
 */
@Service
public class RespostaService {

    /**
     * Conjunto de palavras-chave, resposta e categorias relacionadas.
     */
    public record Intencao(
            String nome,
            List<String> palavrasChave,
            String resposta,
            List<String> categorias
    ) {
    }

    private static final String RESPOSTA_PADRAO =
            "Ainda nao consegui identificar o tipo de projeto. Conte um pouco mais: "
                    + "voce precisa de materiais para pintura, hidraulica, eletrica, ferramentas, "
                    + "construcao, jardinagem ou organizacao?";

    private static final List<Intencao> INTENCOES = List.of(
            new Intencao(
                    "pintura",
                    List.of("pintar", "pintura", "parede", "tinta", "pincel", "rolo"),
                    "Para pintar uma parede, em geral voce pode precisar de tinta e acessorios de "
                            + "aplicacao. Confira os produtos disponiveis no catalogo; a preparacao "
                            + "depende da superficie e do acabamento desejado.",
                    List.of("pintura")
            ),
            new Intencao(
                    "hidraulica",
                    List.of("torneira", "vazando", "vazamento", "cano", "encanamento", "hidraulica",
                            "vedar", "vedacao"),
                    "Para verificar um vazamento, podem ser uteis itens de vedacao e ferramentas para "
                            + "conexoes. O reparo necessario depende da origem do problema. Veja algumas "
                            + "opcoes cadastradas no catalogo.",
                    List.of("hidraulica")
            ),
            new Intencao(
                    "eletrica",
                    List.of("eletrica", "eletrico", "lampada", "tomada", "fio", "interruptor", "iluminacao"),
                    "Para um projeto eletrico, consulte os materiais disponiveis abaixo. Antes de "
                            + "qualquer manutencao, desligue a energia e procure um profissional "
                            + "qualificado quando necessario.",
                    List.of("eletrica")
            ),
            new Intencao(
                    "ferramentas",
                    List.of("ferramenta", "ferramentas", "furadeira", "chave", "montar", "montagem",
                            "movel", "parafuso", "prateleira"),
                    "Para montar um movel ou instalar uma prateleira, ferramentas e itens de fixacao "
                            + "podem ajudar. Confira abaixo os produtos cadastrados que podem ser "
                            + "relevantes.",
                    List.of("ferramentas", "organizacao", "construcao")
            ),
            new Intencao(
                    "construcao",
                    List.of("construcao", "cimento", "argamassa", "tijolo", "reforma", "alvenaria", "bucha"),
                    "Para obras e pequenos reparos, os materiais adequados dependem do tipo de "
                            + "superficie e do servico. Veja os itens relacionados encontrados no catalogo.",
                    List.of("construcao")
            ),
            new Intencao(
                    "jardinagem",
                    List.of("jardim", "jardinagem", "planta", "regar", "mangueira", "vaso", "grama"),
                    "Para cuidar do jardim, ha produtos de irrigacao e outros itens que podem atender "
                            + "ao seu projeto. Confira as opcoes cadastradas abaixo.",
                    List.of("jardinagem")
            ),
            new Intencao(
                    "organizacao",
                    List.of("organizacao", "organizar", "prateleira", "estante", "guardar", "armario"),
                    "Para organizar seus espacos, voce pode explorar os produtos de armazenamento e "
                            + "organizacao disponiveis no catalogo.",
                    List.of("organizacao")
            )
    );

    /**
     * Identifica a intencao da mensagem pela primeira palavra-chave encontrada.
     */
    public Optional<Intencao> identificar(String mensagem) {
        String texto = normalizar(mensagem);
        if (texto.isEmpty()) {
            return Optional.empty();
        }
        return INTENCOES.stream()
                .filter(intencao -> intencao.palavrasChave().stream().anyMatch(texto::contains))
                .findFirst();
    }

    public String respostaPadrao() {
        return RESPOSTA_PADRAO;
    }

    /**
     * Remove acentos e normaliza a caixa do texto para comparacao.
     */
    public static String normalizar(String texto) {
        if (texto == null) {
            return "";
        }
        String semAcento = Normalizer.normalize(texto, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");
        return semAcento.toLowerCase(Locale.ROOT).trim();
    }
}
