import React, { useState, useEffect } from 'react';
import { produtoService } from '../../api/produtoService';
import { categoriaService } from '../../api/categoriaService';
import { fornecedorService } from '../../api/fornecedorService';

export default function ProdutoModal({ isOpen, onClose, onSuccess, produtoEdicao }) {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    estoqueMinimo: 5,
    categoriaId: '',
    fornecedorId: '',
  });

  const [categorias, setCategorias] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [validacoes, setValidacoes] = useState({});

  useEffect(() => {
    if (isOpen) {
      carregarDependencias();
      if (produtoEdicao) {
        setFormData({
          nome: produtoEdicao.nome || '',
          descricao: produtoEdicao.descricao || '',
          preco: produtoEdicao.preco || '',
          estoqueMinimo: produtoEdicao.estoqueMinimo ?? 5,
          categoriaId: produtoEdicao.categoriaId || '',
          fornecedorId: produtoEdicao.fornecedorId || '',
        });
      } else {
        setFormData({
          nome: '',
          descricao: '',
          preco: '',
          estoqueMinimo: 5,
          categoriaId: '',
          fornecedorId: '',
        });
      }
      setErrorMsg('');
      setValidacoes({});
    }
  }, [isOpen, produtoEdicao]);

  const carregarDependencias = async () => {
    try {
      const [resCat, resForn] = await Promise.all([
        categoriaService.listar({ size: 100 }),
        fornecedorService.listar({ size: 100 }),
      ]);
      const listaCat = resCat.content || resCat;
      const listaForn = resForn.content || resForn;
      setCategorias(Array.isArray(listaCat) ? listaCat : []);
      setFornecedores(Array.isArray(listaForn) ? listaForn : []);

      if (!produtoEdicao) {
        if (listaCat?.length > 0) setFormData((prev) => ({ ...prev, categoriaId: listaCat[0].id }));
        if (listaForn?.length > 0) setFormData((prev) => ({ ...prev, fornecedorId: listaForn[0].id }));
      }
    } catch (err) {
      console.error('Erro ao carregar categorias ou fornecedores:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validacoes[name]) {
      setValidacoes((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setValidacoes({});

    try {
      const payload = {
        nome: formData.nome,
        descricao: formData.descricao,
        preco: parseFloat(formData.preco),
        estoqueMinimo: parseInt(formData.estoqueMinimo, 10),
        categoriaId: Number(formData.categoriaId),
        fornecedorId: Number(formData.fornecedorId),
      };

      if (produtoEdicao?.id) {
        await produtoService.atualizar(produtoEdicao.id, payload);
      } else {
        await produtoService.criar(payload);
      }

      onSuccess();
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Erro ao salvar produto.');
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
      <div className="bg-[#141310] border border-[#23201a] w-full max-w-lg rounded shadow-2xl overflow-hidden animate-in fade-in duration-150">
        <div className="px-6 py-5 border-b border-[#1f1d17] flex items-center justify-between">
          <h3 className="font-display font-bold text-white text-lg">
            {produtoEdicao ? 'Editar Produto' : 'Novo Produto'}
          </h3>
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
            <label className="block text-xs font-mono-clean uppercase text-[#8c8578] mb-1.5">
              Nome do Item *
            </label>
            <input
              type="text"
              name="nome"
              required
              value={formData.nome}
              onChange={handleChange}
              placeholder="Ex: Teclado Mecânico RGB Switch Blue"
              className="w-full bg-[#0c0b09] border border-[#23201a] focus:border-[#e58b20] rounded px-3.5 py-2 text-xs text-white outline-none"
            />
            {validacoes.nome && (
              <span className="text-[11px] text-rose-400 mt-1 block">{validacoes.nome}</span>
            )}
          </div>

          <div>
            <label className="block text-xs font-mono-clean uppercase text-[#8c8578] mb-1.5">
              Descrição Técnica
            </label>
            <textarea
              name="descricao"
              rows="2"
              value={formData.descricao}
              onChange={handleChange}
              placeholder="Especificações, conexões, layout..."
              className="w-full bg-[#0c0b09] border border-[#23201a] focus:border-[#e58b20] rounded px-3.5 py-2 text-xs text-white outline-none"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono-clean uppercase text-[#8c8578] mb-1.5">
                Preço Unitário (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                name="preco"
                required
                value={formData.preco}
                onChange={handleChange}
                placeholder="249.90"
                className="w-full bg-[#0c0b09] border border-[#23201a] focus:border-[#e58b20] rounded px-3.5 py-2 text-xs font-mono-clean text-white outline-none"
              />
              {validacoes.preco && (
                <span className="text-[11px] text-rose-400 mt-1 block">{validacoes.preco}</span>
              )}
            </div>
            <div>
              <label className="block text-xs font-mono-clean uppercase text-[#8c8578] mb-1.5">
                Estoque Mínimo *
              </label>
              <input
                type="number"
                min="0"
                name="estoqueMinimo"
                required
                value={formData.estoqueMinimo}
                onChange={handleChange}
                placeholder="5"
                className="w-full bg-[#0c0b09] border border-[#23201a] focus:border-[#e58b20] rounded px-3.5 py-2 text-xs font-mono-clean text-white outline-none"
              />
              {validacoes.estoqueMinimo && (
                <span className="text-[11px] text-rose-400 mt-1 block">{validacoes.estoqueMinimo}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono-clean uppercase text-[#8c8578] mb-1.5">
                Categoria *
              </label>
              <select
                name="categoriaId"
                required
                value={formData.categoriaId}
                onChange={handleChange}
                className="w-full bg-[#0c0b09] border border-[#23201a] focus:border-[#e58b20] rounded px-3 py-2 text-xs text-white outline-none cursor-pointer"
              >
                <option value="">Selecione...</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono-clean uppercase text-[#8c8578] mb-1.5">
                Fornecedor *
              </label>
              <select
                name="fornecedorId"
                required
                value={formData.fornecedorId}
                onChange={handleChange}
                className="w-full bg-[#0c0b09] border border-[#23201a] focus:border-[#e58b20] rounded px-3 py-2 text-xs text-white outline-none cursor-pointer"
              >
                <option value="">Selecione...</option>
                {fornecedores.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.nome}
                  </option>
                ))}
              </select>
            </div>
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
              {loading ? 'Salvando...' : produtoEdicao ? 'Atualizar' : 'Salvar Produto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
