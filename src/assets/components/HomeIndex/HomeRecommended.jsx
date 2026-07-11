import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiUrl from '../../../../api';
import { useDispatch } from 'react-redux';
import cartNav_action from '../../../store/actions/cartNav';
import { toast } from 'react-toastify';

const HomeRecommended = () => {
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartNav } = cartNav_action;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${apiUrl}products`);
        const data = await response.json();

        let allProducts = data?.data?.products || data?.products || data?.response || [];

        const categoryMap = new Map();
        for (const product of allProducts) {
          if (!categoryMap.has(product.category_id?._id || product.category_id)) {
            categoryMap.set(product.category_id?._id || product.category_id, product);
          }
        }

        let variedProducts = Array.from(categoryMap.values());

        const filledProducts = [...variedProducts];
        const remainingProducts = allProducts.filter(p => !filledProducts.some(fp => fp._id === p._id));
        filledProducts.push(...remainingProducts);
        variedProducts = filledProducts;

        setRecommendedProducts(variedProducts);
      } catch (error) {
        console.error("Error fetching recommended products", error);
      }
    };
    fetchProducts();
  }, []);

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: "Out of stock", color: "bg-red-600 text-red-100" };
    if (stock <= 3) return { label: `Only ${stock} left!`, color: "bg-amber-600 text-amber-100" };
    return { label: "In Stock", color: "bg-emerald-700 text-emerald-100" };
  };

  const redirectToAllProducts = () => {
    navigate('/allproducts');
  };

  const nextSlide = () => {
    if (currentIndex + 4 < recommendedProducts.length) {
      setCurrentIndex(currentIndex + 4);
    }
  };

  const prevSlide = () => {
    if (currentIndex - 4 >= 0) {
      setCurrentIndex(currentIndex - 4);
    }
  };

  const displayedProducts = recommendedProducts.slice(currentIndex, currentIndex + 4);

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

    fetch(`${apiUrl}cart/create`, { ...headers, method: 'POST', body: JSON.stringify(data), headers: { ...headers?.headers, 'Content-Type': 'application/json' } }).then(res => res.json())
      .then(res => {
        const message = Array.isArray(res.message) ? res.message[0] : res.message;
        toast.success(message || "Added to cart successfully!");
        fetch(`${apiUrl}cart/${email}`, headers).then(res => res.json())
          .then(cartRes => {
            dispatch(cartNav({ cart: cartRes.data.response.length }));
          })
          .catch(err => console.error(err));
      })
      .catch(err => {
        console.error(err);
        const errMsg = err.message;
        toast.error(Array.isArray(errMsg) ? errMsg[0] : errMsg || "Error adding product.");
      });
  };

  if (recommendedProducts.length === 0) return null;

  return (
    <div className="flex flex-col md:flex-row justify-center items-center lg:bg-[#f4ecff] h-fit lg:w-[85%] mx-auto p-1 md:p-3 rounded-2xl group/cards text-[#000000] mt-5 md:mt-0">

      <div className='w-full flex lg:hidden mb-2'>
        <h2 className="text-lg md:text-3xl flex w-full lg:w-fit lg:hidden items-center justify-start gap-1 ml-2 font-bold text-start">
          Recommended for You
        </h2>
        <button
          onClick={redirectToAllProducts}
          className="group lg:hidden flex justify-center text-[#5f41a0] text-sm items-center gap-2 w-60 lg:w-0 rounded-full font-bold transition-all duration-300 transform active:scale-95"
        >
          See all products
        </button>
      </div>

      <div className="w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:gap-1 w-full justify-center justify-items-center relative">
          {/* Botón Izquierda */}
          {currentIndex > 0 && (
            <div onClick={prevSlide} className="absolute group-hover/cards:flex hidden group cursor-pointer justify-center items-center bg-gray-50 border border-gray-200 hover:bg-white shadow-sm rounded-full transition-all duration-100 z-50 w-16 h-16 -left-8 top-1/2 bottom-1/2 my-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className='opacity-40 group-hover:opacity-100 transition-all duration-100 rotate-180' viewBox="0 0 24 24"><path d="m9 18 6-6-6-6" /></svg>
            </div>
          )}

          {/* Botón Derecha */}
          {currentIndex + 4 < recommendedProducts.length && (
            <div onClick={nextSlide} className="absolute group-hover/cards:flex hidden group cursor-pointer justify-center items-center bg-gray-50 border border-gray-200 hover:bg-white shadow-sm rounded-full transition-all duration-100 z-50 w-16 h-16 -right-8 top-1/2 bottom-1/2 my-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className='opacity-40 group-hover:opacity-100 transition-all duration-100' viewBox="0 0 24 24"><path d="m9 18 6-6-6-6" /></svg>
            </div>
          )}
          {displayedProducts.map((prod) => {
            const stockStatus = getStockStatus(prod.stock_Available);
            return (
              <div
                key={prod._id}
                onClick={() => navigate(`/products/${prod._id}`)}
                className="group flex flex-col justify-between w-full bg-white rounded-md border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden"
              >
                <div className='relative aspect-square w-full bg-slate-50 overflow-hidden group'>
                  <img
                    src={prod.photo}
                    alt={prod.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
                    <div className="flex gap-1 flex-wrap">
                      <span className={`text-[10px] sm:text-[11px] font-bold px-2 py-1 rounded-full ${stockStatus.color}`}>
                        {stockStatus.label}
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleAddToFavorites(e, prod._id)}
                      className="text-slate-900 hover:text-red-500 bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow-sm transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-2 flex flex-col flex-grow justify-between">
                  <div className="flex flex-col">
                    <h3 className="font-semibold text-slate-800 text-[13px] group-hover:text-[#7847E0] transition-colors leading-tight line-clamp-2">
                      {prod.name}
                    </h3>
                    <p className="text-[10px] mt-1 text-slate-500 line-clamp-3">{prod.description}</p>
                  </div>

                  <div className="flex items-end justify-between mt-3">
                    <div className="flex flex-col">
                      <span className="font-semibold text-lg tracking-tight sm:text-xl text-[#0e0424]">${" "}
                        {Intl.NumberFormat('en-US', { currency: 'USD' }).format(prod.price)}
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
              </div>
            );
          })}
        </div>
      </div>

      <div className="lg:flex hidden flex-col mt-3 lg:mt-8 md:mt-0 justify-center items-center w-1/2">
        <h3 className="text-2xl hidden md:text-3xl mb-4 md:flex items-center justify-start gap-2 font-normal text-start">
          Recommended for You
        </h3>
        <p className="text-slate-600 mb-3 lg:mb-6 text-center">Specially selected products.</p>
        <button
          onClick={redirectToAllProducts}
          className="group flex justify-center items-center gap-2 w-fit px-8 bg-[#000000] hover:bg-[#6333c7] text-white py-3 sm:py-3.5 rounded-xl font-bold shadow-md transition-all duration-300 transform active:scale-95"
        >
          See all products
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="transition-transform duration-300 group-hover:translate-x-1.5" viewBox="0 0 24 24">
            <path d="M5 12h14m-7-7 7 7-7 7" />
          </svg>
        </button>
      </div>

    </div>
  );
};

export default HomeRecommended;