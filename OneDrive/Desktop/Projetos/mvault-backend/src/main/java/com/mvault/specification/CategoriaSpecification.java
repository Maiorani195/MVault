package com.mvault.specification;

import com.mvault.model.Categoria;
import org.springframework.data.jpa.domain.Specification;

public class CategoriaSpecification {

    public static Specification<Categoria> comFiltro(String nome) {
        return (root, query, criteriaBuilder) -> {
            var predicate = criteriaBuilder.conjunction();


            predicate = criteriaBuilder.and(predicate, criteriaBuilder.isTrue(root.get("ativo")));


            if (nome != null && !nome.isBlank()) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("nome")), "%" + nome.toLowerCase() + "%")
                );
            }

            return predicate;
        };
    }
}