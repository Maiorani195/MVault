import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { produtoService } from '../../api/produtoService';
import { movimentacaoService } from '../../api/movimentacaoService';
import { categoriaService } from '../../api/categoriaService';
import { fornecedorService } from '../../api/fornecedorService';
import MovimentacaoModal from '../../components/modals/MovimentacaoModal';

export default function DashboardPage() {
  const [totalProdutos, setTotalProdutos] = useState(0);
  const [totalCategorias, setTotalCategorias] = useState(0);
  const [totalFornecedores, setTotalFornecedores] = useState(0);
  const [itensCriticos, setItensCriticos] = useState([]);
  const [ultimasMovs, setUltimasMovs] = useState([]);
  const [totalMovimentacoes, setTotalMovimentacoes] = useState(0);
  const [metricasFluxo, setMetricasFluxo] = useState({
    entradasQtd: 0,
    saidasQtd: 0,
    historicoRecente: [],
  });
  const [loading, setLoading] = useState(true);

  const [isMovModalOpen, setIsMovModalOpen] = useState(false);
  const [selectedProdutoId, setSelectedProdutoId] = useState(null);

  const carregarDashboard = async () => {
    setLoading(true);
    try {
      const [resProd, resCrit, resMov, resCat, resForn, resMovAll] = await Promise.all([
        produtoService.listar({ size: 1 }),
        produtoService.listar({ estoqueBaixo: true, size: 6 }),
        movimentacaoService.listar({ size: 6, sort: 'criadoEm,desc' }),
        categoriaService.listar({ size: 1 }),
        fornecedorService.listar({ size: 1 }),
        movimentacaoService.listar({ size: 20, sort: 'criadoEm,desc' }),
      ]);

      setTotalProdutos(resProd.totalElements || (resProd.content ? resProd.content.length : 0));
      setItensCriticos(resCrit.content || (Array.isArray(resCrit) ? resCrit : []));
      setUltimasMovs(resMov.content || (Array.isArray(resMov) ? resMov : []));
      setTotalMovimentacoes(resMov.totalElements || (resMov.content ? resMov.content.length : 0));
      setTotalCategorias(resCat.totalElements || (resCat.content ? resCat.content.length : 0));
      setTotalFornecedores(resForn.totalElements || (resForn.content ? resForn.content.length : 0));

      // Processamento do Gráfico de Fluxo Operacional Dinâmico
      const listaTodas = resMovAll.content || (Array.isArray(resMovAll) ? resMovAll : []);
      let sumEntradas = 0;
      let sumSaidas = 0;

      listaTodas.forEach((m) => {
        const q = Number(m.quantidade) || 0;
        if (m.tipo === 'ENTRADA') sumEntradas += q;
        else if (m.tipo === 'SAIDA') sumSaidas += q;
      });

      // Últimas 10 movimentações em ordem cronológica (antigas -> recentes) para as barras
      const ultimasDez = [...listaTodas].slice(0, 10).reverse();
      const maxQtd = Math.max(...ultimasDez.map((m) => Number(m.quantidade) || 0), 10);
      const barras = ultimasDez.map((m) => ({
        ...m,
        alturaPercentual: Math.min(100, Math.max(18, Math.round(((Number(m.quantidade) || 0) / maxQtd) * 100))),
      }));

      setMetricasFluxo({
        entradasQtd: sumEntradas,
        saidasQtd: sumSaidas,
        historicoRecente: barras,
      });
    } catch (err) {
      console.error('Erro ao carregar dados do dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDashboard();
  }, []);

  const handleRepor = (prodId) => {
    setSelectedProdutoId(prodId);
    setIsMovModalOpen(true);
  };

  const formatarData = (dataIso) => {
    if (!dataIso) return '';
    try {
      const d = new Date(dataIso);
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dataIso;
    }
  };

  const formatarHoraCurta = (dataIso) => {
    if (!dataIso) return '';
    try {
      const d = new Date(dataIso);
      return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  // Taxa de saúde do estoque
  const produtosSeguros = Math.max(0, totalProdutos - itensCriticos.length);
  const percentualSeguro = totalProdutos > 0 ? Math.round((produtosSeguros / totalProdutos) * 100) : 100;

  // Proporções para o gráfico de fluxo
  const totalFluxoVolume = metricasFluxo.entradasQtd + metricasFluxo.saidasQtd;
  const percEntradas = totalFluxoVolume > 0 ? Math.round((metricasFluxo.entradasQtd / totalFluxoVolume) * 100) : 50;
  const percSaidas = totalFluxoVolume > 0 ? 100 - percEntradas : 50;

  return (
    <div className="space-y-8 max-w-6xl">
      
      {/* ======================================================== */}
      {/* 1. CABEÇALHO EXECUTIVO                                   */}
      {/* ======================================================== */}
      <div className="pb-6 border-b border-[#24211a]">
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Visão Geral do Sistema
        </h1>
        <p className="text-base sm:text-lg text-[#dcd7cb] font-medium mt-2.5 max-w-3xl leading-relaxed">
          Métricas consolidadas de inventário, alertas de segurança e trilha operacional em tempo real.
        </p>
      </div>

      {/* ======================================================== */}
      {/* 2. OS 5 CARDS DE INDICADORES (INCLUINDO CATEGORIA SAÚDE) */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        
        {/* Card 1: Categoria Saúde do Estoque */}
        <div className="border border-[#24211a] bg-[#131210]/95 rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[#8c8577]">Saúde Operacional</span>
              <span
                className={`text-[11px] font-semibold ${
                  percentualSeguro >= 80 ? 'text-emerald-400' : percentualSeguro >= 50 ? 'text-[#d97706]' : 'text-red-400'
                }`}
              >
                {percentualSeguro >= 80 ? 'Estável' : percentualSeguro >= 50 ? 'Atenção' : 'Crítico'}
              </span>
            </div>
            
            <p className="font-display text-3xl font-extrabold text-white mt-2 tabular-data">
              {loading ? '—' : `${percentualSeguro}%`}
            </p>

            <div className="w-full bg-[#1e1c17] h-1.5 rounded-full overflow-hidden mt-3">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  percentualSeguro >= 80 ? 'bg-emerald-400' : percentualSeguro >= 50 ? 'bg-[#d97706]' : 'bg-red-500'
                }`}
                style={{ width: `${percentualSeguro}%` }}
              />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-[#5c564c] border-t border-[#1e1c17] pt-2">
            <span>{produtosSeguros}/{totalProdutos} estáveis</span>
            <span className="text-[#8c8577]">Índice global</span>
          </div>
        </div>

        {/* Card 2: Total de Produtos */}
        <div className="border border-[#24211a] bg-[#131210]/95 rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[#8c8577]">
              <span className="font-medium">Total em Estoque</span>
              <span className="text-[#5c564c]">Catálogo</span>
            </div>
            <p className="font-display text-3xl font-extrabold text-white mt-2 tabular-data">
              {loading ? '—' : totalProdutos}
            </p>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-[#5c564c] border-t border-[#1e1c17] pt-2">
            <span>Itens cadastrados</span>
            <Link to="/produtos" className="text-[#d97706] hover:underline">Ver itens →</Link>
          </div>
        </div>

        {/* Card 3: Alerta Crítico */}
        <div className="border border-[#24211a] bg-[#131210]/95 rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#d97706]">Reposição</span>
              <span className="text-xs text-[#d97706]/70">Crítico</span>
            </div>
            <p className="font-display text-3xl font-extrabold text-[#d97706] mt-2 tabular-data">
              {loading ? '—' : itensCriticos.length}
            </p>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-[#5c564c] border-t border-[#1e1c17] pt-2">
            <span>Abaixo do mínimo</span>
            <Link to="/produtos" className="text-[#d97706] hover:underline">Repor agora →</Link>
          </div>
        </div>

        {/* Card 4: Movimentações Registradas */}
        <div className="border border-[#24211a] bg-[#131210]/95 rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[#8c8577]">
              <span className="font-medium">Trilha Operacional</span>
              <span className="text-[#5c564c]">Transações</span>
            </div>
            <p className="font-display text-3xl font-extrabold text-white mt-2 tabular-data">
              {loading ? '—' : totalMovimentacoes}
            </p>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-[#5c564c] border-t border-[#1e1c17] pt-2">
            <span>Auditoria contínua</span>
            <Link to="/movimentacoes" className="text-[#d97706] hover:underline">Ver histórico →</Link>
          </div>
        </div>

        {/* Card 5: Infraestrutura & Parceiros */}
        <div className="border border-[#24211a] bg-[#131210]/95 rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[#8c8577]">
              <span className="font-medium">Suprimentos</span>
              <span className="text-[#5c564c]">Rede</span>
            </div>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="font-display text-3xl font-extrabold text-white tabular-data">
                {loading ? '—' : totalFornecedores}
              </span>
              <span className="text-xs text-[#8c8577]">fornecedores</span>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-[#5c564c] border-t border-[#1e1c17] pt-2">
            <span>{totalCategorias} categorias</span>
            <Link to="/fornecedores" className="text-[#d97706] hover:underline">Consultar →</Link>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 3. GRÁFICO DINÂMICO DE FLUXO & BALANÇO OPERACIONAL       */}
      {/* Reativo: anima e recalcula a cada nova movimentação      */}
      {/* ======================================================== */}
      <div className="border border-[#24211a] bg-[#131210]/95 rounded-lg p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#24211a]">
          <div>
            <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              Fluxo Operacional & Atividade Recente
            </h2>
            <p className="text-xs sm:text-sm text-[#b8b09d] mt-1 font-medium">
              Dinâmica de entradas e saídas recalculada em tempo real com cada movimentação.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-[#dcd7cb] font-semibold tabular-data">
                +{metricasFluxo.entradasQtd} un.
              </span>
              <span className="text-[#6e685c]">Entradas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#d97706]" />
              <span className="text-[#dcd7cb] font-semibold tabular-data">
                -{metricasFluxo.saidasQtd} un.
              </span>
              <span className="text-[#6e685c]">Saídas</span>
            </div>
          </div>
        </div>

        {/* Barra Proporcional de Balanço Global */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-[#8c8577]">
            <span>Proporção de Lotes Recentes</span>
            <span className="tabular-data font-medium">
              {totalFluxoVolume > 0 ? `${percEntradas}% Entradas / ${percSaidas}% Saídas` : 'Sem movimentações'}
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-[#1b1915] overflow-hidden flex p-0.5 border border-[#24211a]">
            {totalFluxoVolume > 0 ? (
              <>
                <div
                  className="bg-emerald-500 h-full rounded-l-full transition-all duration-700 ease-out"
                  style={{ width: `${percEntradas}%` }}
                  title={`Entradas: ${metricasFluxo.entradasQtd} un.`}
                />
                <div
                  className="bg-[#d97706] h-full rounded-r-full transition-all duration-700 ease-out"
                  style={{ width: `${percSaidas}%` }}
                  title={`Saídas: ${metricasFluxo.saidasQtd} un.`}
                />
              </>
            ) : (
              <div className="w-full h-full bg-[#24211a] rounded-full" />
            )}
          </div>
        </div>

        {/* Gráfico de Barras dos Lotes Recentes */}
        <div>
          <div className="text-xs text-[#6e685c] mb-3">Histórico recente de transações (volume por lote)</div>
          
          {loading ? (
            <div className="h-40 flex items-center justify-center text-xs text-[#5c564c]">
              Carregando dados do gráfico...
            </div>
          ) : metricasFluxo.historicoRecente.length === 0 ? (
            <div className="h-40 flex flex-col items-center justify-center border border-dashed border-[#24211a] rounded-lg p-6 text-center space-y-1">
              <p className="text-sm font-medium text-[#dcd7cb]">Aguardando movimentações</p>
              <p className="text-xs text-[#6e685c] max-w-md">
                Cadastre a primeira entrada ou saída para que as barras reajam e mostrem a atividade dinâmica em tempo real.
              </p>
            </div>
          ) : (
            <div className="h-44 flex items-end gap-2 sm:gap-4 pt-6 pb-2 px-2 border-b border-[#24211a]">
              {metricasFluxo.historicoRecente.map((m) => {
                const isEntrada = m.tipo === 'ENTRADA';
                return (
                  <div
                    key={m.id}
                    className="flex-1 flex flex-col items-center justify-end h-full group relative"
                  >
                    {/* Tooltip Hover */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-[#1c1a16] border border-[#2d2921] px-2 py-1 rounded text-[10px] text-white whitespace-nowrap z-20 shadow-lg">
                      <span className="font-semibold block">{m.produtoNome}</span>
                      <span className={isEntrada ? 'text-emerald-400' : 'text-[#d97706]'}>
                        {isEntrada ? `+${m.quantidade}` : `-${m.quantidade}`} un. ({m.tipo})
                      </span>
                    </div>

                    {/* Valor numérico no topo da barra */}
                    <span className="text-[10px] tabular-data text-[#8c8577] mb-1 group-hover:text-white transition">
                      {m.quantidade}
                    </span>

                    {/* Barra Animada com transição de altura */}
                    <div className="w-full max-w-[42px] bg-[#1a1814] rounded-t-md overflow-hidden flex items-end h-full">
                      <div
                        className={`w-full rounded-t-md transition-all duration-700 ease-out ${
                          isEntrada
                            ? 'bg-emerald-500 group-hover:bg-emerald-400'
                            : 'bg-[#d97706] group-hover:bg-[#f59e0b]'
                        }`}
                        style={{ height: `${m.alturaPercentual}%` }}
                      />
                    </div>

                    {/* Legenda de Hora / Produto */}
                    <span className="text-[10px] text-[#5c564c] mt-2 truncate w-full text-center">
                      {formatarHoraCurta(m.criadoEm || m.dataHora) || '—'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. DOIS PAINÉIS LADO A LADO (PRIORIDADES & AUDITORIA)     */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Painel 1 (7 colunas): Fila de Reposição Urgente */}
        <div className="lg:col-span-7 border border-[#24211a] bg-[#131210]/95 rounded-lg p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#24211a]">
              <div>
                <h2 className="text-base font-bold text-white uppercase tracking-wider">
                  Fila de Reposição Crítica
                </h2>
                <p className="text-xs sm:text-sm text-[#b8b09d] mt-1 font-medium">
                  Produtos com saldo igual ou inferior ao estoque de segurança
                </p>
              </div>
              <span className="text-xs text-[#d97706] font-semibold">
                {itensCriticos.length} Requer(em) Ação
              </span>
            </div>

            <div className="space-y-3">
              {loading ? (
                <p className="text-xs text-[#5c564c] py-10 text-center">Carregando catálogo...</p>
              ) : itensCriticos.length === 0 ? (
                <div className="py-10 text-center space-y-1">
                  <p className="text-sm font-medium text-emerald-400">Nenhum produto em nível crítico</p>
                  <p className="text-xs text-[#5c564c]">O estoque está 100% equilibrado no momento.</p>
                </div>
              ) : (
                itensCriticos.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-3.5 rounded bg-[#181613] border border-[#24211a] hover:border-[#383328] transition"
                  >
                    <div>
                      <h3 className="text-xs font-bold text-white">{p.nome}</h3>
                      <p className="text-[11px] text-[#8c8577] mt-0.5">
                        Categoria: {p.categoriaNome || p.categoria?.nome || '—'}
                      </p>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right text-xs tabular-data">
                        <span className="text-[#d97706] font-bold block">{p.quantidadeEstoque} un.</span>
                        <span className="text-[10px] text-[#5c564c]">Mínimo: {p.estoqueMinimo} un.</span>
                      </div>

                      <button
                        onClick={() => handleRepor(p.id)}
                        className="px-3 py-1 rounded bg-[#242017] hover:bg-[#d97706]/20 text-[#d97706] border border-[#d97706]/40 text-xs font-medium transition cursor-pointer"
                      >
                        Repor
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Painel 2 (5 colunas): Últimas Transações Registradas */}
        <div className="lg:col-span-5 border border-[#24211a] bg-[#131210]/95 rounded-lg p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#24211a]">
              <div>
                <h2 className="text-base font-bold text-white uppercase tracking-wider">
                  Últimas Transações
                </h2>
                <p className="text-xs sm:text-sm text-[#b8b09d] mt-1 font-medium">
                  Trilha recente com impacto direto no estoque
                </p>
              </div>
              <Link to="/movimentacoes" className="text-xs text-[#d97706] hover:underline font-medium">
                Histórico →
              </Link>
            </div>

            <div className="space-y-3">
              {loading ? (
                <p className="text-xs text-[#5c564c] py-8 text-center">Carregando...</p>
              ) : ultimasMovs.length === 0 ? (
                <p className="text-xs text-[#5c564c] py-8 text-center">Nenhuma movimentação registrada.</p>
              ) : (
                ultimasMovs.map((m) => {
                  const isEntrada = m.tipo === 'ENTRADA';
                  return (
                    <div
                      key={m.id}
                      className="p-3 rounded bg-[#181613] border border-[#24211a] flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-semibold border ${
                              isEntrada
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-[#d97706]/10 text-[#d97706] border-[#d97706]/20'
                            }`}
                          >
                            {isEntrada ? 'Entrada' : 'Saída'}
                          </span>
                          <span className="font-semibold text-white truncate max-w-[150px]">
                            {m.produtoNome || 'Produto'}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#5c564c] block">
                          {formatarData(m.criadoEm || m.dataHora)}
                        </span>
                      </div>

                      <span
                        className={`font-bold tabular-data ${
                          isEntrada ? 'text-emerald-400' : 'text-white'
                        }`}
                      >
                        {isEntrada ? `+${m.quantidade}` : `-${m.quantidade}`} un.
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>

      <MovimentacaoModal
        isOpen={isMovModalOpen}
        onClose={() => setIsMovModalOpen(false)}
        onSuccess={carregarDashboard}
        preSelectedProdutoId={selectedProdutoId}
      />
    </div>
  );
}
