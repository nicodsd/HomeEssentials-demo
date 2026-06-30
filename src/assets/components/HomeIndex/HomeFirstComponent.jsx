import { useNavigate } from 'react-router-dom';
import fondo from '../../../../public/images/banners/gemini.png';

const HomeFirstComponent = () => {
  return (
    <div className='w-full md:w-[87%] border mx-auto md:mt-6 min-h-[200px] md:h-[43vh] flex flex-col md:flex-row md:rounded-2xl relative selection:bg-[#7847E0] selection:text-[#ffe927] overflow-hidden'>
      {/* 📝 BLOQUE IZQUIERDO: Contenido Principal */}
      <div className='w-full md:w-[65%] lg:w-2/4 h-fit md:h-full relative px-6 py-3 md:py-8 sm:px-12 flex flex-col justify-between md:rounded-t-2xl md:rounded-tr-none md:rounded-l-2xl bg-[#ff5500] overflow-hidden z-10'>
        {/* Contenedor superior para Tag y Título */}
        <div className='flex flex-col gap-2 md:gap-4 relative z-10'>
          <span className='text-xs md:text-sm font-bold uppercase tracking-wider text-white/90'>
            Exclusive Promotion
          </span>
          <h1 className='text-4xl md:text-5xl lg:text-[3.5vw] font-bold text-[#ffe927] leading-[1.01] tracking-tighter max-w-[90%]'>
            Best prices on your favorite products
          </h1>
        </div>
        {/* Contenedor inferior para Párrafo y Acción */}
        <div className='flex flex-col gap-4 relative z-10 mt-auto'>
          <p className='text-sm sm:text-base md:text-md lg:text-lg text-white font-medium max-w-[85%] leading-relaxed'>
            Discover the best deals today.
          </p>
        </div>
        {/* Marca de agua "%" reposicionada dinámicamente */}
        <img
          src="https://cdn3d.iconscout.com/3d/premium/thumb/etiqueta-de-precio-4809877-3997868.png"
          alt='Hero background'
          className='absolute pointer-events-none right-3 lg:right-4 bottom-4 text-[#bf3131] font-black w-20 lg:w-44 leading-none select-none z-0 align-bottom'
        />
      </div>

      {/* 🖼️ BLOQUE DERECHO: Imagen de Banner */}
      <div className='w-full md:w-[35%] lg:w-2/3 h-[130px] md:h-full  md:rounded-bl-none md:rounded-r-2xl overflow-hidden'>
        <img
          src={fondo}
          alt='Hero background'
          className='w-full h-full object-cover object-right'
        />
      </div>

    </div>
  );
}

export default HomeFirstComponent