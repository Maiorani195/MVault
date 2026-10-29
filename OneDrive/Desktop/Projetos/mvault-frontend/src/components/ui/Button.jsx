import React from 'react';

export default function Button({
  children,
  onClick,
  className = '',
  variant = 'primary', // 'primary' (branco), 'amber' (âmbar), 'outline' (borda)
  disabled = false,
  type = 'button',
}) {
  let variantClasses = '';
  if (variant === 'primary') {
    variantClasses =
      'bg-white text-[#0c0b09] hover:bg-neutral-200 font-semibold border border-white/20 shadow-sm';
  } else if (variant === 'amber') {
    variantClasses =
      'bg-[#e58b20] text-[#0c0b09] hover:bg-[#f39c33] font-semibold border border-[#e58b20]/40';
  } else if (variant === 'outline') {
    variantClasses =
      'bg-[#141310] text-[#e58b20] hover:text-white border border-[#e58b20]/40 hover:border-[#e58b20] hover:bg-[#e58b20]/10 font-medium';
  } else if (variant === 'subtle') {
    variantClasses =
      'bg-[#161410] text-[#8c8578] hover:text-white border border-[#23201a] hover:border-[#38332a] font-medium';
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded px-4 py-2 text-xs transition-colors duration-150 cursor-pointer select-none disabled:opacity-50 flex items-center justify-center gap-2 ${variantClasses} ${className}`}
    >
      {children}
    </button>
  );
}
