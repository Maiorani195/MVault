import React, { useState, useEffect } from 'react';
import { movimentacaoService } from '../../api/movimentacaoService';
import { produtoService } from '../../api/produtoService';

export default function MovimentacaoModal({ isOpen, onClose, onSuccess, preSelectedProdutoId }) {
  const [tipo, setTipo] = useState('ENTRADA');
  const [produtoId, setProdutoId] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [observacao, setObservacao] = useState('');
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [validacoes, setValidacoes] = useState({});

  useEffect(() => {
    if (isOpen) {
      carregarProdutos();
      setTipo('ENTRADA');
      setQuantidade('');
      setObservacao('');
      setErrorMsg('');
      setValidacoes({});
      if (preSelectedProdutoId) {
        setProdutoId(preSelectedProdutoId);
      }
    }
  }, [isOpen, preSelectedProdutoId]);

  const carregarProdutos = async () => {
    try {
      const res = await produtoService.listar({ size: 100 });
      const lista = res.content || res;
      const arr = Array.isArray(lista) ? lista : [];
      setProdutos(arr);
      if (!preSelectedProdutoId && arr.length > 0) {
        setProdutoId(arr[0].id);
      }
    } catch (err) {
      console.error('Erro ao listar produtos:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setValidacoes({});

    try {
      await movimentacaoService.criar({
        tipo,
        produtoId: Number(produtoId),
        quantidade: parseInt(quantidade, 10),
        observacao: observacao.trim() || undefined,
      });

      onSuccess();
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Erro ao registrar movimentação.');
      if (err.validacoes) {
        setValidacoes(err.validacoes);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#141310] border border-[#23201a] w-full max-w-md rounded shadow-2xl overflow-hidden animate-in fade-in duration-150">
        <div className="px-6 py-5 border-b border-[#1f1d17] flex items-center justify-between">
          <h3 className="font-display font-bold text-white text-lg">Registrar Movimentação</h3>
          <button
            onClick={onClose}
            className="text-[#8c8578] hover:text-white font-mono-clean text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-mono-clean uppercase text-[#8c8578] mb-2">
              Tipo de Operação *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="tipo"
                  value="ENTRADA"
                  checked={tipo === 'ENTRADA'}
                  onChange={() => setTipo('ENTRADA')}
                  className="peer sr-only"
                />
                <div className="text-center py-2.5 rounded border border-[#23201a] bg-[#0c0b09] text-[#8c8578] peer-checked:border-[#e58b20] peer-checked:text-[#e58b20] font-mono-clean font-bold text-xs transition">
                  ↓ ENTRADA
                </div>
              </label>
              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="tipo"
                  value="SAIDA"
                  checked={tipo === 'SAIDA'}
                  onChange={() => setTipo('SAIDA')}
                  className="peer sr-only"
                />
                <div className="text-center py-2.5 rounded border border-[#23201a] bg-[#0c0b09] text-[#8c8578] peer-checked:border-white peer-checked:text-white font-mono-clean font-bold text-xs transition">
                  ↑ SAÍDA
                </div>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono-clean uppercase text-[#8c8578] mb-1.5">
              Produto Selecionado *
            </label>
            <select
              required
              value={produtoId}
              onChange={(e) => setProdutoId(e.target.value)}
              className="w-full bg-[#0c0b09] border border-[#23201a] focus:border-[#e58b20] rounded px-3 py-2 text-xs text-white outline-none cursor-pointer"
            >
              {produtos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome} (Saldo atual: {p.quantidadeEstoque} un.)
                </option>
              ))}
            </select>
            {validacoes.produtoId && (
              <span className="text-[11px] text-rose-400 mt-1 block">{validacoes.produtoId}</span>
            )}
          </div>

          <div>
            <label className="block text-xs font-mono-clean uppercase text-[#8c8578] mb-1.5">
              Quantidade de Unidades *
            </label>
            <input
              type="number"
              min="1"
              required
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              placeholder="Ex: 10"
              className="w-full bg-[#0c0b09] border border-[#23201a] focus:border-[#e58b20] rounded px-3.5 py-2 text-xs font-mono-clean text-white outline-none"
            />
            {validacoes.quantidade && (
              <span className="text-[11px] text-rose-400 mt-1 block">{validacoes.quantidade}</span>
            )}
          </div>

          <div>
            <label className="block text-xs font-mono-clean uppercase text-[#8c8578] mb-1.5">
              Motivo / Documento
            </label>
            <textarea
              rows="2"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Ex: NF #1024, Lote da fábrica, venda direta balcão..."
              className="w-full bg-[#0c0b09] border border-[#23201a] focus:border-[#e58b20] rounded px-3.5 py-2 text-xs text-white outline-none"
            ></textarea>
          </div>

          <div className="pt-4 border-t border-[#1f1d17] flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-[#8c8578] hover:text-white cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded bg-white hover:bg-neutral-200 text-[#0c0b09] font-bold text-xs uppercase tracking-tight transition cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Processando...' : 'Confirmar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
