import React, { useState, useEffect } from 'react';
import { categoriaService } from '../../api/categoriaService';
import MagneticButton from '../../components/ui/MagneticButton';

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [salvando, setSalvando] = useState(false);

  const carregarCategorias = async () => {
    setLoading(true);
    try {
      const res = await categoriaService.listar({ size: 100 });
      const lista = res.content || res;
      setCategorias(Array.isArray(lista) ? lista : []);
    } catch (err) {
      console.error('Erro ao listar categorias:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarCategorias();
  }, []);

  const handleSalvar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setErrorMsg('');
    try {
      await categoriaService.criar({ nome, descricao: descricao.trim() || undefined });
      setNome('');
      setDescricao('');
      setIsModalOpen(false);
      carregarCategorias();
    } catch (err) {
      setErrorMsg(err.message || 'Erro ao cadastrar categoria.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header com Identidade Própria */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#1f1d17]">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#e58b20] font-semibold block mb-2">
            Taxonomia & Organização
          </span>
          <h1 className="font-display text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            Categorias de produtos.
          </h1>
          <p className="text-sm text-[#8c8578] mt-3 max-w-xl leading-relaxed">
            Classificação estrutural dos itens armazenados. Agrupamentos operacionais para controle por setor e tipo de material.
          </p>
        </div>

        <MagneticButton variant="primary" onClick={() => setIsModalOpen(true)}>
          + Nova Categoria
        </MagneticButton>
      </div>

      {/* DESIGN PRÓPRIO: Grid de Cartões de Coleção */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-3 py-16 text-center text-xs text-[#5c564c] border border-[#1f1d17] bg-[#12110e] rounded">
            Carregando estrutura de categorias...
          </div>
        ) : categorias.length === 0 ? (
          <div className="col-span-3 py-16 text-center text-xs text-[#5c564c] border border-[#1f1d17] bg-[#12110e] rounded">
            Nenhuma categoria cadastrada até o momento.
          </div>
        ) : (
          categorias.map((c) => (
            <div
              key={c.id}
              className="group border border-[#1f1d17] hover:border-[#e58b20]/50 bg-[#12110e]/95 backdrop-blur-md rounded p-6 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded bg-[#1c1914] border border-[#2e271d] group-hover:border-[#e58b20]/60 flex items-center justify-center text-[#e58b20] transition-colors">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                    Ativo
                  </span>
                </div>

                <h3 className="font-bold text-white text-lg group-hover:text-amber-100 transition-colors">
                  {c.nome}
                </h3>
                <p className="text-xs text-[#8c8578] mt-2 leading-relaxed">
                  {c.descricao || 'Sem descrição detalhada para esta categoria.'}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#1c1a14] flex items-center justify-between text-xs text-[#8c8578]">
                <span>Identificador</span>
                <span className="font-semibold text-white">Categoria #{c.id}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Nova Categoria */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141310] border border-[#23201a] w-full max-w-md rounded shadow-2xl overflow-hidden animate-in fade-in duration-150">
            <div className="px-6 py-5 border-b border-[#1f1d17] flex items-center justify-between">
              <h3 className="font-display font-bold text-white text-lg">Nova Categoria</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#8c8578] hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="mx-6 mt-4 p-3 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSalvar} className="p-6 space-y-4">
              <div>
                <label className="block text-xs uppercase text-[#8c8578] mb-1.5 font-medium">
                  Nome da Categoria *
                </label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Hardware, Periféricos, Componentes..."
                  className="w-full bg-[#0c0b09] border border-[#23201a] focus:border-[#e58b20] rounded px-3.5 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-[#8c8578] mb-1.5 font-medium">
                  Descrição
                </label>
                <textarea
                  rows="2"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Especificações sobre os tipos de materiais..."
                  className="w-full bg-[#0c0b09] border border-[#23201a] focus:border-[#e58b20] rounded px-3.5 py-2 text-xs text-white outline-none"
                ></textarea>
              </div>

              <div className="pt-4 border-t border-[#1f1d17] flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#8c8578] hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvando}
                  className="px-5 py-2 rounded bg-white hover:bg-neutral-200 text-[#0c0b09] font-bold text-xs uppercase tracking-tight transition cursor-pointer disabled:opacity-50"
                >
                  {salvando ? 'Salvando...' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
