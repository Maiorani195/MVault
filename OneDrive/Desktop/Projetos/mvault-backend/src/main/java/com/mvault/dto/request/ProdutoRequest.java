package com.mvault.dto.request;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record ProdutoRequest(

        @NotBlank(message = "Nome é obrigatório!")
        @Size(max = 250 , message = "O nome deve ter no máximo 250 caracteres")
        String nome,


        @Size(max = 500 , message = "A descricão pode ter no maximo 500 caracteres")
        String descricao,

        @NotNull(message = "Preço é obrigatório!")
        @DecimalMin(value = "0.01" , message= "Preco deve ser maior que zero")
        BigDecimal preco,

        @NotNull(message = "Estoque minimo é obrigatório")
        @Min(value = 0, message = "Estoque minimo nao pode ser menos que zero")
        Integer estoqueMinimo,

        @NotNull(message = "Categoria é obrigatório!")
        Long categoriaId,

        @NotNull(message = "Fornecedor é obrigatório")
        Long fornecedorId
)
{}









