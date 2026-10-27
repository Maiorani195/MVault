package com.mvault.specification;

import com.mvault.model.Movimentacao;
import com.mvault.model.TipoMovimentacao;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class MovimentacaoSpecification {

    private MovimentacaoSpecification() {}

    public static Specification<Movimentacao> comFiltro(TipoMovimentacao tipo,
                                                        Long produtoId,
                                                        LocalDateTime dataInicio,
                                                        LocalDateTime dataFim) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();


            if (tipo != null) {
                predicates.add(cb.equal(root.get("tipo"), tipo));
            }


            if (produtoId != null) {
                predicates.add(cb.equal(root.get("produto").get("id"), produtoId));
            }


            if (dataInicio != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("criadoEm"), dataInicio));
            }


            if (dataFim != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("criadoEm"), dataFim));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}