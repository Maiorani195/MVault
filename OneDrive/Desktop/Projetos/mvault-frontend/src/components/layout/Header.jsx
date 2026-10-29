import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Header() {
  const navLinkClass = ({ isActive }) =>
    `nav-link text-sm transition py-1 relative tracking-wide ${
      isActive ? 'font-semibold text-white' : 'font-medium text-[#8c8578] hover:text-white'
    }`;

  const renderActiveIndicator = (isActive) =>
    isActive ? (
      <span className="absolute -bottom-[21px] left-0 right-0 h-[2px] bg-[#e58b20]"></span>
    ) : null;

  return (
    <header className="border-b border-[#1f1d17] bg-[#0c0b0a]/95 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        
        {/* Marca & Logo */}
        <NavLink to="/" className="flex items-center space-x-3.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1c1913] to-[#0c0b09] border border-[#e58b20]/60 p-1.5 flex items-center justify-center transition-all duration-300 group-hover:border-[#e58b20] group-hover:scale-105 shadow-md shadow-[#e58b20]/15">
            <svg viewBox="0 0 40 40" fill="none" className="w-full h-full text-[#e58b20]">
              <polygon points="20,4 35,12.5 20,21 5,12.5" fill="#e58b20" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              <polygon points="5,12.5 20,21 20,36 5,27.5" fill="#e58b20" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              <polygon points="20,21 35,12.5 35,27.5 20,36" fill="#e58b20" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              <circle cx="20" cy="21" r="2" fill="#ffffff" />
            </svg>
          </div>
          
          <span className="font-display font-extrabold text-2xl tracking-wide text-white uppercase leading-none">
            M<span className="text-[#e58b20]">VAULT</span>
          </span>
        </NavLink>

        {/* Links de Navegação */}
        <nav className="flex items-center space-x-8 text-sm">
          <NavLink to="/dashboard" className={navLinkClass}>
            {({ isActive }) => (
              <>
                Visão Geral
                {renderActiveIndicator(isActive)}
              </>
            )}
          </NavLink>
          <NavLink to="/produtos" className={navLinkClass}>
            {({ isActive }) => (
              <>
                Produtos
                {renderActiveIndicator(isActive)}
              </>
            )}
          </NavLink>
          <NavLink to="/movimentacoes" className={navLinkClass}>
            {({ isActive }) => (
              <>
                Movimentações
                {renderActiveIndicator(isActive)}
              </>
            )}
          </NavLink>
          <NavLink to="/categorias" className={navLinkClass}>
            {({ isActive }) => (
              <>
                Categorias
                {renderActiveIndicator(isActive)}
              </>
            )}
          </NavLink>
          <NavLink to="/fornecedores" className={navLinkClass}>
            {({ isActive }) => (
              <>
                Fornecedores
                {renderActiveIndicator(isActive)}
              </>
            )}
          </NavLink>
        </nav>

      </div>
    </header>
  );
}
