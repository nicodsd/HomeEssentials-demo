import React from 'react';
import { Link as Anchor } from 'react-router-dom';

const MiddleNavBar = () => {
  return (
    <div className='w-full h-8 sm:h-9 bg-slate-900 flex justify-center lg:justify-between items-center px-4 lg:px-12 transition-all select-none'>

      {/* Bloque Izquierdo: Anuncio de Envíos */}
      <div className='flex items-center gap-2'>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="w-4 h-4 text-indigo-400 animate-pulse"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
        </svg>
        <h2 className='text-slate-200 text-xs font-medium tracking-wide'>
          Free shipping on purchases over <span className="text-white font-bold">$499</span>
        </h2>
      </div>

      {/* Bloque Derecho: Enlaces Secundarios (Ocultos en mobile/tablet, se manejan en el Navbar principal) */}
      <div className='hidden lg:flex items-center gap-6 xl:gap-8 text-xs xl:text-sm text-slate-300 font-medium'>
        <Anchor
          to='/about'
          className='hover:text-white hover:underline transition-colors duration-150'
        >
          About Us
        </Anchor>
        <Anchor
          to='/contact'
          className='hover:text-white hover:underline transition-colors duration-150'
        >
          Contact
        </Anchor>
        <Anchor
          to='/attendance'
          className='hover:text-white hover:underline transition-colors duration-150'
        >
          Attendance
        </Anchor>

        {/* Separador visual elegante */}
        <span className="text-slate-700">|</span>

        <a
          className='text-slate-200 hover:text-white transition-colors duration-150 font-semibold'
          href='tel:+5213312345678'
        >
          Call: +52 1 33 1234-5678
        </a>
      </div>

    </div>
  );
};

export default MiddleNavBar;