import apiUrl from '../../../../api'
import { TbTrashX } from 'react-icons/tb'
import { useSelector, useDispatch } from "react-redux";
import favNav_action from '../../../store/actions/favNav';
import { useState, useEffect } from 'react'
import { ToastContainer, toast, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getSafeUser } from '../../../utils/authUtils';

function Favourites({ openModal, onCloseModal }) {
    const { userLogin } = useSelector(store => store)
    const dispatch = useDispatch();
    const { favNav } = favNav_action;

    const userFallback = getSafeUser();
    const tokenCurrent = userLogin?.token || localStorage.getItem('token');
    const userCurrent = userLogin?.user?.name ? userLogin.user : userFallback;
    const email = userCurrent?.email || "";
    const headers = { headers: { authorization: `Bearer ${tokenCurrent}` } };
    const [favorites, setFavorite] = useState([]);

    useEffect(() => {
        if (openModal) {
            console.log("Favourites: openModal=true, email=", email);
            if (email) {
                fetch(`${apiUrl}favorites?userEmail=${email}`, headers)
                    .then(res => res.json())
                    .then(res => {
                        console.log("Favourites: backend response:", res);
                        const data = res.response || [];
                        setFavorite(data);
                        dispatch(favNav({ fav: data.length }));
                    })
                    .catch(err => console.error("Favourites fetch error:", err));
            } else {
                console.warn("Favourites: no email found, skipping fetch.");
            }
        }
    }, [openModal, email]);

    const reload = () => {
        if (!email) return;
        fetch(`${apiUrl}favorites?userEmail=${email}`, headers).then(res => res.json()).then(res => {
            const data = res.response || [];
            setFavorite(data);
            dispatch(favNav({ fav: data.length }));
        }).catch(err => console.log(err));
    };

    const remove = (product_id) => {
        fetch(`${apiUrl}favorites?userEmail=${email}&productId=${product_id}`, { ...headers, method: 'DELETE' }).then(res => res.json()).then(res => {
            reload()
            toast.warn("Product removed from favorites", {
                theme: "colored",
            })
        }).catch(err => console.log(err))
    }
    const removeAll = () => {
        fetch(`${apiUrl}favorites/deleteAll?userEmail=${email}`, { ...headers, method: 'DELETE' }).then(res => res.json()).then(res => {
            reload()
            toast.warn("All product removed from favorites", {
                theme: "colored",
            })
        }).catch(err => {
            toast.error("No product in favorites", {
                theme: "colored",
            })
        })
    }
    if (!openModal) return null
    return (
        <div className='w-full'>
            <div className='w-full h-screen top-0 z-40 fixed'
                onClick={() => onCloseModal(false)}></div>
            <div className="fixed transition-all z-50 gap-3 top-[80px] sm:top-[95px] right-4 sm:right-16 mt-2 bg-[#ffffff] w-[22rem] shadow-[0_4px_12px_rgba(0,0,0,0.07)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)] rounded-md text-[#393939] items-center flex flex-col h-fit py-[1rem] max-h-[80vh] overflow-y-auto">
                {favorites && favorites.length > 0 ? (
                    favorites.map((product, index) => {
                        if (!product || !product.product_id) return null;
                        return (
                        <div key={product.product_id._id || index} className="w-[90%] cursor-pointer bg-white  shadow-[0_0_3px_rgba(0,0,0,0.20)] relative hover:shadow-[0_1px_7px_rgba(0,0,0,0.2)] rounded-md h-fit">
                            <div className="font-normal my-2 text-[#393939] flex items-center justify-between min-h-[3rem] h-fit px-3">
                                <img className="w-[2.8rem] h-[3rem] object-cover rounded-md " src={product.product_id.photo || ''} alt="" />
                                <div className="w-[8rem]">
                                    <h2 className='text-xs ml-1'>{product.product_id.name || 'Unknown Product'}</h2>
                                </div>
                                <div className='text-md flex justify-end pr-2 w-[6.5rem]'>
                                    <p>$ {product.product_id.price || 0}</p>
                                </div>
                            </div>
                            <div
                                className='flex text-[#ff3b3b] cursor-pointer rounded-b-md justify-end text-xs items-center pr-2 h-6'>
                                <div
                                    className='w-full flex items-center justify-end'
                                    onClick={() => remove(product.product_id._id)}>
                                    <TbTrashX className='text-[1.2rem] hover:text-[.95rem] hover:w-full hover:h-full hover:rounded-md hover:absolute bottom-0 right-0 hover:bg-[#ff3b3b81] hover:backdrop-blur-[3px]  hover:text-white' />
                                </div>
                            </div>
                        </div>
                    )})
                ) : (
                    <div className="py-4 w-full flex flex-col items-center justify-center text-center">
                        <p className="text-slate-500 font-medium text-sm">No favorites found.</p>
                    </div>
                )}

                <button className='duration-100 hover:text-white text-sm w-[7.5rem] flex items-center justify-center rounded-lg cursor-pointer h-[2rem] '
                    onClick={() => removeAll()}>
                    <p>Remove all</p>
                </button>
                <ToastContainer
                    transition={Flip}
                    position="bottom-right"
                    autoClose={600}
                    hideProgressBar
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark" />
            </div>
        </div>
    )
}

export default Favourites