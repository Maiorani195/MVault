package com.mvault.dto.request;

import com.mvault.model.TipoMovimentacao;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record MovimentacaoRequest(

        @NotNull(message = "Tipo de Movimentacao , ENTRADA OU SAIDA")
        TipoMovimentacao tipo,

        @NotNull(message = "A quantidade é obrigatória")
        @Min(value = 1 , message = "O valor minimo é de 1 unidade")
        Integer quantidade,

        @NotNull(message = "ID do produto é obrigatório")
        Long produtoId,

        @Size(max = 300 , message = " A observação pode ter no maximo 300 caracteres!")
        String observacao
) {
}
