import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import products_actions from '../../../store/actions/products';
import manufacturers_action from '../../../store/actions/manufacturers';
import categories_actions from '../../../store/actions/categories';
import axios from 'axios';
import apiUrl from '../../../../api';
import cartNav_action from '../../../store/actions/cartNav';
import favNav_action from '../../../store/actions/favNav';
import { ToastContainer, toast, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// 1. EXTRAÍDO: Las funciones que no dependen del estado del componente deben ir por fuera 
// para no re-crearse en memoria en cada render.
const getStockStatus = (stock) => {
  if (stock === 0) return { label: "Out of stock", color: "bg-red-600 text-red-100" };
  if (stock <= 3) return { label: `Only ${stock} left!`, color: "bg-amber-600 text-amber-100" };
  return { label: "In Stock", color: "bg-emerald-700 text-emerald-100" };
};

const AllProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { category_slug } = useParams();

  const { products_read } = products_actions;
  const { manufacturers_read } = manufacturers_action;
  const { categories_read } = categories_actions;
  const { cartNav } = cartNav_action;
  const { favNav } = favNav_action;

  // Selectores de Redux
  const products = useSelector(store => store.products.products || []);
  const manufacturers = useSelector(store => store.manufacturerHome.manufacturers || []);
  const categories = useSelector(store => store.categories.categories || []);

  // Estados locales para controlar las selecciones de filtros
  const [selectedManufacturers, setSelectedManufacturers] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortPrice, setSortPrice] = useState(""); // "" | "asc" | "desc"

  // Estado para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Estado para el panel lateral en móviles
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Carga inicial de datos si están vacíos
  useEffect(() => {
    if (products.length === 0) dispatch(products_read());
    if (manufacturers.length === 0) dispatch(manufacturers_read());
    if (categories.length === 0) dispatch(categories_read());
  }, [dispatch, products.length, manufacturers.length, categories.length, products_read, manufacturers_read, categories_read]);

  // Sincronizar URL slug con filtros locales
  useEffect(() => {
    if (categories.length > 0) {
      if (category_slug) {
        const slugCat = categories.find(c => c.name.toLowerCase().replace(/\s+/g, '-') === category_slug);
        if (slugCat) {
          setSelectedCategories([slugCat._id]);
        }
      } else {
        setSelectedCategories([]);
      }
    }
  }, [category_slug, categories]);

  // Handler para los cambios en fabricantes (Checkboxes)
  const handleManufacturerChange = (id) => {
    setSelectedManufacturers(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Handler para los cambios en categorías (Checkboxes)
  const handleCategoryChange = (id) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Limpiar todos los filtros activos
  const clearFilters = () => {
    if (category_slug) {
      navigate('/allproducts');
    }
    setSelectedManufacturers([]);
    setSelectedCategories([]);
    setSortPrice("");
    setCurrentPage(1);
  };

  // Resetear la página al cambiar cualquier filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedManufacturers, selectedCategories, sortPrice, category_slug]);

  const handleAddToCart = (e, product_id) => {
    e.stopPropagation();
    const user = JSON.parse(localStorage.getItem('user')) || null;
    const token = localStorage.getItem('token') || "";
    const email = user?.email || "";
    if (!token) {
      toast.warning("Please sign in to add products to your cart.");
      return;
    }
    const headers = { headers: { 'authorization': `Bearer ${token}` } };
    const data = { userEmail: email, productId: product_id };

    axios.post(`${apiUrl}cart/create`, data, headers)
      .then(res => {
        const message = Array.isArray(res.data.message) ? res.data.message[0] : res.data.message;
        toast.success(message || "Added to cart successfully!");
        axios.get(`${apiUrl}cart/${email}`, headers)
          .then(cartRes => {
            dispatch(cartNav({ cart: cartRes.data.response.length }));
          })
          .catch(err => console.error(err));
      })
      .catch(err => {
        console.error(err);
        const errMsg = err.response?.data?.message;
        toast.error(Array.isArray(errMsg) ? errMsg[0] : errMsg || "Error adding product.");
      });
  };

  const handleAddToFavorites = (e, product_id) => {
    e.stopPropagation();
    const user = JSON.parse(localStorage.getItem('user')) || null;
    const token = localStorage.getItem('token') || "";
    const email = user?.email || "";
    if (!token) {
      toast.warning("Please sign in to save favorites.");
      return;
    }
    const headers = { headers: { 'authorization': `Bearer ${token}` } };
    const data = { userEmail: email, productId: product_id };
    axios.post(`${apiUrl}favorites`, data, headers)
      .then(() => {
        toast.success("Article added to favorites 💜");
        axios.get(`${apiUrl}favorites?userEmail=${email}`, headers)
          .then(favRes => {
            dispatch(favNav({ fav: favRes.data.response.length }));
          })
          .catch(err => console.error(err));
      })
      .catch(err => {
        console.error(err);
        toast.error(err.response?.data?.message || "Error adding to favorites.");
      });
  };

  // 2. OPTIMIZACIÓN: useMemo evita que `.filter()` y `.sort()` se ejecuten si los filtros no cambiaron
  // (Por ejemplo, al abrir el menú de móvil o cambiar de página, esto ya no se recalcula).
  const filteredProducts = useMemo(() => {
    return products
      .filter(prod => selectedManufacturers.length === 0 || selectedManufacturers.includes(prod.manufacturer_id))
      .filter(prod => selectedCategories.length === 0 || selectedCategories.includes(prod.category_id))
      .sort((a, b) => {
        if (sortPrice === "asc") return a.price - b.price;
        if (sortPrice === "desc") return b.price - a.price;
        return 0;
      });
  }, [products, selectedManufacturers, selectedCategories, sortPrice]);

  // 3. OPTIMIZACIÓN: Memoizamos la paginación para depender solo de filteredProducts y currentPage
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // 4. CORRECCIÓN DE ANTI-PATRÓN: Convertimos <FiltersContent /> en una variable JSX
  // Evita que React desmonte y vuelva a montar los inputs en cada renderizado.
  const filtersContentJSX = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Filters</h2>
        {(selectedManufacturers.length > 0 || selectedCategories.length > 0 || sortPrice !== "") && (
          <button onClick={clearFilters} className="text-xs font-semibold text-indigo-600 hover:underline">
            Clear all
          </button>
        )}
      </div>

      {/* Filtro 1: Orden por Precio */}
      <div className="border-t border-slate-100 pt-4">
        <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider text-[11px]">Sort By Price</h3>
        <select
          value={sortPrice}
          onChange={(e) => setSortPrice(e.target.value)}
          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:border-indigo-500 transition-all"
        >
          <option value="">Featured</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>

      {/* Filtro 2: Categorías */}
      <div className="border-t border-slate-100 pt-4">
        <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider text-[11px]">Categories</h3>
        <div className="space-y-2 pr-1">
          {categories.map(cat => (
            <label key={cat._id} className="flex items-center gap-3 text-sm text-slate-600 cursor-pointer select-none hover:text-slate-900 transition-colors">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat._id)}
                onChange={() => handleCategoryChange(cat._id)}
                className="w-4 h-4 rounded text-[#7847E0] focus:ring-[#7847E0] border-slate-300 transition-all"
              />
              <span className={selectedCategories.includes(cat._id) ? "font-semibold text-slate-900" : ""}>{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Filtro 3: Fabricantes */}
      <div className="border-t border-slate-100 pt-4">
        <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider text-[11px]">Manufacturers</h3>
        <div className="space-y-2 pr-1">
          {manufacturers.map(man => (
            <label key={man._id} className="flex items-center gap-3 text-sm text-slate-600 cursor-pointer select-none hover:text-slate-900 transition-colors">
              <input
                type="checkbox"
                checked={selectedManufacturers.includes(man._id)}
                onChange={() => handleManufacturerChange(man._id)}
                className="w-4 h-4 rounded text-[#7847E0] focus:ring-[#7847E0] border-slate-300 transition-all"
              />
              <span className={selectedManufacturers.includes(man._id) ? "font-semibold text-slate-900" : ""}>{man.name}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen selection:bg-[#7847E0] selection:text-white">

      {/* Botón Flotante para móviles */}
      <button
        onClick={() => setMobileFiltersOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-40 bg-gray-900 text-white px-5 py-3 rounded-full font-semibold shadow-lg flex items-center gap-2 text-sm active:scale-95 transition-transform"
      >
        <svg fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.3 48.3 0 0 1 12 3" /></svg>
        Filters
      </button>

      {/* --- MODAL LATERAL MOBILE (DRAWER) --- */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} />
          <div className="relative w-4/5 max-w-xs bg-white h-full p-6 scroll-container shadow-2xl flex flex-col justify-between overflow-y-auto z-10 animate-slideIn">
            <div>
              <div className="flex justify-end pb-2">
                <button onClick={() => setMobileFiltersOpen(false)} className="p-1 text-slate-400 hover:text-slate-800">
                  ✕
                </button>
              </div>
              {filtersContentJSX}
            </div>
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full py-3 mt-6 bg-[#7847E0] text-white font-bold text-sm rounded-xl"
            >
              Apply Filters ({filteredProducts.length})
            </button>
          </div>
        </div>
      )}

      {/* --- CONTENEDOR PRINCIPAL DOS COLUMNAS --- */}
      <div className='w-full mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-10 md:py-10 flex gap-8 items-start'>

        {/* 1. SIDEBAR ASIDE (Solo visible en Desktop/Tablet) */}
        <aside className="hidden md:block w-[240px] xl:w-[280px] p-1 pb-10 sticky overflow-y-auto h-[calc(100vh-100px)] top-6 shrink-0">
          {filtersContentJSX}
        </aside>

        {/* 2. ESPACIO DE LA GRILLA DE PRODUCTOS */}
        <main className="flex-grow w-full">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center text-xs sm:text-sm text-slate-500 font-medium overflow-x-auto whitespace-nowrap pb-1">
            <span onClick={() => navigate('/')} className="cursor-pointer hover:text-[#7847E0] transition-colors">Home</span>
            <span className="mx-2 font-bold opacity-50">&gt;</span>
            <span onClick={clearFilters} className={`cursor-pointer hover:text-[#7847E0] transition-colors ${selectedCategories.length === 0 ? "text-slate-800 font-bold" : ""}`}>Products</span>
            {(() => {
              let activeCats = selectedCategories;
              if (activeCats.length === 0 && products.length > 0) {
                const uniqueCats = [...new Set(products.map(p => p.category_id))];
                if (uniqueCats.length > 0 && uniqueCats.length < categories.length) {
                  activeCats = uniqueCats;
                }
              }

              if (activeCats.length === 1) {
                const catName = categories.find(c => c._id === activeCats[0])?.name;
                return (
                  <>
                    <span className="mx-2 font-bold opacity-50">&gt;</span>
                    <span className="text-slate-800 font-bold">{catName}</span>
                  </>
                );
              } else if (activeCats.length > 1) {
                return (
                  <>
                    <span className="mx-2 font-bold opacity-50">&gt;</span>
                    <span className="text-slate-800 font-bold">Multiple Categories</span>
                  </>
                );
              }
              return null;
            })()}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="w-full text-center py-20 bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
              <p className="text-slate-500 font-medium text-lg">No products found matching the selected criteria.</p>
              <button onClick={clearFilters} className="mt-4 text-sm font-bold text-[#7847E0] hover:underline">Reset Filters</button>
            </div>
          ) : (
            <div className='flex flex-col gap-6 w-full'>
              <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-1.5 justify-items-center'>
                {paginatedProducts.map((prod) => {
                  const stockStatus = getStockStatus(prod.stock_Available);
                  return (
                    <div
                      key={prod._id}
                      onClick={() => navigate(`/products/${prod._id}`)}
                      className="group flex flex-col justify-between w-full max-w-[260px] bg-white rounded-md border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden"
                    >
                      <div className='relative aspect-square w-full bg-slate-50 overflow-hidden group'>
                        <img
                          src={prod.photo}
                          alt={prod.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />

                        <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">

                          <div className="flex gap-1.5 flex-wrap">
                            <span className={`text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full ${stockStatus.color}`}>
                              {stockStatus.label}
                            </span>
                            <span className="text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-600 text-blue-100">
                              NEW
                            </span>
                          </div>

                          <button
                            onClick={(e) => handleAddToFavorites(e, prod._id)}
                            className="text-slate-900 hover:text-red-500 bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow-sm transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 text-black">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12" />
                            </svg>
                          </button>
                        </div>

                      </div>

                      <div className="p-2 flex flex-col flex-grow justify-start">
                        <h3 className="font-semibold text-slate-800 text-[14px] group-hover:text-[#7847E0] transition-colors leading-none line-clamp-2">
                          {prod.name}
                        </h3>
                        <p className="text-[11px] mt-1 text-slate-600 line-clamp-3">{prod.description}</p>
                      </div>
                      <div className="flex items-end justify-between p-2">
                        <div className="flex flex-col">
                          <span className="font-bold text-lg sm:text-xl text-[#290a6d]">
                            {Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(prod.price)}
                          </span>
                        </div>
                        <div
                          onClick={(e) => handleAddToCart(e, prod._id)}
                          className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-[#7847E0] flex items-center justify-center transition-colors shadow-sm shrink-0"
                        >
                          <svg fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Controles de Paginación */}
              {totalPages > 1 && (
                <div className="w-full flex justify-center items-center gap-4 mt-6">
                  <button
                    onClick={() => {
                      setCurrentPage(prev => Math.max(prev - 1, 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-xl bg-slate-50 text-slate-600 font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors shadow-sm border border-slate-200"
                  >
                    Previous
                  </button>
                  <span className="text-sm font-bold text-slate-700 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => {
                      setCurrentPage(prev => Math.min(prev + 1, totalPages));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-xl bg-slate-50 text-slate-600 font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors shadow-sm border border-slate-200"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </main>

      </div>
      <ToastContainer transition={Flip} position="bottom-right" autoClose={2000} hideProgressBar theme="light" />
    </div>
  );
};

export default AllProducts;