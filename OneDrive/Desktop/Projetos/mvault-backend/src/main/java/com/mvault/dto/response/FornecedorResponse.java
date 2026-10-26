package com.mvault.dto.response;
import com.mvault.model.Fornecedor;

public record FornecedorResponse(
        Long Id,
        String nome,
        String cnpj,
        String email,
        String telefone,
        String endereco,
        Boolean ativo
) {
    public static FornecedorResponse fromEntity(Fornecedor fornecedor) {
        return new FornecedorResponse(
                fornecedor.getId(),
                fornecedor.getNome(),
                fornecedor.getCnpj(),
                fornecedor.getEmail(),
                fornecedor.getTelefone(),
                fornecedor.getEndereco(),
                fornecedor.getAtivo()
        );
    }
}












