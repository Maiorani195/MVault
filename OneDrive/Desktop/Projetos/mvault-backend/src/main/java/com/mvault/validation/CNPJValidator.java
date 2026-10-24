package com.mvault.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class CNPJValidator implements ConstraintValidator<CNPJ, String> {

    @Override
    public boolean isValid(String cnpj, ConstraintValidatorContext context) {
        if (cnpj == null || cnpj.isBlank()) return true;

        String digits = cnpj.replaceAll("[^0-9]", "");

        if (digits.length() != 14) return false;
        if (digits.chars().distinct().count() == 1) return false;

        // 1º dígito verificador
        int[] pesos1 = {5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};
        int soma = 0;
        for (int i = 0; i < 12; i++) {
            soma += (digits.charAt(i) - '0') * pesos1[i];
        }
        int resto = soma % 11;
        int primeiroDigito = resto < 2 ? 0 : 11 - resto;
        if (primeiroDigito != (digits.charAt(12) - '0')) return false;

        // 2º dígito verificador
        int[] pesos2 = {6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};
        soma = 0;
        for (int i = 0; i < 13; i++) {
            soma += (digits.charAt(i) - '0') * pesos2[i];
        }
        resto = soma % 11;
        int segundoDigito = resto < 2 ? 0 : 11 - resto;

        return segundoDigito == (digits.charAt(13) - '0');
    }
}
