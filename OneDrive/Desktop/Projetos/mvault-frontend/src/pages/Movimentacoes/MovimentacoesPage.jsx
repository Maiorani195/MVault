import React, { useState, useEffect, useCallback } from 'react';
import { movimentacaoService } from '../../api/movimentacaoService';
import MovimentacaoModal from '../../components/modals/MovimentacaoModal';

export default function MovimentacoesPage() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [pagina, setPagina] = useState(0);
  const [totalElementos, setTotalElementos] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const carregarMovimentacoes = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagina,
        size: 15,
        sort: 'criadoEm,desc',
      };
      if (tipoFiltro) params.tipo = tipoFiltro;

      const data = await movimentacaoService.listar(params);
      if (data.content) {
        setMovimentacoes(data.content);
        setTotalElementos(data.totalElements || data.content.length);
      } else if (Array.isArray(data)) {
        setMovimentacoes(data);
        setTotalElementos(data.length);
      }
    } catch (err) {
      console.error('Erro ao buscar movimentações:', err);
    } finally {
      setLoading(false);
    }
  }, [tipoFiltro, pagina]);

  useEffect(() => {
    carregarMovimentacoes();
  }, [carregarMovimentacoes]);

  const formatarData = (dataIso) => {
    if (!dataIso) return '—';
    try {
      const d = new Date(dataIso);
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dataIso;
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 border-b border-[#1f1d17]">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#d97706] font-semibold block mb-2">
            Auditoria & Histórico
          </span>
          <h1 className="font-display text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            Movimentações de Estoque
          </h1>
          <p className="text-sm text-[#8c8578] mt-3 max-w-xl leading-relaxed">
            Registro cronológico e imutável de entradas e saídas de produtos.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded bg-white hover:bg-neutral-200 text-[#0c0b09] text-xs font-semibold transition cursor-pointer self-start sm:self-auto shrink-0 shadow-sm"
        >
          + Nova Movimentação
        </button>
      </div>

      {/* Filtro Simples */}
      <div className="flex items-center space-x-3">
        <select
          value={tipoFiltro}
          onChange={(e) => {
            setTipoFiltro(e.target.value);
            setPagina(0);
          }}
          className="bg-[#131210] border border-[#24211a] focus:border-[#d97706] rounded px-3 py-1.5 text-xs text-[#8c8577] outline-none cursor-pointer"
        >
          <option value="">Todas as Operações</option>
          <option value="ENTRADA">Apenas Entradas</option>
          <option value="SAIDA">Apenas Saídas</option>
        </select>
      </div>

      {/* Tabela Clean */}
      <div className="border border-[#1f1d17] bg-[#12110e]/95 rounded-lg overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#161511] border-b border-[#1f1d17] text-[#8c8578] text-[11px] font-semibold">
            <tr>
              <th className="py-3 px-6">Data e Hora</th>
              <th className="py-3 px-6">Tipo</th>
              <th className="py-3 px-6">Produto</th>
              <th className="py-3 px-6">Quantidade</th>
              <th className="py-3 px-6">Motivo / Documento</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1c1a14] text-[#8c8578]">
            {loading ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-xs text-[#5c564c]">
                  Carregando histórico...
                </td>
              </tr>
            ) : movimentacoes.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-xs text-[#5c564c]">
                  Nenhuma movimentação registrada.
                </td>
              </tr>
            ) : (
              movimentacoes.map((m) => {
                const isEntrada = m.tipo === 'ENTRADA';
                return (
                  <tr key={m.id} className="hover:bg-[#181612] transition-colors">
                    <td className="py-3.5 px-6 text-[#8c8578] tabular-data">
                      {formatarData(m.criadoEm || m.dataHora)}
                    </td>
                    <td className="py-3.5 px-6">
                      <span
                        className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded border ${
                          isEntrada
                            ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                            : 'text-[#d97706] bg-[#d97706]/10 border-[#d97706]/20'
                        }`}
                      >
                        {isEntrada ? 'Entrada' : 'Saída'}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 font-semibold text-white">
                      {m.produtoNome || m.produto?.nome || '—'}
                    </td>
                    <td
                      className={`py-3.5 px-6 font-bold tabular-data ${
                        isEntrada ? 'text-emerald-400' : 'text-white'
                      }`}
                    >
                      {isEntrada ? `+${m.quantidade}` : `-${m.quantidade}`} un.
                    </td>
                    <td className="py-3.5 px-6 text-[#8c8578]">
                      {m.observacao || '—'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Paginação */}
        <div className="py-2.5 px-6 bg-[#161511] border-t border-[#1f1d17] flex items-center justify-between text-xs text-[#8c8578]">
          <span>Mostrando {movimentacoes.length} de {totalElementos} registros</span>
          <div className="flex items-center space-x-3">
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
              disabled={(pagina + 1) * 15 >= totalElementos || loading}
              className="hover:text-white transition disabled:opacity-30 cursor-pointer"
            >
              Próximo
            </button>
          </div>
        </div>
      </div>

      <MovimentacaoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={carregarMovimentacoes}
      />
    </div>
  );
}
