import React, { useState, useEffect } from 'react';
import { fornecedorService } from '../../api/fornecedorService';
import MagneticButton from '../../components/ui/MagneticButton';

export default function FornecedoresPage() {
  const [fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    email: '',
    telefone: '',
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [validacoes, setValidacoes] = useState({});
  const [salvando, setSalvando] = useState(false);

  const carregarFornecedores = async () => {
    setLoading(true);
    try {
      const res = await fornecedorService.listar({ size: 100 });
      const lista = res.content || res;
      setFornecedores(Array.isArray(lista) ? lista : []);
    } catch (err) {
      console.error('Erro ao listar fornecedores:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarFornecedores();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validacoes[name]) {
      setValidacoes((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setErrorMsg('');
    setValidacoes({});
    try {
      await fornecedorService.criar({
        nome: formData.nome,
        cnpj: formData.cnpj,
        email: formData.email,
        telefone: formData.telefone,
      });
      setFormData({ nome: '', cnpj: '', email: '', telefone: '' });
      setIsModalOpen(false);
      carregarFornecedores();
    } catch (err) {
      setErrorMsg(err.message || 'Erro ao cadastrar fornecedor.');
      if (err.validacoes) {
        setValidacoes(err.validacoes);
      }
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
            Entidades Externas & Suprimentos
          </span>
          <h1 className="font-display text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            Diretório de fornecedores.
          </h1>
          <p className="text-sm text-[#8c8578] mt-3 max-w-xl leading-relaxed">
            Parceiros comerciais e canais de abastecimento homologados com verificação de CNPJ pela Receita Federal.
          </p>
        </div>

        <MagneticButton
          variant="primary"
          onClick={() => {
            setFormData({ nome: '', cnpj: '', email: '', telefone: '' });
            setErrorMsg('');
            setValidacoes({});
            setIsModalOpen(true);
          }}
        >
          + Novo Fornecedor
        </MagneticButton>
      </div>

      {/* DESIGN PRÓPRIO: Cartões Corporativos B2B */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-3 py-16 text-center text-xs text-[#5c564c] border border-[#1f1d17] bg-[#12110e] rounded">
            Carregando parceiros homologados...
          </div>
        ) : fornecedores.length === 0 ? (
          <div className="col-span-3 py-16 text-center text-xs text-[#5c564c] border border-[#1f1d17] bg-[#12110e] rounded">
            Nenhum parceiro homologado cadastrado.
          </div>
        ) : (
          fornecedores.map((f) => (
            <div
              key={f.id}
              className="group border border-[#1f1d17] hover:border-[#e58b20]/50 bg-[#12110e]/95 backdrop-blur-md rounded p-6 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-[#e58b20] bg-[#e58b20]/10 border border-[#e58b20]/30 px-2.5 py-0.5 rounded">
                    CNPJ: {f.cnpj}
                  </span>
                  <span className="text-[11px] font-medium text-emerald-400">Homologado</span>
                </div>

                <h3 className="font-bold text-white text-lg group-hover:text-amber-100 transition-colors mt-2">
                  {f.nome}
                </h3>
              </div>

              <div className="mt-6 pt-4 border-t border-[#1c1a14] space-y-2 text-xs">
                <div className="flex items-center text-[#8c8578] hover:text-white transition-colors">
                  <span className="w-16 text-[#5c564c]">E-mail:</span>
                  <a href={`mailto:${f.email}`} className="truncate hover:underline">
                    {f.email || '—'}
                  </a>
                </div>

                <div className="flex items-center text-[#8c8578]">
                  <span className="w-16 text-[#5c564c]">Telefone:</span>
                  <span className="text-white">{f.telefone || '—'}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Novo Fornecedor */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141310] border border-[#23201a] w-full max-w-md rounded shadow-2xl overflow-hidden animate-in fade-in duration-150">
            <div className="px-6 py-5 border-b border-[#1f1d17] flex items-center justify-between">
              <h3 className="font-display font-bold text-white text-lg">Novo Fornecedor</h3>
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
                  Razão Social / Nome *
                </label>
                <input
                  type="text"
                  name="nome"
                  required
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Ex: Tech Distribuidora LTDA"
                  className="w-full bg-[#0c0b09] border border-[#23201a] focus:border-[#e58b20] rounded px-3.5 py-2 text-xs text-white outline-none"
                />
                {validacoes.nome && (
                  <span className="text-[11px] text-rose-400 mt-1 block">{validacoes.nome}</span>
                )}
              </div>

              <div>
                <label className="block text-xs uppercase text-[#8c8578] mb-1.5 font-medium">
                  CNPJ (Válido) *
                </label>
                <input
                  type="text"
                  name="cnpj"
                  required
                  value={formData.cnpj}
                  onChange={handleChange}
                  placeholder="00.000.000/0000-00"
                  className="w-full bg-[#0c0b09] border border-[#23201a] focus:border-[#e58b20] rounded px-3.5 py-2 text-xs text-white outline-none"
                />
                {validacoes.cnpj && (
                  <span className="text-[11px] text-rose-400 mt-1 block">{validacoes.cnpj}</span>
                )}
              </div>

              <div>
                <label className="block text-xs uppercase text-[#8c8578] mb-1.5 font-medium">
                  E-mail Comercial *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contato@empresa.com"
                  className="w-full bg-[#0c0b09] border border-[#23201a] focus:border-[#e58b20] rounded px-3.5 py-2 text-xs text-white outline-none"
                />
                {validacoes.email && (
                  <span className="text-[11px] text-rose-400 mt-1 block">{validacoes.email}</span>
                )}
              </div>

              <div>
                <label className="block text-xs uppercase text-[#8c8578] mb-1.5 font-medium">
                  Telefone *
                </label>
                <input
                  type="text"
                  name="telefone"
                  required
                  value={formData.telefone}
                  onChange={handleChange}
                  placeholder="(11) 99999-9999"
                  className="w-full bg-[#0c0b09] border border-[#23201a] focus:border-[#e58b20] rounded px-3.5 py-2 text-xs text-white outline-none"
                />
                {validacoes.telefone && (
                  <span className="text-[11px] text-rose-400 mt-1 block">{validacoes.telefone}</span>
                )}
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
                  {salvando ? 'Validando...' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
