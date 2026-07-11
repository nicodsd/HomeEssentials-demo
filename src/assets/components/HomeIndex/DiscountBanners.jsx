import { useNavigate } from 'react-router-dom';

export default function DiscountBanners() {
    const navigate = useNavigate();

    const banners = [
        {
            id: 1,
            discount: "30% OFF",
            description: "On selected products",
            image: "https://modernhomefurnishings.ca/wp-content/uploads/2021/01/carlos-2.png",
            alt: "Sillón en promoción Carlos",
            bgColor: "bg-[#242222]",
            textSize: "text-xl"
        },
        {
            id: 2,
            discount: "50% OFF",
            description: "On selected products",
            image: "https://www.grupoferreterochc.com.mx/files/Productos/Bosch/Bosch_1121134.png",
            alt: "Herramienta Bosch en promoción",
            bgColor: "bg-[#070707]",
            textSize: "text-2xl"
        }
    ];

    return (
        <div className="lg:h-[8vh] w-full p-2 lg:w-[85%] grid grid-cols-2 gap-2">
            {banners.map((banner) => (
                <div
                    key={banner.id}
                    onClick={() => navigate('/allproducts')}
                    className="group hover:scale-[1.01] flex-col lg:flex-row lg:bg-white transition-all duration-200 w-full justify-center items-center lg:h-full bg-[#ffc445] cursor-pointer flex rounded-md lg:rounded-xl overflow-hidden"
                >
                    {/* Imagen */}
                    <img
                        src={banner.image}
                        alt={banner.alt}
                        className="w-20 sm:w-24 h-auto lg:h-full object-cover lg:bg-[#ffc445]"
                    />

                    {/* Contenido de texto */}
                    <div className={`text-white h-full flex-1 h-34 w-full pl-2 pb-2 lg:pb-0 lg:pl-3 sm:pl-12 ${banner.bgColor} flex flex-col justify-center`}>
                        <h4 className={`${banner.textSize} text-[#ffc445] font-bold leading-tight`}>
                            {banner.discount}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-300">
                            {banner.description}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}