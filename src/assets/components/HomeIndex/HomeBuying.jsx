const FeaturesBanner = () => {
  return (
    <div className="w-full bg-white mt-10 border-b selection:bg-[#7847E0] selection:text-[#ffe927]">
      {/* Contenedor Principal: flex-row en móviles para que estén lado a lado */}
      <div className="mx-auto w-full md:w-[85%] flex flex-row justify-between md:justify-center items-start lg:items-center px-2 py-4 sm:gap-8 lg:gap-20">

        {/* Ítem 1 */}
        <div className="flex flex-col lg:flex-row items-center justify-start gap-1 lg:gap-3 w-1/3 lg:w-auto text-center lg:text-left">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="w-7 h-7 sm:w-8 sm:h-8 text-[#7847E0] shrink-0 transition-transform duration-300"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0" />
          </svg>
          <h2 className="text-[10px] sm:text-xs lg:text-sm font-medium text-[#393939] leading-tight">
            Your orders on the day
          </h2>
        </div>

        {/* Ítem 2 */}
        <div className="flex flex-col lg:flex-row items-center justify-start gap-1 lg:gap-3 w-1/3 lg:w-auto text-center lg:text-left">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 sm:w-8 sm:h-8 text-[#7847E0] shrink-0 transition-transform duration-300" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.9 17.9 0 0 0-3.213-9.193 2.06 2.06 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.6 48.6 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>
          <h2 className="text-[10px] sm:text-xs lg:text-sm font-medium text-[#393939] leading-tight">
            International Shipping
          </h2>
        </div>

        {/* Ítem 3 */}
        <div className="flex flex-col lg:flex-row items-center justify-start gap-1 lg:gap-3 w-1/3 lg:w-auto text-center lg:text-left">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 sm:w-8 sm:h-8 text-[#7847E0] shrink-0 transition-transform duration-300" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60 60 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0m3 0h.008v.008H18zm-12 0h.008v.008H6z" /></svg>
          <h2 className="text-[10px] sm:text-xs lg:text-sm font-medium text-[#393939] leading-tight">
            Save on your buy
          </h2>
        </div>

      </div>
    </div>
  );
};

export default FeaturesBanner;