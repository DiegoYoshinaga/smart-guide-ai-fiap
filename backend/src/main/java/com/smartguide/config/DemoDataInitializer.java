package com.smartguide.config;

import com.smartguide.model.Categoria;
import com.smartguide.model.Produto;
import com.smartguide.repository.CategoriaRepository;
import com.smartguide.repository.ProdutoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Popula o banco local de demonstracao com o mesmo catalogo usado pelo frontend.
 * Nao roda no perfil "oracle": nesse caso os dados vem do script SQL do projeto.
 */
@Component
@Profile("demo")
public class DemoDataInitializer implements CommandLineRunner {

    private final CategoriaRepository categoriaRepository;
    private final ProdutoRepository produtoRepository;

    public DemoDataInitializer(CategoriaRepository categoriaRepository, ProdutoRepository produtoRepository) {
        this.categoriaRepository = categoriaRepository;
        this.produtoRepository = produtoRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (produtoRepository.count() > 0) {
            return;
        }

        Map<String, Categoria> categorias = new LinkedHashMap<>();
        categorias.put("Hidraulica", categoria("Hidraulica", "Produtos para instalacoes hidraulicas"));
        categorias.put("Pintura", categoria("Pintura", "Tintas e acessorios para pintura"));
        categorias.put("Ferramentas", categoria("Ferramentas", "Ferramentas manuais e eletricas"));
        categorias.put("Eletrica", categoria("Eletrica", "Materiais e acessorios eletricos"));
        categorias.put("Construcao", categoria("Construcao", "Materiais para construcao e reforma"));
        categorias.put("Jardinagem", categoria("Jardinagem", "Produtos para jardim e irrigacao"));
        categorias.put("Organizacao", categoria("Organizacao", "Itens para organizar os ambientes"));

        produto(categorias.get("Hidraulica"), "Fita veda-rosca 18 mm x 10 m",
                "Fita para vedacao de conexoes roscadas em instalacoes hidraulicas.",
                "8.90", 60, "2", "Conexoes", "A3");
        produto(categorias.get("Hidraulica"), "Torneira para banheiro cromada",
                "Torneira de bancada com acabamento cromado para banheiro.",
                "89.90", 25, "2", "Metais sanitarios", "B2");
        produto(categorias.get("Ferramentas"), "Chave inglesa ajustavel 10 pol.",
                "Ferramenta ajustavel para apertar e soltar porcas e conexoes.",
                "42.50", 20, "4", "Chaves", "C1");
        produto(categorias.get("Pintura"), "Tinta acrilica fosca branca 3,6 L",
                "Tinta para pintura de paredes internas, com acabamento fosco.",
                "119.90", 15, "1", "Tintas acrilicas", "A1");
        produto(categorias.get("Pintura"), "Rolo para pintura 23 cm",
                "Rolo para aplicacao de tinta em superficies lisas e paredes.",
                "24.90", 35, "1", "Acessorios de pintura", "B4");
        produto(categorias.get("Pintura"), "Kit de pinceis para pintura",
                "Conjunto de pinceis para recortes e acabamento em pintura.",
                "18.90", 50, "1", "Acessorios de pintura", "B2");
        produto(categorias.get("Ferramentas"), "Furadeira de impacto 650 W",
                "Furadeira eletrica para perfuracoes em madeira, metal e alvenaria.",
                "249.90", 10, "4", "Ferramentas eletricas", "D1");
        produto(categorias.get("Construcao"), "Kit de buchas e parafusos",
                "Conjunto para fixacao de objetos e instalacao de prateleiras.",
                "16.90", 80, "4", "Fixadores", "A4");
        produto(categorias.get("Organizacao"), "Prateleira de madeira 60 cm",
                "Prateleira para organizacao e decoracao de ambientes internos.",
                "54.90", 40, "6", "Prateleiras", "B1");
        produto(categorias.get("Eletrica"), "Lampada LED bulbo 9 W",
                "Lampada LED para iluminacao residencial, luz branca.",
                "12.90", 70, "3", "Lampadas LED", "A2");
        produto(categorias.get("Eletrica"), "Extensao eletrica 5 m",
                "Extensao para ampliar o alcance de tomadas em ambientes internos.",
                "39.90", 30, "3", "Extensoes", "B3");
        produto(categorias.get("Jardinagem"), "Mangueira para jardim 15 m",
                "Mangueira flexivel para rega e cuidados gerais com o jardim.",
                "69.90", 22, "5", "Irrigacao", "A1");
        produto(categorias.get("Ferramentas"), "Kit de ferramentas manuais",
                "Conjunto demonstrativo de ferramentas para pequenos reparos domesticos.",
                "74.90", 18, "4", "Kits de ferramentas", "C3");
    }

    private Categoria categoria(String nome, String descricao) {
        Categoria categoria = new Categoria();
        categoria.setNome(nome);
        categoria.setDescricao(descricao);
        return categoriaRepository.save(categoria);
    }

    private void produto(Categoria categoria, String nome, String descricao, String preco,
                         int quantidade, String corredor, String secao, String prateleira) {
        Produto produto = new Produto();
        produto.setCategoria(categoria);
        produto.setNome(nome);
        produto.setDescricao(descricao);
        produto.setPreco(new BigDecimal(preco));
        produto.setQuantidadeDisponivel(quantidade);
        produto.setCorredor(corredor);
        produto.setSecao(secao);
        produto.setPrateleira(prateleira);
        produto.setAtivo("S");
        produtoRepository.save(produto);
    }
}
