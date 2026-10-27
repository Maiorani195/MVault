package com.mvault.dto.response;
import com.mvault.model.Movimentacao;
import com.mvault.model.TipoMovimentacao;
import java.time.LocalDateTime;
public record MovimentacaoResponse(
        Long id,
        TipoMovimentacao tipo,
        Integer quantidade,
        String observacao,
        LocalDateTime criadoEm,
        Long produtoId,
        String produtoNome,
        Integer estoqueAtualAposMov
) {
    public static MovimentacaoResponse fromEntity(Movimentacao mov) {
        return new MovimentacaoResponse(
                mov.getId(),
                mov.getTipo(),
                mov.getQuantidade(),
                mov.getObservacao(),
                mov.getCriadoEm(),
                mov.getProduto().getId(),
                mov.getProduto().getNome(),
                mov.getProduto().getQuantidadeEstoque()
        );
    }
}