package com.mvault.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "movimentacoes")
public class Movimentacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TipoMovimentacao tipo;

    @Column(nullable = false)
    private Integer quantidade;

    @Column(length = 255)
    private String observacao;

    @Column(nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produto_id", nullable = false)
    private Produto produto;

    public Movimentacao() {
    }

    public Movimentacao(TipoMovimentacao tipo, Integer quantidade, String observacao, Produto produto) {
        this.tipo = tipo;
        this.quantidade = quantidade;
        this.observacao = observacao;
        this.produto = produto;
        this.criadoEm = LocalDateTime.now();
    }

    // Getters
    public Long getId() {
        return id;
    }

    public TipoMovimentacao getTipo() {
        return tipo;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public String getObservacao() {
        return observacao;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public Produto getProduto() {
        return produto;
    }

    // Setters (só o necessário)
    public void setTipo(TipoMovimentacao tipo) {
        this.tipo = tipo;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }

    public void setProduto(Produto produto) {
        this.produto = produto;
    }
}