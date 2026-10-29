package com.mvault.service;


import com.mvault.dto.request.MovimentacaoRequest;
import com.mvault.dto.response.MovimentacaoResponse;
import com.mvault.exception.BusinessException;
import com.mvault.exception.ResourceNotFoundException;
import com.mvault.model.Movimentacao;
import com.mvault.model.Produto;
import com.mvault.model.TipoMovimentacao;
import com.mvault.repository.MovimentacaoRepository;
import com.mvault.repository.ProdutosRepository;
import com.mvault.specification.MovimentacaoSpecification;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class MovimentacaoService {

    private final MovimentacaoRepository movimentacaoRepository;
    private final ProdutosRepository produtosRepository;

    public MovimentacaoService(MovimentacaoRepository movimentacaoRepository, ProdutosRepository produtosRepository) {
        this.movimentacaoRepository = movimentacaoRepository;
        this.produtosRepository = produtosRepository;
    }

    public Page<MovimentacaoResponse> listar(
            TipoMovimentacao tipo,
            Long produtoId,
            LocalDateTime dataInicio,
            LocalDateTime dataFim,
            Pageable pageable) {
        Specification<Movimentacao> spec = MovimentacaoSpecification.comFiltro(tipo, produtoId, dataInicio, dataFim);
        return movimentacaoRepository.findAll(spec, pageable).map(MovimentacaoResponse::fromEntity);
    }

    public MovimentacaoResponse buscarPorId(Long id) {
        Movimentacao mov = movimentacaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movimentação não encontrada com id: " + id));
        return MovimentacaoResponse.fromEntity(mov);
    }

    @Transactional
    @Operation(summary = "Registo de Movimentação com impacto no Estoque")
    public MovimentacaoResponse criar(MovimentacaoRequest request) {
        Produto produto = produtosRepository.findById(request.produtoId())
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado com id: " + request.produtoId()));

        if (!produto.getAtivo()) {
            throw new BusinessException("Não é possivel movimentar o estoque de um produto que está inativo!");
        }

        if (request.tipo() == TipoMovimentacao.ENTRADA) {
            produto.adicionarEstoque(request.quantidade());
        } else if (request.tipo() == TipoMovimentacao.SAIDA) {
            if
            (produto.getQuantidadeEstoque() < request.quantidade()) {
                throw new BusinessException(String.format(" \"Estoque insuficiente para o produto '%s'. Estoque atual: %d, tentativa de saída: %d", produto.getNome(), produto.getQuantidadeEstoque(), request.quantidade()));
            }
            produto.removerEstoque(request.quantidade());
        }

            produtosRepository.save(produto);

            Movimentacao movimentacao = new Movimentacao(request.tipo(),
                    request.quantidade(),
                    request.observacao(),
                    produto
            );

            return MovimentacaoResponse.fromEntity(movimentacaoRepository.save(movimentacao));


        }
    }
