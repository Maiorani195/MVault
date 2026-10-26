package com.mvault.repository;

import com.mvault.model.Fornecedor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface FornecedorRepository extends JpaRepository <Fornecedor, Long>, JpaSpecificationExecutor<Fornecedor> {


    boolean existsByCnpj(String cpnj);

    boolean existsByCnpjAndIdNot(String cnpj , Long id);





}
