package com.mvault.controller;

import com.mvault.dto.request.MovimentacaoRequest;
import com.mvault.dto.response.MovimentacaoResponse;
import com.mvault.model.TipoMovimentacao;
import com.mvault.service.MovimentacaoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/movimentacoes")
@Tag(name = "Movimentações", description = "Histórico e controle de entradas e saídas de estoque")
public class MovimentacaoController {

    private final MovimentacaoService movimentacaoService;

    public MovimentacaoController(MovimentacaoService movimentacaoService) {
        this.movimentacaoService = movimentacaoService;
    }

    @GetMapping
    @Operation(summary = "Lista movimentações com paginação e filtros  como tipo, produto, datas")
    public ResponseEntity<Page<MovimentacaoResponse>> listar(
            @RequestParam(required = false) TipoMovimentacao tipo,

            @RequestParam(required = false) Long produtoId,

            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataFim,
            @PageableDefault(page = 0, size = 10, sort = "criadoEm", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(
                movimentacaoService.listar(tipo, produtoId, dataInicio, dataFim, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Busca uma movimentação pelo ID")
    public ResponseEntity<MovimentacaoResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(movimentacaoService.buscarPorId(id));
    }

    @PostMapping
    @Operation(summary = "Registra uma nova movimentação (ENTRADA aumenta estoque, SAIDA valida e reduz)")
    public ResponseEntity<MovimentacaoResponse> criar(@RequestBody @Valid MovimentacaoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(movimentacaoService.criar(request));
    }
}