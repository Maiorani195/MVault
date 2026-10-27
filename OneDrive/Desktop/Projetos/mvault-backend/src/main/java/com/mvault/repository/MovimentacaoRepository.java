package com.mvault.repository;

import com.mvault.model.Movimentacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface MovimentacaoRepository extends JpaRepository<Movimentacao, Long> , JpaSpecificationExecutor<Movimentacao> {




}
