package com.mvault.controller;


import com.mvault.dto.request.CategoriaRequest;
import com.mvault.dto.response.CategoriaResponse;
import com.mvault.service.CategoriaService;
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
@RequestMapping("/categorias")
@Tag(name = "Categorias" , description = "Endpoints de gerenciamento de categorias")


public class CategoriaController {

    private final CategoriaService categoriaService;


    public CategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }


    @GetMapping
    @Operation(summary = "Lista todas as categorias ativas com paginacao e filtro opcional por nome")
    public ResponseEntity<Page<CategoriaResponse>> listar(
            @RequestParam(required = false) String nome,
            @PageableDefault(page = 0, size = 10, sort = "nome", direction = Sort.Direction.ASC
            ) Pageable pageable) {
        Page<CategoriaResponse> pagina = categoriaService.listar(nome, pageable);
        return ResponseEntity.ok(pagina);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Busca uma categoria ativa por ID")
    public ResponseEntity<CategoriaResponse> buscarPorId(@PathVariable Long id) {
        CategoriaResponse response = categoriaService.buscarPorId(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @Operation(summary = "Cadastra uma nova categoria")
    public ResponseEntity<CategoriaResponse> criar(@RequestBody @Valid CategoriaRequest request) {
        CategoriaResponse response = categoriaService.criar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);

    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualiza uma categoria existente")
    public ResponseEntity<CategoriaResponse> atualizar(
            @PathVariable Long id,
            @RequestBody @Valid CategoriaRequest request) {
        CategoriaResponse response = categoriaService.atualizar(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Desativa uma categoria de maneira soft delete")
    public ResponseEntity<Void> desativar (@PathVariable Long id){
        categoriaService.desativar(id);
        return ResponseEntity.noContent().build();
    }
}
