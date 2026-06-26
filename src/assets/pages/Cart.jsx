import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import apiUrl from '../../../api';
import { useDispatch, useSelector } from 'react-redux';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { ToastContainer, toast, Flip } from 'react-toastify';
import cartNav_action from '../../store/actions/cartNav.js';
import cards_home from '../../store/actions/cardsHome.js';
import 'react-toastify/dist/ReactToastify.css';

const { cartNav } = cartNav_action;

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { email: encodedEmail } = useParams();

    // Inicializar Mercado Pago
    useEffect(() => {
        initMercadoPago('TEST-043a661b-8206-4019-af80-17e2ff37dc98');
    }, []);

    const email = useMemo(() => {
        try { return atob(encodedEmail); } catch { return ""; }
    }, [encodedEmail]);

    const [products, setProducts] = useState([]);
    const [hasFetched, setHasFetched] = useState(false);
    const [preferenceId, setPreferenceId] = useState(false);
    const [loadingPayment, setLoadingPayment] = useState(false);

    // Estados de envío directos (Sin fricción)
    const [address, setAddress] = useState("");
    const [country, setCountry] = useState("");
    const [dni, setDni] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const token = localStorage.getItem('token');
    const headers = useMemo(() => ({ headers: { 'authorization': `Bearer ${token}` } }), [token]);

    const { cards_home_read } = cards_home;
    const recommendedProducts = useSelector(store => store.cardsHome.productsHome || []);

    useEffect(() => {
        if (recommendedProducts.length === 0) {
            dispatch(cards_home_read());
        }
    }, [dispatch, cards_home_read, recommendedProducts.length]);

    const cartProductIds = useMemo(() => {
        if (!hasFetched) {
            try {
                return JSON.parse(localStorage.getItem('cartProductIds')) || [];
            } catch {
                return [];
            }
        }
        return products.map(p => p.product_id?._id);
    }, [products, hasFetched]);
    
    useEffect(() => {
        if (hasFetched) {
            localStorage.setItem('cartProductIds', JSON.stringify(cartProductIds));
        }
    }, [cartProductIds, hasFetched]);

    const recommendations = useMemo(() => {
        return recommendedProducts.filter(p => !cartProductIds.includes(p._id)).slice(0, 4);
    }, [recommendedProducts, cartProductIds]);

    const fetchCartItems = useCallback(() => {
        if (!email) return;
        axios.get(`${apiUrl}cart/${email}`, headers)
            .then(res => {
                const cartItems = res.data.response || [];
                setProducts(cartItems);
                setHasFetched(true);
                dispatch(cartNav({ cart: cartItems.length }));
            })
            .catch(err => console.error(err));
    }, [email, headers, dispatch]);

    useEffect(() => {
        fetchCartItems();
    }, [fetchCartItems]);

    const totalPurchase = useMemo(() => {
        return products.reduce((acc, current) => {
            const price = current.product_id?.price || 0;
            return acc + (price * current.quantity);
        }, 0);
    }, [products]);

    const addProduct = (product_id) => {
        axios.post(`${apiUrl}cart/create`, { userEmail: email, productId: product_id }, headers)
            .then(() => fetchCartItems())
            .catch(err => console.error(err));
    };

    const substractProduct = (product_id) => {
        axios.put(`${apiUrl}cart/subtract`, { userEmail: email, productId: product_id }, headers)
            .then(() => fetchCartItems())
            .catch(err => console.error(err));
    };

    const deleteProduct = (product_id) => {
        axios.delete(`${apiUrl}cart?userEmail=${email}&productId=${product_id}`, headers)
            .then(() => fetchCartItems())
            .catch(err => console.error(err));
    };

    // Procesar e integrar el botón de Mercado Pago al instante
    const processCheckout = async (e) => {
        e.preventDefault();
        if (!address || !country || !dni || !phoneNumber) {
            toast.error("Please fill in all delivery fields to unlock payment.");
            return;
        }

        try {
            setLoadingPayment(true);
            const body = { address, country, dni, phoneNumber };

            // 1. Confirmar orden
            await axios.post(`${apiUrl}cart/confirm?userEmail=${email}`, body, headers);

            // 2. Generar link de Mercado Pago
            const response = await axios.post(`${apiUrl}payment`, {
                unit_price: Number(totalPurchase.toFixed(2)),
            });

            if (response.data?.preferenceId) {
                setPreferenceId(response.data.preferenceId);
                toast.success("Payment method unlocked!");
            }
        } catch (error) {
            console.error(error);
            toast.error("Checkout process failed. Try again.");
        } finally {
            setLoadingPayment(false);
        }
    };

    return (
        <div className="w-full py-10 bg-slate-50 md:py-20 px-4 select-none selection:bg-[#7847E0] selection:text-white">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 items-start">

                {/* 🛒 PANEL IZQUIERDO: Lista de Productos */}
                <div className="w-full lg:w-3/5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                    <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4">
                        Shopping Cart ({products.length})
                    </h2>

                    {products.length > 0 ? (
                        products.map(product => (
                            <div key={product.product_id?._id} className="py-4 flex flex-col sm:flex-row justify-between items-center border-b border-slate-50 gap-4">
                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                    <img className="w-16 h-16 rounded-xl object-cover border" src={product.product_id?.photo} alt="" />
                                    <div className="text-left">
                                        <p className="font-bold text-slate-800 text-sm line-clamp-1">{product.product_id?.name}</p>
                                        <button onClick={() => deleteProduct(product.product_id?._id)} className="text-xs text-red-500 font-semibold mt-1 hover:underline">
                                            Remove
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 h-8 w-24 overflow-hidden">
                                        <button className="w-1/3 text-sm font-bold hover:bg-slate-200 h-full" onClick={() => substractProduct(product.product_id?._id)}>–</button>
                                        <p className="w-1/3 text-xs font-bold text-center">{product.quantity}</p>
                                        <button className="w-1/3 text-sm font-bold hover:bg-slate-200 h-full" onClick={() => addProduct(product.product_id?._id)}>+</button>
                                    </div>
                                    <p className="font-bold text-sm text-slate-900 w-20 text-right">
                                        {Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.product_id?.price * product.quantity)}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 space-y-3">
                            <p className="text-slate-400 font-medium">Your cart is empty.</p>
                            <button onClick={() => navigate('/allproducts')} className="text-sm font-bold text-[#7847E0] underline">Shop now</button>
                        </div>
                    )}

                    {/* RECOMENDACIONES DE PRODUCTOS */}
                    {products.length > 0 && recommendations.length > 0 && (
                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">You might also like</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {recommendations.map(prod => (
                                    <div 
                                        key={prod._id}
                                        onClick={() => navigate(`/products/${prod._id}`)}
                                        className="group flex flex-col justify-between w-full bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden"
                                    >
                                        <div className='relative aspect-square w-full bg-slate-50 overflow-hidden'>
                                            <img
                                                src={prod.photo}
                                                alt={prod.name}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="p-3 flex flex-col flex-grow justify-between gap-2">
                                            <h4 className="font-semibold text-slate-800 text-xs group-hover:text-[#7847E0] transition-colors leading-snug line-clamp-2">
                                                {prod.name}
                                            </h4>
                                            <div className="flex items-end justify-between mt-1">
                                                <span className="font-bold text-sm text-[#7847E0]">
                                                    {Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(prod.price)}
                                                </span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        addProduct(prod._id);
                                                        toast.success("Added to cart!");
                                                    }}
                                                    className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-[#7847E0] flex items-center justify-center transition-colors shrink-0"
                                                >
                                                    <svg fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5 text-slate-600 group-hover:text-white transition-colors" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ⚡ PANEL DERECHO: Checkout Sin Fricción (One-Step) */}
                {products.length > 0 && (
                    <div className="w-full lg:w-2/5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 lg:sticky lg:top-24">
                        <h2 className="text-lg font-bold text-slate-800">Delivery & Payment</h2>

                        {/* Formulario rápido directo en la interfaz */}
                        <form onSubmit={processCheckout} className="space-y-3">
                            <input
                                type="text" placeholder="Shipping Address *" required value={address}
                                onChange={e => setAddress(e.target.value)} disabled={preferenceId}
                                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-indigo-500 outline-none transition-all disabled:opacity-60"
                            />
                            <input
                                type="text" placeholder="Country *" required value={country}
                                onChange={e => setCountry(e.target.value)} disabled={preferenceId}
                                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-indigo-500 outline-none transition-all disabled:opacity-60"
                            />
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="text" placeholder="DNI / Tax ID *" required value={dni}
                                    onChange={e => setDni(e.target.value)} disabled={preferenceId}
                                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-indigo-500 outline-none transition-all disabled:opacity-60"
                                />
                                <input
                                    type="tel" placeholder="Phone *" required value={phoneNumber}
                                    onChange={e => setPhoneNumber(e.target.value)} disabled={preferenceId}
                                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-indigo-500 outline-none transition-all disabled:opacity-60"
                                />
                            </div>

                            {/* Totalizador de Compra */}
                            <div className="pt-4 border-t border-slate-100 flex items-baseline justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total to pay:</span>
                                <span className="text-2xl font-black text-slate-900 tracking-tight">
                                    {Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalPurchase)}
                                </span>
                            </div>

                            {/* Botón dinámico e inteligente Mercado Pago */}
                            <div className="pt-2">
                                {preferenceId ? (
                                    <div className="animate-scaleUp w-full">
                                        <Wallet initialization={{ preferenceId, redirectMode: 'self' }} />
                                    </div>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={loadingPayment}
                                        className="w-full py-3 bg-[#009EE3] hover:bg-[#0086c3] text-white font-bold rounded-xl text-sm uppercase tracking-wider shadow-sm transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {loadingPayment ? "Processing..." : "Unlock Mercado Pago"}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                )}

            </div>
            <ToastContainer transition={Flip} position="bottom-right" autoClose={1200} hideProgressBar theme="light" />
        </div>
    );
};

export default Cart;