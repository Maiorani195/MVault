package com.mvault.dto.response;

import com.mvault.model.Categoria;

public record CategoriaResponse(
        Long id,
        String nome,
        String descricao,
        boolean ativo
) {

    public static CategoriaResponse fromEntity(Categoria categoria) {
        return new CategoriaResponse(
                categoria.getId(),
                categoria.getNome(),
                categoria.getDescricao(),
                categoria.getAtivo()
        );
    }
}
