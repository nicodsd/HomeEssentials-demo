import { useNavigate } from "react-router-dom";
const MiddlePhotoSection = () => {
  const navigate = useNavigate();

  const redirectToAllProducts = () => {
    navigate('/allproducts');
  };
  return (
    <div className="mx-auto w-full lg:w-[85%] bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden flex flex-col xl:flex-row items-center justify-between gap-8 p-2 sm:p-6 xl:p-0">
      <div className="w-full lg:hidden h-[200px] sm:h-[350px] xl:h-[450px] rounded-xl xl:rounded-none overflow-hidden">
        <img
          className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-102"
          src="/images/banners/electrodomesticos.jpg"
          alt="Season promotion banner"
        />
      </div>

      <div className='w-full xl:w-[50%] flex items-center justify-center py-2 xl:py-12 px-4 sm:px-8'>
        <div className="flex flex-col gap-4 md:gap-6 items-center xl:items-start text-center xl:text-left w-full max-w-xl">

          <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-[#7847E0]">
            Season deals
          </span>

          <h2 className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-normal text-slate-900 leading-none tracking-tight w-[80%] lg:w-full">
            Selection of products with 50% Off
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 font-medium w-[80%] lg:w-full">
            * Terms and conditions apply. Promotion valid for a limited time.
          </p>

          <div className="w-full pt-2">
            <button onClick={redirectToAllProducts} className="group flex justify-center items-center gap-2 w-full sm:w-[60%] md:w-[45%] lg:w-[30%] bg-[#000000] hover:bg-[#6333c7] text-white py-3 sm:py-3.5 rounded-full font-bold shadow-md transition-all duration-300 transform active:scale-95">
              Store
            </button>
          </div>

        </div>
      </div>
      <div className="w-full hidden md:w-full md:block md:h-[240px] sm:h-[350px] xl:h-[450px] rounded-xl xl:rounded-none overflow-hidden">
        <img
          className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-102"
          src="/images/banners/electrodomesticos.jpg"
          alt="Season promotion banner"
        />
      </div>
    </div>
  );
};

export default MiddlePhotoSection;