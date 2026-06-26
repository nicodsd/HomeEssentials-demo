import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import apiUrl from '../../../../api';
import productOne_action from '../../../store/actions/productOne';

import cartNav_action from '../../../store/actions/cartNav';
import favNav_action from '../../../store/actions/favNav';
import { ToastContainer, toast, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { cartNav } = cartNav_action;
const { favNav } = favNav_action;
const { productOne } = productOne_action;

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Inicialización correcta como objeto vacío
  const [prodOne, setProdOne] = useState({});
  const [selectedColor, setSelectedColor] = useState("green");

  // Auth local fallbacks unificados
  const user = JSON.parse(localStorage.getItem('user')) || null;
  const token = localStorage.getItem('token') || "";
  const email = user?.email || "";
  const headers = { headers: { 'authorization': `Bearer ${token}` } };

  // Traer el detalle del producto al cargar el ID
  useEffect(() => {
    axios.get(`${apiUrl}products/${id}`)
      .then(res => {
        const productData = res.data.response;
        setProdOne(productData);
        dispatch(productOne({
          name: productData.name,
          photo: productData.photo,
          description: productData.description
        }));
      })
      .catch(err => console.error("Error fetching product data:", err));
  }, [id, dispatch, productOne]);

  // Handler: Agregar Producto al carrito
  const addProduct = (product_id) => {
    if (!token) {
      toast.warning("Please sign in to add products to your cart.");
      return;
    }

    const data = { userEmail: email, productId: product_id };

    axios.post(`${apiUrl}cart/create`, data, headers)
      .then(res => {
        const message = Array.isArray(res.data.message) ? res.data.message[0] : res.data.message;
        toast.success(message || "Added to cart successfully!");

        // Re-sincronizar el número total del carrito global
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

  // Handler: Agregar a Favoritos
  const addFavorites = (product_id) => {
    if (!token) {
      toast.warning("Please sign in to save favorites.");
      return;
    }

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

  // Cálculo seguro del plan de cuotas mensuales
  const monthlyInstallments = prodOne.price ? (prodOne.price / 12).toFixed(2) : "0.00";

  return (
    <section className="w-full bg-white text-slate-800 min-h-screen selection:bg-[#7847E0] selection:text-white">
      <div className="relative mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Título de Producto & Breadcrumbs simulado */}
        <div className="mb-6">
          <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase">Product Detail</span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1 lg:text-4xl">
            {prodOne.name || "Loading product..."}
          </h1>
          <p className="mt-2 text-xs font-semibold text-slate-400 bg-slate-100 w-fit px-2 py-1 rounded">
            SKU: #PROD-{id?.slice(-6).toUpperCase()}
          </p>
        </div>

        {/* Distribución en grilla moderna */}
        <div className="grid gap-8 lg:grid-cols-5 items-start">

          {/* Bloque Izquierdo: Galería de Imágenes (Ocupa 3 de 5 columnas) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="relative overflow-hidden rounded-2xl bg-slate-50 border border-slate-100 shadow-sm aspect-[4/3] max-h-[500px]">
              <img
                alt={prodOne.name}
                src={prodOne.photo}
                className="h-full w-full object-contain mx-auto transition-transform duration-300 hover:scale-105"
              />

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 inline-flex items-center rounded-full bg-slate-900/80 backdrop-blur-sm px-4 py-1.5 text-white shadow-sm pointer-events-none">
                <svg className="h-3.5 w-3.5 text-indigo-400 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="ms-2 text-[11px] font-bold tracking-wide uppercase">Hover to zoom</span>
              </div>
            </div>

            {/* Carrusel de vistas miniatura */}
            <div className="flex gap-3 overflow-x-auto py-1">
              {[1, 2, 3, 4].map((thumb) => (
                <button
                  key={thumb}
                  className="w-20 h-20 rounded-xl border-2 border-slate-100 hover:border-[#7847E0] focus:border-[#7847E0] overflow-hidden bg-slate-50 shadow-sm transition-all flex-shrink-0"
                >
                  <img alt="Thumbnail" src={prodOne.photo} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Bloque Derecho: Formulario y Compra (Ocupa 2 de 5 columnas) */}
          <div className="lg:col-span-2 lg:sticky lg:top-24 bg-slate-50 border border-slate-100 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">

            {/* Selector de variantes (Color) */}
            <div>
              <button
                type="button"
                onClick={() => addFavorites(prodOne._id)}
                className="absolute top-3 right-3 text-slate-700 active:scale-[0.99] transition-all transform"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12" />
                </svg>
              </button>
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-3">
                Select Color:
              </h3>
              <div className="flex flex-wrap gap-3">
                {["green", "blue", "pink", "red", "indigo"].map((color) => (
                  <label key={color} className="cursor-pointer">
                    <input
                      type="radio"
                      name="color"
                      value={color}
                      checked={selectedColor === color}
                      onChange={() => setSelectedColor(color)}
                      className="sr-only"
                    />
                    <span
                      className={`block h-7 w-7 rounded-full border border-white ring-2 transition-all transform active:scale-90 ${selectedColor === color ? 'ring-[#7847E0] scale-110 shadow-sm' : 'ring-slate-200'
                        }`}
                      style={{ backgroundColor: `${color === 'indigo' ? '#4f46e5' : color === 'pink' ? '#db2777' : color === 'red' ? '#dc2626' : color === 'blue' ? '#2563eb' : '#15803d'}` }}
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Plan de Financiamiento */}
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
              <p className="text-xs sm:text-sm text-indigo-950 font-medium leading-relaxed">
                🚀 Pay as low as <span className="font-extrabold text-indigo-600">${monthlyInstallments}/mo</span> with 0% APR in 12 interest-free installments.
              </p>
              <button type="button" className="mt-1.5 text-xs font-bold text-[#7847E0] hover:underline block">
                Find out more details →
              </button>
            </div>

            {/* Precio Final */}
            <div className="pt-2">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Total Price</span>
              <p className="text-3xl font-semibold text-slate-900 tracking-tight mt-1">
                {prodOne.price ? Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(prodOne.price) : "$0.00"}
              </p>
            </div>

            {/* Botones de Acción principal */}
            <div className="flex flex-col gap-3 pt-2">
              <button
                type="button"
                onClick={() => addProduct(prodOne._id)}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider text-white bg-orange-500 hover:bg-orange-600 shadow-md shadow-orange-100 active:scale-[0.99] transition-all transform"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="lucide lucide-shopping-cart-icon lucide-shopping-cart" viewBox="0 0 24 24"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>Add to cart
              </button>
            </div>
          </div>

          {/* Fila Inferior: Descripción Completa */}
          <div className="lg:col-span-3 pt-6 border-t border-slate-100 mt-4">
            <h3 className="text-lg font-bold text-slate-900 mb-3">Product Description</h3>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed whitespace-pre-line">
              {prodOne.description || "No description available for this item."}
            </p>
          </div>
        </div>
      </div>

      <ToastContainer
        transition={Flip}
        position="bottom-right"
        autoClose={2000}
        hideProgressBar
        theme="light"
      />
    </section>
  );
}