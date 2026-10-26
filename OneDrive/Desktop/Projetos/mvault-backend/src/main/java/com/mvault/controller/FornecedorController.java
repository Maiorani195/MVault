package com.mvault.controller;


import com.mvault.dto.request.FornecedorRequest;
import com.mvault.dto.response.FornecedorResponse;
import com.mvault.service.FornecedorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.apache.coyote.Response;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/fornecedores")
@Tag( name= "Fornecedores ", description = "Endpoints de gerenciamento de fornecedores")
public class FornecedorController {


    private final FornecedorService fornecedorService;

    public FornecedorController(FornecedorService fornecedorService) {
        this.fornecedorService = fornecedorService;
    }


    @GetMapping
    @Operation(summary = "Lista de todos os fornecedores ativos com paginação e filtros opcionais por nome e CNPJ")
    public ResponseEntity<Page<FornecedorResponse>> listar(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) String cnpj,
            @PageableDefault(page = 0 , size = 10 , sort = "nome" , direction = Sort.Direction.ASC)Pageable pageable){
        Page<FornecedorResponse> pagina = fornecedorService.listar(nome , cnpj, pageable);
        return ResponseEntity.ok(pagina);
    }







    @GetMapping("/{id}")
    @Operation(summary = "Busca um fornecedor ativo por ID")
    public ResponseEntity<FornecedorResponse> buscarPorId(@PathVariable Long id){
        FornecedorResponse response = fornecedorService.buscarPorId(id);
        return  ResponseEntity.ok(response);



    }

@PostMapping
    @Operation(summary = "Cadastra um novo fornecedor com validação de CNPJ")
    public ResponseEntity<FornecedorResponse> criar(@RequestBody @Valid FornecedorRequest request) {
    FornecedorResponse response = fornecedorService.criar(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);


}

@PutMapping
    @Operation(summary = "Atualiza os dados de um fornecedor existente")
    public ResponseEntity<FornecedorResponse> atualiza(@PathVariable Long id, @RequestBody @Valid FornecedorRequest request) {
    FornecedorResponse response = fornecedorService.atualizar(id, request);
    return ResponseEntity.ok(response);
}

@DeleteMapping
    @Operation(summary = "Desativa um fornecedor na maneira SOFT DELETE")
    public ResponseEntity<Void> desativar(@PathVariable Long id){
        fornecedorService.desativar(id);
        return  ResponseEntity.noContent().build();
}



}













