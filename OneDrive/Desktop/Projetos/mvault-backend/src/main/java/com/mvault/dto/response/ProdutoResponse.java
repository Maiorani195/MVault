package com.mvault.dto.response;

import com.mvault.model.Produto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ProdutoResponse(

        Long id ,
        String nome,
        String descricao,
        BigDecimal preco,
        Integer quantidadeEstoque,
        Integer estoqueMinimo,
        Boolean estoqueBaixo,
        Boolean ativo,
        LocalDateTime criadoEm,
        LocalDateTime atualizadoEm,
        Long categoriaId,
        String categoriaNome,
        Long fornecedorId,
        String fornecedorNome
) {
    public static ProdutoResponse fromEntity(Produto produto) {
        return new ProdutoResponse(
                produto.getId(),
                produto.getNome(),
                produto.getDescricao(),
                produto.getPreco(),
                produto.getQuantidadeEstoque(),
                produto.getestoqueMinimo(),
                produto.isEstoqueBaixo(),
                produto.getAtivo(),
                produto.getCriadoEm(),
                produto.getAtualizadoEm(),
                produto.getCategoria().getId(),
                produto.getCategoria().getNome(),
                produto.getFornecedor().getId(),
                produto.getFornecedor().getNome()
        );

    }

}
