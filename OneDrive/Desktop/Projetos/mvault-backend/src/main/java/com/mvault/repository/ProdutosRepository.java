package com.mvault.repository;

import com.mvault.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ProdutosRepository extends JpaRepository<Produto, Long> , JpaSpecificationExecutor<Produto> {


    boolean existsByNomeIgnoreCase(String nome);


    boolean existsByNomeIgnoreCaseAndIdNot(String nome , Long id);
}
