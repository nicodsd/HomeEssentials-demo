import React, { useEffect, useState } from "react";
import { Link as Anchor, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import apiUrl from "../../../../api";

import categories_actions from "../../../store/actions/categories";
import products_actions from "../../../store/actions/products";
import userLogin_action from "../../../store/actions/userLogin_action";
import favNav_action from '../../../store/actions/favNav';

import Favourites from "./Favourites.jsx";
import SearchBar from "./SearchBar";
import Carrito from "./Carrito";
import logo from "../../../../public/images/Logos/logo-2-b.png";

const { SaveUserLogin } = userLogin_action;

const FloatingNavBar = ({ isScrolled }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { categories_read } = categories_actions;
    const { products_read } = products_actions;

    // Selectores Redux
    const categories = useSelector(store => store.categories.categories || []);
    const manufacturers = useSelector(store => store.manufacturerHome.manufacturers || []);
    const count = useSelector(store => store.cartNavReducer.cart || { cart: 0 });
    const favCount = useSelector(store => store.favNavReducer.fav || { fav: 0 });
    const { userLogin } = useSelector(store => store);

    // Estados locales de control UI
    const [cartOpen, setCartOpen] = useState(false);
    const [favOpen, setFavOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [activePanel, setActivePanel] = useState(null);

    // Estados de filtros
    const [categoriesChecked, setCategoriesChecked] = useState([]);
    const [manufacturerChecked, setManufacturerChecked] = useState([]);

    // Obtención del usuario y token (Redux con fallback a LocalStorage)
    const userString = localStorage.getItem("user");
    const userFallback = userString && userString !== "undefined" ? JSON.parse(userString) : {};
    const tokenCurrent = userLogin.token || localStorage.getItem("token");
    const userCurrent = userLogin.user?.name ? userLogin.user : userFallback;
    const email = userCurrent?.email;
    const role = userCurrent?.role;

    // Handlers para Checkboxes de filtros
    const handleCategoryChange = (id) => {
        setCategoriesChecked(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleManufacturerChange = (id) => {
        setManufacturerChecked(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    useEffect(() => {
        if (categories.length === 0) {
            dispatch(categories_read());
        }
    }, [dispatch, categories.length, categories_read]);

    useEffect(() => {
        dispatch(products_read({
            categoriesCheked: categoriesChecked,
            manufacturerCheked: manufacturerChecked,
            filterPrice: 1
        }));
    }, [categoriesChecked, manufacturerChecked, dispatch, products_read]);

    const handleSignOut = () => {
        const headers = { headers: { authorization: `Bearer ${tokenCurrent}` } };
        fetch(`${apiUrl}auth/signout`, { ...headers, method: 'POST', body: JSON.stringify({ email }), headers: { ...headers?.headers, 'Content-Type': 'application/json' } }).then(res => res.json())
            .finally(() => {
                localStorage.clear();
                dispatch(SaveUserLogin({ token: "", user: {} }));
                setDropdownOpen(false);
                navigate("/");
            });
    };

    return (
        <>
            {/* Modals de carrito y favoritos */}
            <Carrito openModal={cartOpen} onCloseModal={() => setCartOpen(false)} />
            <Favourites openModal={favOpen} onCloseModal={() => setFavOpen(false)} />

            {/* --- FLOATING PILL CONTAINER --- */}
            <div
                className={`fixed left-0 right-0 mx-auto w-[90%] max-w-6xl h-14 rounded-xl bg-white shadow-xl border border-slate-200/60 px-6 flex items-center justify-between z-50 transition-all duration-300 ease-in-out select-none ${isScrolled ? "top-4 opacity-100 translate-y-0" : "-top-20 opacity-0 -translate-y-4 pointer-events-none"
                    }`}
                onMouseLeave={() => setActivePanel(null)}
            >
                {/* Izquierda: Logo Compacto */}
                <div className="flex items-center gap-4 shrink-0">
                    <img
                        className="w-16 object-contain cursor-pointer transition-transform active:scale-95"
                        onClick={() => navigate("/")}
                        src={logo}
                        alt="logo"
                    />
                </div>
                {/* Centro-Izquierda: Categorías & Fabricantes */}
                <div className="hidden md:flex items-center gap-4 text-xs font-semibold text-slate-700">
                    <Anchor to='/allproducts' onClick={() => setMenuIsOpen(false)} className="text-slate-700 font-medium hover:text-[#7847E0]">View All Products</Anchor>
                    <button
                        onMouseEnter={() => setActivePanel("categories")}
                        onClick={() => navigate("/allproducts")}
                        className={`px-3 py-1.5 rounded-full transition-all ${activePanel === "categories" ? "bg-indigo-600 text-white" : "hover:bg-slate-100"}`}
                    >
                        Categories
                    </button>
                    <button
                        onMouseEnter={() => setActivePanel("manufacturers")}
                        onClick={() => navigate("/allproducts")}
                        className={`px-3 py-1.5 rounded-full transition-all ${activePanel === "manufacturers" ? "bg-indigo-600 text-white" : "hover:bg-slate-100"}`}
                    >
                        Manufacturers
                    </button>
                </div>
                {/* Centro: Buscador Compacto */}
                <div className="flex-grow max-w-md mx-6 hidden sm:block">
                    <SearchBar />
                </div>
                {/* Derecha: Favoritos, Carrito, Usuario */}
                <div className="flex items-center gap-3 text-slate-700 shrink-0">
                    {/* Favoritos */}
                    <button
                        onClick={() => setFavOpen(true)}
                        className="relative p-1.5 hover:text-indigo-600 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12" />
                        </svg>
                        {favCount.fav > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
                                {favCount.fav}
                            </span>
                        )}
                    </button>
                    {/* Carrito */}
                    <button
                        onClick={() => count.cart > 0 && setCartOpen(true)}
                        className="relative p-1.5 hover:text-indigo-600 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60 60 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0" />
                        </svg>
                        {count.cart > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 bg-[#7847E0] text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
                                {count.cart}
                            </span>
                        )}
                    </button>
                    {/* Perfil Usuario */}
                    {!tokenCurrent ? (
                        <Anchor
                            to="/signin"
                            className="text-xs font-bold px-3 py-2 bg-[#7847E0] text-white rounded-full hover:bg-[#7847E0]/80 transition-all"
                        >
                            Sign In
                        </Anchor>
                    ) : (
                        <div className="relative">
                            <img
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                src={userCurrent.photo || "https://via.placeholder.com/150"}
                                className="w-7 h-7 rounded-full object-cover border border-[#7847E0] cursor-pointer"
                                alt="avatar"
                            />
                            {dropdownOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                                    <div className="absolute right-0 mt-3 w-40 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-20 animate-fadeIn text-xs">
                                        <button onClick={() => { navigate("/userPanel"); setDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 font-medium">User Panel</button>
                                        {(role === 1 || role === 2) && (
                                            <button onClick={() => { navigate("/admin/products"); setDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-indigo-600 hover:bg-indigo-50/50 font-semibold">Admin Panel</button>
                                        )}
                                        <hr className="border-slate-100 my-1" />
                                        <button onClick={handleSignOut} className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 font-medium">Sign Out</button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
                {/* --- PANEL DESPLEGABLE DINÁMICO (Categorías & Fabricantes) --- */}
                {activePanel && (
                    <div className="absolute top-[60px] left-0 w-full bg-white/95 backdrop-blur-md shadow-2xl border border-slate-200/50 rounded-xl p-6 z-40 animate-fadeIn text-slate-800">
                        {/* Fabricantes */}
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
                                                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
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
                        {/* Categorías */}
                        {activePanel === "categories" && (
                            <div className="animate-slideIn">
                                <h3 className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-3">
                                    Select Categories
                                </h3>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
                                    {categories.map((category) => {
                                        const isChecked = categoriesChecked.includes(category._id);
                                        return (
                                            <label
                                                key={category._id}
                                                className={`flex items-center justify-center px-3 py-2 rounded-xl cursor-pointer text-center text-[10px] font-medium tracking-wide transition-all border ${isChecked
                                                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                                                    : "border-slate-200 hover:bg-slate-50 text-slate-600"
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={isChecked}
                                                    onChange={() => handleCategoryChange(category._id)}
                                                />
                                                {category.name}
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};
export default FloatingNavBar;