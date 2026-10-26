package com.mvault.controller;

import com.mvault.dto.request.ProdutoRequest;
import com.mvault.dto.response.ProdutoResponse;
import com.mvault.service.ProdutoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/produtos")
@Tag(name = "Produtos", description = "Gerenciamento de produtos do estoque")
public class ProdutoController {

    private final ProdutoService produtoService;

    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    @GetMapping
    @Operation(summary = "Lista produtos ativos com paginação e filtros opcionais")
    public ResponseEntity<Page<ProdutoResponse>> listar(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(required = false) Long fornecedorId,
            @RequestParam(required = false) Boolean estoqueBaixo,
            @PageableDefault(page = 0, size = 10, sort = "nome",
                    direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(
                produtoService.listar(nome, categoriaId, fornecedorId, estoqueBaixo, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Busca um produto pelo ID")
    public ResponseEntity<ProdutoResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(produtoService.buscarPorId(id));
    }

    @PostMapping
    @Operation(summary = "Cadastra um novo produto")
    public ResponseEntity<ProdutoResponse> criar(@RequestBody @Valid ProdutoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(produtoService.criar(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualiza um produto — não altera o estoque")
    public ResponseEntity<ProdutoResponse> atualizar(@PathVariable Long id,
                                                     @RequestBody @Valid ProdutoRequest request) {
        return ResponseEntity.ok(produtoService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Desativa um produto soft delete")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        produtoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}