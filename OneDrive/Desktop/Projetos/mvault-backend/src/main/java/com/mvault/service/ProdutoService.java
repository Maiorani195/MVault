package com.mvault.service;

import com.mvault.dto.request.ProdutoRequest;
import com.mvault.dto.response.ProdutoResponse;
import com.mvault.exception.BusinessException;
import com.mvault.exception.ResourceNotFoundException;
import com.mvault.model.Categoria;
import com.mvault.model.Fornecedor;
import com.mvault.model.Produto;
import com.mvault.repository.CategoriaRepository;
import com.mvault.repository.FornecedorRepository;
import com.mvault.repository.ProdutosRepository;
import com.mvault.specification.ProdutoSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
public class ProdutoService {

    private final ProdutosRepository produtoRepository;
    private final CategoriaRepository categoriaRepository;
    private final FornecedorRepository fornecedorRepository;

    public ProdutoService(ProdutosRepository produtoRepository,
                          CategoriaRepository categoriaRepository,
                          FornecedorRepository fornecedorRepository) {
        this.produtoRepository = produtoRepository;
        this.categoriaRepository = categoriaRepository;
        this.fornecedorRepository = fornecedorRepository;
    }


    public Page<ProdutoResponse> listar(String nome, Long categoriaId,
                                        Long fornecedorId, Boolean estoqueBaixo,
                                        Pageable pageable) {
        Specification<Produto> spec = ProdutoSpecification.comFiltro(
                nome, categoriaId, fornecedorId, estoqueBaixo);
        return produtoRepository.findAll(spec, pageable).map(ProdutoResponse::fromEntity);
    }


    public ProdutoResponse buscarPorId(Long id) {
        return ProdutoResponse.fromEntity(buscarEntidadePorId(id));
    }


    @Transactional
    public ProdutoResponse criar(ProdutoRequest request) {
        if (produtoRepository.existsByNomeIgnoreCase(request.nome())) {
            throw new BusinessException("Já existe um produto com o nome: " + request.nome());
        }

        Categoria categoria = buscarCategoriaPorId(request.categoriaId());
        Fornecedor fornecedor = buscarFornecedorPorId(request.fornecedorId());

        Produto produto = new Produto(
                request.nome(),
                request.descricao(),
                request.preco(),
                request.estoqueMinimo(),
                categoria,
                fornecedor
        );

        return ProdutoResponse.fromEntity(produtoRepository.save(produto));
    }


    @Transactional
    public ProdutoResponse atualizar(Long id, ProdutoRequest request) {
        Produto produto = buscarEntidadePorId(id);

        if (produtoRepository.existsByNomeIgnoreCaseAndIdNot(request.nome(), id)) {
            throw new BusinessException("Já existe um produto com o nome: " + request.nome());
        }

        Categoria categoria = buscarCategoriaPorId(request.categoriaId());
        Fornecedor fornecedor = buscarFornecedorPorId(request.fornecedorId());

        produto.setNome(request.nome());
        produto.setDescricao(request.descricao());
        produto.setPreco(request.preco());
        produto.setEstoqueminimo(request.estoqueMinimo());
        produto.setCategoria(categoria);
        produto.setFornecedor(fornecedor);
        produto.setAtualizadoEm(LocalDateTime.now());

        return ProdutoResponse.fromEntity(produtoRepository.save(produto));
    }


    @Transactional
    public void deletar(Long id) {
        Produto produto = buscarEntidadePorId(id);
        produto.setAtivo(false);
        produto.setAtualizadoEm(LocalDateTime.now());
        produtoRepository.save(produto);
    }


    public Produto buscarEntidadePorId(Long id) {
        return produtoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado com id: " + id));
    }

    private Categoria buscarCategoriaPorId(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada com id: " + id));
    }

    private Fornecedor buscarFornecedorPorId(Long id) {
        return fornecedorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fornecedor não encontrado com id: " + id));
    }
}