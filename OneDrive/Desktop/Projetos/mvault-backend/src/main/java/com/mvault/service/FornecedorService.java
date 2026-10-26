package com.mvault.service;

import com.mvault.dto.request.FornecedorRequest;
import com.mvault.dto.response.FornecedorResponse;
import com.mvault.exception.BusinessException;
import com.mvault.exception.ResourceNotFoundException;
import com.mvault.model.Fornecedor;
import com.mvault.repository.FornecedorRepository;
import com.mvault.specification.FornecedorSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FornecedorService {

    private final FornecedorRepository fornecedorRepository;

    public FornecedorService(FornecedorRepository fornecedorRepository) {
        this.fornecedorRepository = fornecedorRepository;
    }

    @Transactional(readOnly = true)
    public Page<FornecedorResponse> listar(String nome, String cnpj, Pageable pageable) {
        return fornecedorRepository.findAll(FornecedorSpecification.comFiltro(nome, cnpj), pageable)
                .map(FornecedorResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public FornecedorResponse buscarPorId(Long id) {
        Fornecedor fornecedor = buscarEntidadePorId(id);
        return FornecedorResponse.fromEntity(fornecedor);
    }

    @Transactional
    public FornecedorResponse criar(FornecedorRequest request) {
        String cnpjLimpo = limparCnpj(request.cnpj());

        if (fornecedorRepository.existsByCnpj(cnpjLimpo)) {
            throw new BusinessException("Já existe um fornecedor cadastrado com o CNPJ: " + request.cnpj());
        }

        Fornecedor fornecedor = new Fornecedor(
                request.nome(),
                cnpjLimpo,
                request.email(),
                request.telefone(),
                request.endereco(),
                true
        );

        Fornecedor fornecedorSalvo = fornecedorRepository.save(fornecedor);
        return FornecedorResponse.fromEntity(fornecedorSalvo);
    }

    @Transactional
    public FornecedorResponse atualizar(Long id, FornecedorRequest request) {
        Fornecedor fornecedor = buscarEntidadePorId(id);
        String cnpjLimpo = limparCnpj(request.cnpj());

        if (fornecedorRepository.existsByCnpjAndIdNot(cnpjLimpo, id)) {
            throw new BusinessException("Já existe outro fornecedor cadastrado com o CNPJ: " + request.cnpj());
        }

        fornecedor.setNome(request.nome());
        fornecedor.setCnpj(cnpjLimpo);
        fornecedor.setEmail(request.email());
        fornecedor.setTelefone(request.telefone());
        fornecedor.setEndereco(request.endereco());

        Fornecedor fornecedorAtualizado = fornecedorRepository.save(fornecedor);
        return FornecedorResponse.fromEntity(fornecedorAtualizado);
    }

    @Transactional
    public void desativar(Long id) {
        Fornecedor fornecedor = buscarEntidadePorId(id);
        fornecedor.setAtivo(false);
        fornecedorRepository.save(fornecedor);
    }



    private Fornecedor buscarEntidadePorId(Long id) {
        return fornecedorRepository.findById(id)
                .filter(Fornecedor::getAtivo)
                .orElseThrow(() -> new ResourceNotFoundException("Fornecedor não encontrado com o ID: " + id));
    }

    private String limparCnpj(String cnpj) {
        return cnpj != null ? cnpj.replaceAll("[^0-9]", "") : null;
    }
}