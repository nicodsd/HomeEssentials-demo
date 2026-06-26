import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import categories_actions from '../../../store/actions/categories';
import products_actions from '../../../store/actions/products';
import SearchBar from "./SearchBar";

const CategoriesNav = ({ isScrolled }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { categories_read } = categories_actions;
  const { products_read } = products_actions;

  const categories = useSelector(store => store.categories.categories || []);
  const manufacturers = useSelector(store => store.manufacturerHome.manufacturers || []);
  const categoriesChecked = useSelector(store => store.categories.categoriesCheked || []);

  // Estados de filtros
  const [filterPrice, setFilterPrice] = useState(1);
  const [manufacturerChecked, setManufacturerChecked] = useState([]);

  // Estado para controlar qué sección del panel mostrar ('price', 'manufacturers', 'categories' o null)
  const [activePanel, setActivePanel] = useState(null);

  const handleManufacturerChange = (id) => {
    setManufacturerChecked(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };
  const resetFilters = () => {
    navigate(`/allproducts`);
    setManufacturerChecked([]);
    setFilterPrice(1);
    setActivePanel(null);
  };

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(categories_read());
    }
  }, [dispatch, categories.length, categories_read]);

  useEffect(() => {
    dispatch(products_read({
      categoriesCheked: [],
      manufacturerCheked: manufacturerChecked,
      filterPrice
    }));
  }, [manufacturerChecked, filterPrice, dispatch, products_read]);

  return (
    // Agrupamos todo en un contenedor relativo con onMouseLeave para que si el usuario se va del nav o del panel, se cierre todo.
    <div
      className="relative z-30 w-3/5"
      onMouseLeave={() => setActivePanel(null)}
    >
      {/* Barra de Navegación Principal */}
      <div className={`h-[40px] hidden lg:flex items-center justify-center gap-6 z-30 transition-all max-w-7xl duration-300 ${isScrolled ? 'max-w-full rounded-none bg-transparent' : 'w-full mx-auto'}`}>
        <div className="gap-6 flex w-full">
          <button
            className="text-black rounded-md font-medium w-fit p-1 transition-all hover:opacity-40 hover:cursor-pointer"
            onClick={resetFilters}
          >
            View All Products
          </button>
          <button
            onMouseEnter={() => setActivePanel("categories")}
            onClick={() => navigate("/allproducts")}
            className="text-black w-fit p-1 transition-all hover:opacity-40 hover:cursor-pointer"
          >
            Categories
          </button>
          <button
            onMouseEnter={() => setActivePanel("manufacturers")}
            onClick={() => navigate("/allproducts")}
            className="text-black w-fit p-1 transition-all hover:opacity-40 hover:cursor-pointer"
          >
            Manufacturers
          </button>
        </div>
        <SearchBar />
      </div>

      {/* --- PANEL ÚNICO INFERIOR DESPLEGABLE --- */}
      {activePanel && (
        <div className="absolute top-10 left-10 w-full bg-white/95 backdrop-blur-md shadow-2xl border border-slate-200/50 rounded-xl p-1 z-40 animate-fadeIn text-slate-800">
          <div className="max-w-5xl mx-auto p-6 md:p-2">

            {/* --- Contenido: Precios --- */}
            {activePanel === 'price' && (
              <div className="flex flex-wrap gap-4 justify-start items-center animate-slideIn">
                <h3 className="text-xs font-bold tracking-widest uppercase text-purple-200 border-r border-[#ffffff26] pr-4 mr-2">
                  Order Price
                </h3>
                <div className="flex gap-2 bg-black/20 p-1 rounded-xl">
                  <button
                    onClick={() => setFilterPrice(1)}
                    className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${filterPrice === 1
                      ? 'bg-white text-[#7847E0] shadow-md font-bold'
                      : 'text-white hover:bg-white/10'
                      }`}
                  >
                    Least to Greatest ↑
                  </button>
                  <button
                    onClick={() => setFilterPrice(-1)}
                    className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${filterPrice === -1
                      ? 'bg-white text-[#7847E0] shadow-md font-bold'
                      : 'text-white hover:bg-white/10'
                      }`}
                  >
                    Greatest to Least ↓
                  </button>
                </div>
              </div>
            )}

            {/* --- Contenido: Fabricantes --- */}
            {activePanel === "manufacturers" && (
              <div className="animate-slideIn">
                <h3 className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-3">
                  Select Manufacturers
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {manufacturers.map((manufacturer) => {
                    const isChecked = manufacturerChecked.includes(manufacturer._id);
                    return (
                      <label
                        key={manufacturer._id}
                        className={`flex items-center justify-center px-3 py-2 rounded-xl cursor-pointer text-center text-[10px] font-medium tracking-wide transition-all border ${isChecked
                          ? "bg-[#6333c7] text-white border-[#6333c7] shadow-sm"
                          : "border-slate-200 hover:bg-slate-50 text-slate-600"
                          }`}
                      >
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={isChecked}
                          onChange={() => handleManufacturerChange(manufacturer._id)}
                        />
                        {manufacturer.name}
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* --- Contenido: Categorías --- */}
            {activePanel === "categories" && (
              <div className="animate-slideIn">
                <h3 className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-3">
                  Select Categories
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {categories.map((category) => {
                    const isChecked = categoriesChecked.includes(category._id);
                    return (
                      <button
                        key={category._id}
                        onClick={() => {
                          navigate(`/allproducts/${category.name.toLowerCase().replace(/\s+/g, '-')}`);
                          setActivePanel(null);
                        }}
                        className="flex items-center justify-center px-3 py-2 rounded-xl cursor-pointer text-center text-[10px] font-medium tracking-wide transition-all border border-slate-200 hover:bg-slate-50 text-slate-600"
                      >
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={isChecked}
                          onChange={() => handleCategoryChange(category._id)}
                        />
                        {category.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesNav;