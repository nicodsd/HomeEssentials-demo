import { useEffect } from 'react'
import HomeFirstComponent from "../components/HomeIndex/HomeFirstComponent";
import HomeOfferts from "../components/HomeIndex/HomeOfferts";
import HomeBuying from "../components/HomeIndex/HomeBuying";
import HomeCategory from "../components/HomeIndex/HomeCategory";
import HomeRecommended from "../components/HomeIndex/HomeRecommended";
import HomeNewArrivals from "../components/HomeIndex/HomeNewArrivals";
import cards_home from '../../store/actions/cardsHome'
import favNav_action from '../../store/actions/favNav';
import { useSelector, useDispatch } from "react-redux";
import MiddlePhotoSection from "../components/HomeIndex/MiddlePhotoSection";
import DiscountBanners from "../components/HomeIndex/DiscountBanners";
import { useNavigate } from "react-router-dom";
import Brands from "../components/HomeIndex/Brands";
import axios from 'axios';
import apiUrl from '../../../api';
import cartNav_action from '../../store/actions/cartNav';
import { ToastContainer, toast, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {

  let { cards_home_read } = cards_home
  const { cartNav } = cartNav_action;
  const { favNav } = favNav_action;
  const dispatch = useDispatch()
  let cards = useSelector(store => store.cardsHome.productsHome).slice(0, 5)
  const navigate = useNavigate()
  const redirectToAllProducts = () => {
    navigate('/allproducts');
  };
  useEffect(() => {
    if (cards.length === 0) {
      dispatch(cards_home_read())
    }
  }, [])
  const imageStyle = "h-[100%] w-[100%] object-cover hover:rounded-t-md cursor-pointer";
  const getStockStatus = (stock) => {
    if (stock === 0) return { label: "Out of stock", color: "bg-red-600 text-red-100" };
    if (stock <= 3) return { label: `Only ${stock} left!`, color: "bg-amber-600 text-amber-100" };
    return { label: "In Stock", color: "bg-emerald-700 text-emerald-100" };
  };

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
  console.log(cards)
  return (
    <div className='overflow-hidden bg-gray-200'>
      <div className='bg-gradient-to-br from-white via-[#9538ff3b] to-white flex flex-col gap-3'>
        <HomeFirstComponent />
        <HomeNewArrivals />
        <HomeOfferts />
        <HomeBuying />
      </div>
      <div className="h-fit pt-6 min-h-[10vh] bg-white flex flex-col items-center gap-6 pb-16">
        <MiddlePhotoSection />
        <DiscountBanners />
        <div className="flex flex-col md:flex-row group/cards justify-center items-center lg:bg-slate-100 h-fit lg:w-[85%] mx-auto p-1 md:p-3 rounded-2xl text-[#000]">

          <div className='w-full flex lg:hidden mb-2'>
            <h2 className="text-lg md:text-3xl flex w-full lg:w-fit lg:hidden items-center justify-start gap-1 ml-2 font-bold text-start">
              Best Sellers
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="#ff6739" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4" /></svg>
            </h2>
            <button
              onClick={redirectToAllProducts}
              className="group lg:hidden flex justify-center text-[#5f41a0] text-sm items-center gap-2 w-60 lg:w-0 rounded-full font-bold transition-all duration-300 transform active:scale-95"
            >
              See all products
            </button>
          </div>

          <div className="w-full">
            {/* Grilla Responsive Optimizada */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1 w-full justify-center justify-items-center relative">
              <div className="absolute group-hover/cards:flex hidden group cursor-pointer justify-center items-center bg-gray-50 border border-gray-200 hover:bg-white shadow-sm rounded-full transition-all duration-100 z-50 w-16 h-16 -right-8 top-1/2 bottom-1/2 my-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className='opacity-40 group-hover:opacity-100 transition-all duration-100' viewBox="0 0 24 24"><path d="m9 18 6-6-6-6" /></svg>
              </div>
              {cards.map((prod) => {
                const stockStatus = getStockStatus(prod.stock_Available);
                return (
                  <div
                    key={prod._id}
                    onClick={() => navigate(`/products/${prod._id}`)}
                    className="group flex flex-col justify-between w-full relative max-w-[260px] bg-white rounded-md border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden"
                  >

                    <div className='relative aspect-square w-full bg-slate-50 overflow-hidden'>
                      <img
                        src={prod.photo}
                        alt={prod.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <button
                        onClick={(e) => handleAddToFavorites(e, prod._id)}
                        className="absolute top-3 right-3 text-slate-900 hover:text-red-500 bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow-sm transition-colors z-10"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12" /></svg>
                      </button>
                      <span className={`absolute top-3 left-3 text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full ${stockStatus.color}`}>
                        {stockStatus.label}
                      </span>
                    </div>

                    {/* Contenido de la Tarjeta */}
                    <div className="p-2 flex flex-col flex-grow justify-between">
                      <h3 className="font-semibold text-slate-800 text-[15px] group-hover:text-[#7847E0] transition-colors leading-none line-clamp-2">
                        {prod.name}
                      </h3>
                      <p className="text-[11px] mt-1 text-slate-600 line-clamp-3">{prod.description}</p>
                      <div className="flex items-end justify-between mt-2">
                        <div className="flex flex-col">
                          <span className="font-semibold text-lg sm:text-xl text-[#0e0424]">${" "}
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
            <h3 className="text-2xl hidden md:text-3xl mb-4 md:flex items-center justify-start gap-2 font- text-start">
              Best Sellers <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4" /></svg>
            </h3>
            <p className="text-slate-600 mb-3 lg:mb-6 text-center">Find the best products for you</p>
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
        <HomeCategory />
        <HomeRecommended />
        <HomeNewArrivals />
        <Brands />
      </div>
      <ToastContainer transition={Flip} position="bottom-right" autoClose={2000} hideProgressBar theme="light" />
    </div>
  );
};

export default Home;