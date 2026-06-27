import { Link as Anchor, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import categories_actions from '../../../store/actions/categories';
import userLogin_action from '../../../store/actions/userLogin_action';
import favNav_action from '../../../store/actions/favNav';
import Favourites from "./Favourites.jsx";
import SearchBar from "./SearchBar";
import Carrito from "./Carrito";
import CategoriesNav from "./CategoriesNav";
import logo from "../../../../public/images/Logos/logo-2-b.png";
import axios from '../../../utils/fetchWrapper.js';
import apiUrl from '../../../../api';

const { SaveUserLogin } = userLogin_action;
const { favNav } = favNav_action;

const SearchAndLogoNavbar = () => {
  const { categories_read } = categories_actions;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Selectores Redux
  const categories = useSelector(store => store.categories.categories || []);
  const count = useSelector(store => store.cartNavReducer.cart || { cart: 0 });
  const favCount = useSelector(store => store.favNavReducer.fav || { fav: 0 });
  const { userLogin } = useSelector(store => store);

  // Estados locales de control UI
  const [cartOpen, setCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [favOpen, setFavOpen] = useState(false);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [seeButtonsUser, setSeeButtonsUser] = useState(true);

  // Obtención unificada del usuario y token (Redux con fallback a LocalStorage)
  const userFallback = JSON.parse(localStorage.getItem('user')) || {};
  const tokenCurrent = userLogin.token || localStorage.getItem('token');
  const userCurrent = userLogin.user?.name ? userLogin.user : userFallback;
  const email = userCurrent?.email;
  const role = userCurrent?.role;

  // Cargar categorías al inicio
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(categories_read());
    }
  }, [dispatch, categories.length, categories_read]);

  // Capturar productos del carrito si el usuario está logueado
  useEffect(() => {
    if (email && tokenCurrent) {
      const headers = { headers: { 'authorization': `Bearer ${tokenCurrent}` } };
      axios.get(`${apiUrl}cart/${email}`, headers)
        .catch(err => console.error("Error fetching cart data:", err));

      axios.get(`${apiUrl}favorites?userEmail=${email}`, headers)
        .then(res => dispatch(favNav({ fav: res.data.response.length })))
        .catch(err => console.error("Error fetching favorites data:", err));
    }
  }, [email, tokenCurrent]);

  const handlebutton = (boolean) => {
    boolean ? setSeeButtonsUser(false) : setSeeButtonsUser(true);
  };

  const handleSignOut = () => {
    const headers = { headers: { 'authorization': `Bearer ${tokenCurrent}` } };
    axios.post(`${apiUrl}auth/signout`, { email }, headers)
      .finally(() => {
        localStorage.clear();
        dispatch(SaveUserLogin({ token: "", user: {} }));
        setDropdownOpen(false);
        setMenuIsOpen(false);
        navigate('/');
      })
      .catch(err => alert(err));
  };

  return (
    <>
      {/* Componentes modales del carrito y favoritos */}
      <Carrito openModal={cartOpen} onCloseModal={() => setCartOpen(false)} />
      <Favourites openModal={favOpen} onCloseModal={() => setFavOpen(false)} />

      {/* --- DESKTOP & TABLET CONTAINER --- */}
      <nav className="mx-auto w-full h-[60px] flex items-center justify-between px-6 lg:px-9 z-40 shadow-sm bg-white">

        {/* 1. Bloque Izquierdo: Logo */}
        <div className="flex items-center shrink-0">
          <img
            className="w-24 object-contain cursor-pointer transition-transform active:scale-95"
            onClick={() => navigate('/')}
            src={logo}
            alt="logo"
          />
        </div>

        {/* 2. Bloque Central: Botones de categorías y fabricantes (Oculto en móvil) */}
        <div className="hidden lg:flex flex-grow justify-center">
          <CategoriesNav isScrolled={isScrolled} />
        </div>

        {/* 3. Bloque Derecho: Iconos Mobile y Acciones Desktop */}
        <div className="flex items-center gap-2 lg:gap-4 text-slate-700 shrink-0">

          {/* Iconos Mobile (Búsqueda y Hamburguesa - Ocultos en Desktop) */}
          <div className="flex lg:hidden items-center gap-1">
            <button
              className="text-slate-700 hover:text-[#7847E0] transition-colors p-2"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" className="w-6 h-6" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607" /></svg>
            </button>
            <button
              className="text-slate-700 hover:text-[#7847E0] transition-colors p-2"
              onClick={() => setMenuIsOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" className="w-6 h-6" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>

          {/* Acciones de Usuario (Favoritos, Carrito, Perfil - Ocultos en Mobile) */}
          <div className="hidden lg:flex items-center gap-4 text-slate-700">

            {/* Favoritos */}
            <button
              onClick={() => setFavOpen(true)}
              className="relative flex cursor-pointer items-center gap-1.5 hover:text-[#7847E0] font-medium transition-colors text-sm xl:text-base p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12" />
              </svg>
              {favCount.fav > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                  {favCount.fav}
                </span>
              )}
            </button>

            {/* Icono Carrito con Badge flotante */}
            <button
              onClick={() => count.cart > 0 && setCartOpen(true)}
              className="relative cursor-pointer p-2 text-slate-700 hover:text-[#7847E0] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60 60 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0" />
              </svg>
              {count.cart > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#7847E0] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm animate-bounce">
                  {count.cart}
                </span>
              )}
            </button>

            {/* Autenticación / Dropdown de Perfil */}
            {!tokenCurrent ? (
              <Anchor
                to="/signin"
                className="flex items-center gap-2 px-6 py-2 text-black text-md font-semibold hover:opacity-40 hover:cursor-pointer transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#7847E0"
                  className="w-10 h-10"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Sign In
              </Anchor>
            ) : (
              <div className="relative">
                <div
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 cursor-pointer select-none py-1.5 px-2 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <img
                    src={userCurrent.photo || "https://via.placeholder.com/150"}
                    className="w-8 h-8 rounded-full object-cover border border-[#7847E0]"
                    alt="avatar"
                  />
                  <span className="text-sm font-medium max-w-[120px] truncate">
                    {userCurrent.name}
                  </span>
                  <svg className={`w-4 h-4 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Menú Desplegable de Usuario */}
                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-20 animate-fadeIn">
                      <button onClick={() => { navigate('/userPanel'); setDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium">User Panel</button>
                      {(role === 1 || role === 2) && (
                        <button onClick={() => { navigate('/admin/products'); setDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50/50 font-semibold">Admin Panel</button>
                      )}
                      <hr className="border-slate-100 my-1" />
                      <button onClick={handleSignOut} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 font-medium">Sign Out</button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Barra de búsqueda exclusiva para mobile integrada justo abajo del navbar */}
      {mobileSearchOpen && (
        <div className="p-4 bg-slate-50 border-b border-slate-100 block lg:hidden animate-slideIn">
          <SearchBar />
        </div>
      )}

      {/* --- 📱 NAVBAR LATERAL RESPONSIVE (DRAWER) --- */}
      {menuIsOpen && (
        <div className="fixed inset-0 z-50 flex scroll-container">
          {/* Fondo traslúcido */}
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMenuIsOpen(false)} />

          {/* Contenedor del panel */}
          <div className="relative w-4/5 max-w-sm bg-white scroll-container h-full p-6 flex flex-col justify-between shadow-2xl overflow-y-auto animate-slideIn">
            <div>
              {/* Encabezado del menú */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <img className="w-20 object-contain" src={logo} alt="logo" />
                <button className="p-2 text-slate-500 hover:text-black" onClick={() => setMenuIsOpen(false)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Bloque de Usuario en Mobile */}
              <div className="py-6 border-b border-slate-100">
                {tokenCurrent ? (
                  <div className="flex items-center gap-3">
                    <img src={userCurrent.photo} className="w-10 h-10 rounded-full object-cover border border-[#7847E0]" alt="avatar" />
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{userCurrent.name} {userCurrent.lastName}</p>
                      <button onClick={() => { navigate('/userPanel'); setMenuIsOpen(false); }} className="text-xs text-[#7847E0] font-medium underline">View profile</button>
                    </div>
                  </div>
                ) : (
                  <Anchor
                    to="/signin" onClick={() => setMenuIsOpen(false)}
                    className="w-full flex justify-center py-2.5 bg-[#7847E0] text-white rounded-xl font-semibold text-sm"
                  >
                    Enter account
                  </Anchor>
                )}
              </div>

              {/* Enlaces de Tienda y Categorías */}
              <div className="flex flex-col gap-4 py-6 border-b border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Store</h4>
                <Anchor to='/allproducts' onClick={() => setMenuIsOpen(false)} className="text-slate-700 font-medium hover:text-[#7847E0] text-base">View All Products</Anchor>
                <div className="flex flex-col">
                  <button
                    onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                    className="flex items-center justify-between text-slate-700 font-medium hover:text-[#7847E0] text-base w-full text-left"
                  >
                    Categories
                    <svg className={`w-4 h-4 transition-transform ${mobileCategoriesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {mobileCategoriesOpen && (
                    <div className="flex flex-col gap-3 mt-3 pl-4 border-l-2 border-[#7847E0]/20 animate-fadeIn">
                      {categories.map(cat => (
                        <Anchor
                          key={cat._id}
                          to={`/allproducts/${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                          onClick={() => setMenuIsOpen(false)}
                          className="text-slate-600 text-sm hover:text-[#7847E0] transition-colors"
                        >
                          {cat.name}
                        </Anchor>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Enlaces Corporativos */}
              <div className="flex flex-col gap-4 py-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Company</h4>
                <Anchor to='/about' onClick={() => setMenuIsOpen(false)} className="text-slate-700 font-medium hover:text-[#7847E0] text-base">About Us</Anchor>
                <Anchor to='/contact' onClick={() => setMenuIsOpen(false)} className="text-slate-700 font-medium hover:text-[#7847E0] text-base">Contact</Anchor>
                <Anchor to='/attendance' onClick={() => setMenuIsOpen(false)} className="text-slate-700 font-medium hover:text-[#7847E0] text-base">Attendance Support</Anchor>
              </div>
            </div>

            {/* Bloque Inferior: Cerrar sesión o Soporte */}
            <div className="pt-6 border-t border-slate-100 flex flex-col gap-4">
              <a href="tel:+5213312345678" className="text-center text-xs font-bold p-3 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                Call Center Support
              </a>
              {tokenCurrent && (
                <button
                  onClick={handleSignOut}
                  className="w-full text-center py-2.5 text-sm font-bold text-red-500 rounded-xl hover:bg-red-50 transition-colors"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchAndLogoNavbar;