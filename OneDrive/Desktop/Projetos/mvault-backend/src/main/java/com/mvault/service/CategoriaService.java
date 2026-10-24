package com.mvault.service;

import com.mvault.dto.request.CategoriaRequest;
import com.mvault.dto.response.CategoriaResponse;
import com.mvault.exception.BusinessException;
import com.mvault.exception.ResourceNotFoundException;
import com.mvault.model.Categoria;
import com.mvault.repository.CategoriaRepository;
import com.mvault.specification.CategoriaSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;


    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    @Transactional(readOnly = true)
    public Page<CategoriaResponse> listar(String nome, Pageable pageable) {
        return categoriaRepository.findAll(CategoriaSpecification.comFiltro(nome), pageable)
                .map(CategoriaResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public CategoriaResponse buscarPorId(Long id) {
        Categoria categoria = buscarEntidadePorId(id);
        return CategoriaResponse.fromEntity(categoria);
    }

    @Transactional
    public CategoriaResponse criar(CategoriaRequest request) {
        if (categoriaRepository.existsByNomeIgnoreCase(request.nome())) {
            throw new BusinessException("Já existe uma categoria cadastrada com o nome: " + request.nome());
        }

        Categoria categoria = new Categoria(
                request.nome(),
                request.descricao(),
                true 
        );

        Categoria categoriaSalva = categoriaRepository.save(categoria);
        return CategoriaResponse.fromEntity(categoriaSalva);
    }

    @Transactional
    public CategoriaResponse atualizar(Long id, CategoriaRequest request) {
        Categoria categoria = buscarEntidadePorId(id);


        if (categoriaRepository.existsByNomeIgnoreCaseAndIdNot(request.nome(), id)) {
            throw new BusinessException("Já existe outra categoria cadastrada com o nome: " + request.nome());
        }

        categoria.setNome(request.nome());
        categoria.setDescricao(request.descricao());

        Categoria categoriaAtualizada = categoriaRepository.save(categoria);
        return CategoriaResponse.fromEntity(categoriaAtualizada);
    }

    @Transactional
    public void desativar(Long id) {
        Categoria categoria = buscarEntidadePorId(id);

        categoria.setAtivo(false);
        categoriaRepository.save(categoria);
    }


    private Categoria buscarEntidadePorId(Long id) {
        return categoriaRepository.findById(id)
                .filter(Categoria::getAtivo) 
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada com o ID: " + id));
    }
}
