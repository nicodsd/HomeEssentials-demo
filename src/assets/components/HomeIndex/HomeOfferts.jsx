import React, { useState, useEffect } from 'react';
import image from '../../../../public/images/banners/5g.png';

const HomeOfferts = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  // Array de objetos con la información de los banners para mantener el código limpio y escalable
  const slides = [
    {
      id: 1,
      tag: "Seasonal offers",
      title: "Up to 30% discount",
      subtitle: "On selected products",
      buttonText: "Store",
      bgImage: image,
      textColor: "text-slate-900",
      tagColor: "text-slate-600",
      btnClass: "bg-black text-white hover:bg-slate-800"
    },
    {
      id: 2,
      tag: "Best Sound",
      title: "Up to 40% discount",
      subtitle: "On selected products",
      buttonText: "Buy Now!",
      bgImage: "https://i.ibb.co/TPHgjcN/zyro-image-1.jpg",
      textColor: "text-white",
      tagColor: "text-slate-300",
      btnClass: "bg-slate-100 text-slate-800 hover:bg-white"
    }
  ];
  // Efecto para el cambio automático de slide cada 5 segundos (solo en mobile/tablet)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className='overflow-hidden'>
      <div className='w-[97%] sm:w-[90%] mx-auto selection:bg-[#FF8A00] relative group'>
        {/* 📱 VISTA MOBILE/TABLET: Slider Horizontal */}
        <div className='xl:hidden overflow-hidden rounded-xl relative shadow-md h-[180px] sm:h-[340px]'>
          <div
            className='flex h-full transition-transform duration-700 ease-out'
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide) => (
              <div
                key={slide.id}
                className='w-full h-full flex-shrink-0 flex items-center p-3 sm:p-14 bg-cover bg-center'
                style={{ backgroundImage: `url('${slide.bgImage}')` }}
              >
                {/* Capa de contraste opcional para mejorar lectura de fondo */}
                <div className="absolute inset-0 bg-black/10 pointer-events-none rounded-2xl" />
                <div className={`w-[85%] sm:w-[65%] gap-1 sm:gap-4 flex flex-col relative z-10 ${slide.textColor}`}>
                  <span className={`text-xs sm:text-sm font-semibold tracking-wide uppercase ${slide.tagColor}`}>
                    {slide.tag}
                  </span>
                  <h2 className='font-bold text-xl sm:text-4xl leading-tight tracking-tight drop-shadow-sm'>
                    {slide.title}
                  </h2>
                  <h3 className='text-xs sm:text-base opacity-90 font-medium'>
                    {slide.subtitle}
                  </h3>
                  <button className={`w-[50%] sm:w-[35%] py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 mt-2 ${slide.btnClass}`}>
                    {slide.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Indicadores de puntos (Dots) para el Slider Mobile */}
          <div className='absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-20'>
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-xl transition-all duration-300 ${currentSlide === idx ? 'w-6 bg-white' : 'w-2 bg-white/50'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 🖥️ VISTA DESKTOP: Mantiene la hermosa grilla dual de 2 columnas pero con esteroides UI */}
      <div className='hidden xl:flex justify-between gap-4 w-full lg:w-[70%] mx-auto h-[12vw] min-h-[200px]'>
        {slides.map((slide) => (
          <div
            key={slide.id}
            className='flex items-center p-8 border border-gray-300 hover:border-transparent hover:shadow-[0_20px_45px_rgba(0,0,0,0.08)] h-full w-full bg-cover bg-center rounded-2xl transition-all duration-300 transform relative overflow-hidden'
            style={{ backgroundImage: `url('${slide.bgImage}')` }}
          >
            <div className={`w-[70%] gap-4 flex flex-col relative z-10 ${slide.textColor}`}>
              <span className={`text-sm font-bold tracking-wider uppercase ${slide.tagColor}`}>
                {slide.tag}
              </span>
              <h2 className='font-semibold w-[60%] text-3xl lg:text-4xl xl:text-[2.3vw] leading-tight'>
                {slide.title}
              </h2>
              <button className={`w-[40%] lg:w-[35%] py-3 rounded-xl font-bold text-sm shadow-sm transition-all transform active:scale-95 hover:scale-105 mt-2 ${slide.btnClass}`}>
                {slide.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default HomeOfferts;