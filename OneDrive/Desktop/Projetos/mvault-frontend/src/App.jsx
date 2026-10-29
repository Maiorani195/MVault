import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/Dashboard/DashboardPage';
import ProdutosPage from './pages/Produtos/ProdutosPage';
import MovimentacoesPage from './pages/Movimentacoes/MovimentacoesPage';
import CategoriasPage from './pages/Categorias/CategoriasPage';
import FornecedoresPage from './pages/Fornecedores/FornecedoresPage';
import MovimentacaoModal from './components/modals/MovimentacaoModal';

export default function App() {
  const [isGlobalMovModalOpen, setIsGlobalMovModalOpen] = useState(false);

  return (
    <BrowserRouter>
      <Layout onNovaMovimentacao={() => setIsGlobalMovModalOpen(true)}>
        <Routes>
          <Route path="/" element={<Navigate to="/produtos" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/produtos" element={<ProdutosPage />} />
          <Route path="/movimentacoes" element={<MovimentacoesPage />} />
          <Route path="/categorias" element={<CategoriasPage />} />
          <Route path="/fornecedores" element={<FornecedoresPage />} />
          <Route path="*" element={<Navigate to="/produtos" replace />} />
        </Routes>
      </Layout>

      <MovimentacaoModal
        isOpen={isGlobalMovModalOpen}
        onClose={() => setIsGlobalMovModalOpen(false)}
        onSuccess={() => {
          // Dispara evento ou refresh de dados se necessário
          window.location.reload();
        }}
      />
    </BrowserRouter>
  );
}
