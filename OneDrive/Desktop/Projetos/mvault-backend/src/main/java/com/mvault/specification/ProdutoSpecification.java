package com.mvault.specification;

import com.mvault.model.Produto;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;
import java.util.ArrayList;
import java.util.List;

public class ProdutoSpecification {

    private ProdutoSpecification() {}

    public static Specification<Produto> comFiltro(String nome, Long categoriaId,
                                                   Long fornecedorId, Boolean estoqueBaixo) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();


            predicates.add(cb.isTrue(root.get("ativo")));


            if (nome != null && !nome.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("nome")),
                        "%" + nome.toLowerCase() + "%"));
            }


            if (categoriaId != null) {
                predicates.add(cb.equal(root.get("categoria").get("id"), categoriaId));
            }

            if (fornecedorId != null) {
                predicates.add(cb.equal(root.get("fornecedor").get("id"), fornecedorId));
            }


            if (Boolean.TRUE.equals(estoqueBaixo)) {
                predicates.add(cb.lessThan(root.get("quantidadeEstoque"),
                        root.get("estoqueMinimo")));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}