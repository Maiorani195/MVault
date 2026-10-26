package com.mvault.dto.request;

import com.mvault.validation.CNPJ;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record FornecedorRequest(
        @NotBlank(message = "O nome é obrigatório")
        @Size(min = 2, max = 150, message = "O nome deve ter entre 2 e 150 caracteres")
        String nome,

        @NotBlank(message = "O CNPJ é obrigatório")
        @CNPJ(message = "CNPJ inválido")
        String cnpj,

        @Email(message = "Email inválido")
        @Size(max = 150, message = "O e-mail pode ter no máximo 150 caracteres")
        String email,

        @Size(max = 20, message = "O telefone pode ter no máximo 20 caracteres")
        String telefone,

        @Size(max = 255, message = "O endereço pode ter no máximo 255 caracteres")
        String endereco
) {}