package com.mvault.model;


import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "produtos")
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;

    @Column(nullable = false, length = 150)
    private String nome;

    @Column(length = 500)
    private String descricao;

    @Column(nullable = false , precision = 10 , scale = 2)
    private BigDecimal preco;

    @Column(nullable = false)
    private Integer quantidadeEstoque = 0;

    @Column(nullable = false)
    private Integer estoqueMinimo = 0;

    @Column(nullable = false)
    private Boolean ativo = true;

    @Column(nullable = false )
    private LocalDateTime atualizadoEm;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id" , nullable = false)
    private Categoria categoria;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fornecedor_id" , nullable = false)
    private Fornecedor fornecedor;

    @Column(nullable = false, updatable = false)
    private LocalDateTime criadoEm;


    public Produto() {
    }

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public BigDecimal getPreco() {
        return preco;
    }

    public Integer getQuantidadeEstoque() {
        return quantidadeEstoque;
    }

    public Integer getestoqueMinimo() {
        return estoqueMinimo;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public LocalDateTime getAtualizadoEm() {
        return atualizadoEm;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public Fornecedor getFornecedor() {
        return fornecedor;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public void setPreco(BigDecimal preco) {
        this.preco = preco;
    }



    public void setEstoqueminimo(Integer estoqueminimo) {
        estoqueMinimo = estoqueminimo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }

    public void setAtualizadoEm(LocalDateTime atualizadoEm) {
        this.atualizadoEm = atualizadoEm;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }

    public void setFornecedor(Fornecedor fornecedor) {
        this.fornecedor = fornecedor;
    }
    public void adicionarEstoque(int quantidade) {
        this.quantidadeEstoque += quantidade;
        this.atualizadoEm = LocalDateTime.now();
    }

    public void removerEstoque(int quantidade) {
        this.quantidadeEstoque -= quantidade;
        this.atualizadoEm = LocalDateTime.now();
    }

    public boolean isEstoqueBaixo() {
        return this.quantidadeEstoque < this.estoqueMinimo;
    }

    public Produto(String nome, String descricao, BigDecimal preco, Integer estoqueMinimo,
                   Categoria categoria, Fornecedor fornecedor) {
        this.nome = nome;
        this.descricao = descricao;
        this.preco = preco;
        this.estoqueMinimo = estoqueMinimo;
        this.categoria = categoria;
        this.fornecedor = fornecedor;
        this.quantidadeEstoque = 0;
        this.ativo = true;
        this.criadoEm = LocalDateTime.now();
        this.atualizadoEm = LocalDateTime.now();
    }








    }

