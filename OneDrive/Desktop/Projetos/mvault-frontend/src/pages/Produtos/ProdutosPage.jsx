import React, { useState, useEffect, useCallback } from 'react';
import { produtoService } from '../../api/produtoService';
import { categoriaService } from '../../api/categoriaService';
import ProdutoModal from '../../components/modals/ProdutoModal';
import MovimentacaoModal from '../../components/modals/MovimentacaoModal';
import Button from '../../components/ui/Button';

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalElementos, setTotalElementos] = useState(0);

  // Filtros Specification
  const [buscaNome, setBuscaNome] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [apenasEstoqueBaixo, setApenasEstoqueBaixo] = useState(false);
  const [pagina, setPagina] = useState(0);

  // Modais
  const [isProdutoModalOpen, setIsProdutoModalOpen] = useState(false);
  const [produtoEmEdicao, setProdutoEmEdicao] = useState(null);

  const [isMovModalOpen, setIsMovModalOpen] = useState(false);
  const [produtoMovId, setProdutoMovId] = useState(null);

  const carregarCategorias = async () => {
    try {
      const res = await categoriaService.listar({ size: 100 });
      const lista = res.content || res;
      setCategorias(Array.isArray(lista) ? lista : []);
    } catch (err) {
      console.error('Erro ao listar categorias:', err);
    }
  };

  const carregarProdutos = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagina,
        size: 10,
        sort: 'nome,asc',
      };
      if (buscaNome.trim()) params.nome = buscaNome.trim();
      if (categoriaId) params.categoriaId = categoriaId;
      if (apenasEstoqueBaixo) params.estoqueBaixo = true;

      const data = await produtoService.listar(params);
      if (data.content) {
        setProdutos(data.content);
        setTotalElementos(data.totalElements || data.content.length);
      } else if (Array.isArray(data)) {
        setProdutos(data);
        setTotalElementos(data.length);
      }
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
    } finally {
      setLoading(false);
    }
  }, [buscaNome, categoriaId, apenasEstoqueBaixo, pagina]);

  useEffect(() => {
    carregarCategorias();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      carregarProdutos();
    }, 250);
    return () => clearTimeout(timer);
  }, [carregarProdutos]);

  const handleOpenNovo = () => {
    setProdutoEmEdicao(null);
    setIsProdutoModalOpen(true);
  };

  const handleOpenEditar = (p) => {
    setProdutoEmEdicao(p);
    setIsProdutoModalOpen(true);
  };

  const handleOpenMovimentacao = (prodId) => {
    setProdutoMovId(prodId);
    setIsMovModalOpen(true);
  };

  return (
    <div className="space-y-10">
      {/* Header com Frase de Impacto e Botão Estável */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#1f1d17]">
        <div className="max-w-2xl">
          <span className="text-xs uppercase tracking-wider text-[#e58b20] font-semibold block mb-2">
            Custódia & Controle Operacional
          </span>
          <h1 className="font-display text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            Seu estoque protegido.<br />
            <span className="text-[#8c8578]">Controle absoluto em tempo real.</span>
          </h1>
          <p className="text-sm text-[#8c8578] mt-3 font-normal leading-relaxed">
            Monitoramento preventivo, trilha de auditoria e níveis mínimos com inteligência operacional.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start lg:self-auto shrink-0">
          <Button variant="primary" onClick={handleOpenNovo}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Novo Produto
          </Button>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-5 relative">
          <input
            type="text"
            value={buscaNome}
            onChange={(e) => {
              setBuscaNome(e.target.value);
              setPagina(0);
            }}
            placeholder="Buscar por nome ou especificação..."
            className="w-full bg-[#141310] border border-[#23201a] focus:border-[#e58b20] rounded px-4 py-2.5 text-xs text-white placeholder-[#5c564c] outline-none transition"
          />
          <svg className="w-3.5 h-3.5 text-[#5c564c] absolute right-3.5 top-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>

        <div className="md:col-span-4">
          <select
            value={categoriaId}
            onChange={(e) => {
              setCategoriaId(e.target.value);
              setPagina(0);
            }}
            className="w-full bg-[#141310] border border-[#23201a] focus:border-[#e58b20] rounded px-3 py-2.5 text-xs text-[#8c8578] outline-none transition cursor-pointer"
          >
            <option value="">Todas as Categorias</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-3 flex items-center justify-between bg-[#141310] border border-[#23201a] rounded px-4 py-2">
          <label htmlFor="filtro-baixo" className="text-xs text-[#8c8578] cursor-pointer font-medium select-none">
            Apenas Estoque Crítico
          </label>
          <input
            type="checkbox"
            id="filtro-baixo"
            checked={apenasEstoqueBaixo}
            onChange={(e) => {
              setApenasEstoqueBaixo(e.target.checked);
              setPagina(0);
            }}
            className="w-4 h-4 accent-[#e58b20] bg-[#1a1814] border-[#23201a] rounded cursor-pointer"
          />
        </div>
      </div>

      {/* Tabela Formatada com Letras Maiúsculas e Minúsculas */}
      <div className="border border-[#1f1d17] bg-[#12110e]/95 backdrop-blur-md rounded overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#161511] border-b border-[#1f1d17] text-[#8c8578] text-[11px] font-semibold">
              <tr>
                <th className="py-3.5 px-6 font-medium">Item / Especificação</th>
                <th className="py-3.5 px-6 font-medium">Categoria</th>
                <th className="py-3.5 px-6 font-medium">Fornecedor</th>
                <th className="py-3.5 px-6 font-medium">Preço Unitário</th>
                <th className="py-3.5 px-6 font-medium">Saldo / Mínimo</th>
                <th className="py-3.5 px-6 font-medium">Situação</th>
                <th className="py-3.5 px-6 font-medium text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c1a14] text-[#8c8578]">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-xs text-[#5c564c]">
                    Carregando inventário...
                  </td>
                </tr>
              ) : produtos.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-xs text-[#5c564c]">
                    Nenhum produto cadastrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                produtos.map((p) => {
                  const isCritico = p.estoqueBaixo || p.quantidadeEstoque <= p.estoqueMinimo;
                  return (
                    <tr key={p.id} className="hover:bg-[#181612] transition-colors group">
                      <td className="py-4 px-6">
                        <div className="font-bold text-white text-sm group-hover:text-amber-100 transition-colors">
                          {p.nome}
                        </div>
                        <div className="text-[11px] text-[#6b6456] mt-0.5 truncate max-w-xs">
                          {p.descricao || 'Sem descrição cadastrada'}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-[#8c8578]">
                        {p.categoriaNome || p.categoria?.nome || '—'}
                      </td>
                      <td className="py-4 px-6 text-[#8c8578]">
                        {p.fornecedorNome || p.fornecedor?.nome || '—'}
                      </td>
                      <td className="py-4 px-6 tabular-data text-white font-medium">
                        R$ {Number(p.preco || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-6 tabular-data">
                        <span className={`font-bold ${isCritico ? 'text-[#e58b20]' : 'text-white'}`}>
                          {p.quantidadeEstoque} un.
                        </span>
                        <span className="text-[#5c564c] ml-1">/ mín. {p.estoqueMinimo}</span>
                      </td>
                      <td className="py-4 px-6">
                        {isCritico ? (
                          <span className="inline-flex items-center text-[11px] font-medium text-[#e58b20] bg-[#e58b20]/10 border border-[#e58b20]/30 px-2.5 py-0.5 rounded">
                            Reposição
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded">
                            Regular
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right space-x-3">
                        <button
                          onClick={() => handleOpenMovimentacao(p.id)}
                          className="text-xs font-semibold text-white hover:text-[#e58b20] transition cursor-pointer"
                        >
                          + Movimentar
                        </button>
                        <button
                          onClick={() => handleOpenEditar(p)}
                          className="text-xs text-[#5c564c] hover:text-white transition cursor-pointer"
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Rodapé de Paginação */}
        <div className="py-3 px-6 bg-[#161511] border-t border-[#1f1d17] flex items-center justify-between text-xs text-[#8c8578]">
          <span>
            Exibindo <strong>{produtos.length}</strong> de <strong>{totalElementos}</strong> itens
          </span>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setPagina((p) => Math.max(0, p - 1))}
              disabled={pagina === 0 || loading}
              className="hover:text-white transition disabled:opacity-30 cursor-pointer"
            >
              Anterior
            </button>
            <span className="text-white font-bold">{pagina + 1}</span>
            <button
              onClick={() => setPagina((p) => p + 1)}
              disabled={(pagina + 1) * 10 >= totalElementos || loading}
              className="hover:text-white transition disabled:opacity-30 cursor-pointer"
            >
              Próximo
            </button>
          </div>
        </div>
      </div>

      {/* Modais */}
      <ProdutoModal
        isOpen={isProdutoModalOpen}
        onClose={() => setIsProdutoModalOpen(false)}
        onSuccess={carregarProdutos}
        produtoEdicao={produtoEmEdicao}
      />

      <MovimentacaoModal
        isOpen={isMovModalOpen}
        onClose={() => setIsMovModalOpen(false)}
        onSuccess={carregarProdutos}
        preSelectedProdutoId={produtoMovId}
      />
    </div>
  );
}
