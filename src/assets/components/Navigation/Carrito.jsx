import { useEffect, useState, useCallback } from 'react';
import apiUrl from '../../../../api';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux'; // <-- Añadido useSelector
import cartNav_action from '../../../store/actions/cartNav';
import { getSafeUser } from '../../../utils/authUtils';

const { cartNav } = cartNav_action;

function Carrito({ openModal, onCloseModal }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  // 1. SOLUCIÓN AL ERROR: Extraemos userLogin del store de Redux
  const { userLogin } = useSelector(store => store);

  const userFallback = getSafeUser();
  const tokenCurrent = userLogin?.token || localStorage.getItem('token');
  const userCurrent = userLogin?.user?.name ? userLogin.user : userFallback;
  const email = userCurrent?.email || "";
  const headers = { headers: { authorization: `Bearer ${tokenCurrent}` } };

  // Función reutilizable para obtener productos
  const fetchProducts = useCallback(async () => {
    if (!email) return; // Evitar peticiones nulas
    try {
      const res = await fetch(`${apiUrl}cart/${email}`, { headers: { authorization: `Bearer ${tokenCurrent}` } });
      const data = await res.json();
      setProducts(data.response || []);
      dispatch(cartNav({ cart: data.response?.length || 0 }));
    } catch (err) {
      console.error(err);
    }
  }, [email, tokenCurrent, dispatch]);

  useEffect(() => {
    if (openModal) fetchProducts();
  }, [openModal, fetchProducts]);

  // Eliminar producto
  const deleteProduct = async (product_id) => {
    try {
      const res = await fetch(
        `${apiUrl}cart?userEmail=${email}&productId=${product_id}`,
        { ...headers, method: 'DELETE' }
      );
      const data = await res.json();
      toast.error(data.message?.[0] || 'Product removed', { theme: 'colored' });
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const totalPurchase = (products || []).reduce(
    (acc, product) => acc + (product.product_id?.price || 0) * (product.quantity || 1),
    0
  );

  if (!openModal) return null;

  return (
    <div className="fixed inset-0 overflow-hidden z-50"> {/* Subido el z-index para sobreponerse al Navbar */}
      <div className="absolute inset-0 overflow-hidden flex">

        {/* Fondo oscuro traslúcido para cerrar */}
        <div
          className="absolute w-full h-full bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={() => onCloseModal(false)}
        ></div>

        <div className="absolute right-0 flex h-full w-full sm:w-96 flex-col overflow-y-scroll bg-white shadow-2xl animate-slideIn">
          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h1 className="text-lg font-bold text-slate-800">Shopping cart</h1>
              <img
                className="w-20 object-contain cursor-pointer transition-transform active:scale-95"
                src="/images/Logos/logo-2-b.png" // 2. SOLUCIÓN: Ruta de imagen corregida
                alt="Logo"
                onClick={() => {
                  navigate(`/`);
                  onCloseModal(false);
                }}
              />
            </div>

            <div className="mt-6">
              <div className="flow-root">
                <ul role="list" className="-my-6 divide-y divide-slate-100">
                  {products.length > 0 ? (
                    products.map((product) => (
                      <li key={product.product_id._id} className="flex py-6">
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-slate-100">
                          <img
                            src={product.product_id.photo}
                            alt={product.product_id.name}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <div className="ml-4 flex flex-1 flex-col">
                          <div className="flex flex-col justify-between h-full">
                            <div>
                              <p className="text-sm font-bold text-slate-800 line-clamp-2">
                                {product.product_id.name}
                              </p>
                              <p className="font-bold text-[#7847E0] mt-1">
                                {/* 3. SOLUCIÓN: Formato moneda unificado */}
                                {Intl.NumberFormat('en-US', {
                                  style: 'currency',
                                  currency: 'USD',
                                }).format(product.product_id.price)}
                              </p>
                            </div>
                            <div className="flex flex-1 items-end justify-between text-sm mt-2">
                              <p className="text-slate-500 font-medium">
                                Qty: {product.quantity}
                              </p>
                              <button
                                type="button"
                                className="font-bold text-red-500 hover:underline"
                                onClick={() => deleteProduct(product.product_id._id)}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <div className="py-10 flex flex-col items-center justify-center text-center gap-3">
                      <p className="text-slate-500 font-medium">Your cart is empty.</p>
                    </div>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 px-4 py-6 sm:px-6 flex-col items-center bg-slate-50">
            <div className="flex justify-between items-baseline text-base font-medium text-slate-900 mb-6">
              <p className="text-sm font-bold uppercase tracking-wider text-slate-400">Total Purchase</p>
              <p className="text-2xl font-black text-slate-900 tracking-tight">
                {Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(totalPurchase)}
              </p>
            </div>

            <div className="w-full flex flex-col gap-3">
              <button
                onClick={() => {
                  if (!email) {
                    toast.error("Please sign in to checkout.");
                    return;
                  }
                  navigate(`/cart/${btoa(email)}`);
                  onCloseModal(false);
                }}
                disabled={products.length === 0}
                className="flex items-center justify-center w-full rounded-xl border border-transparent bg-[#7847E0] px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#6333c7] transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
              >
                Checkout
              </button>

              <button
                type="button"
                className="font-bold text-sm text-[#7847E0] hover:underline flex items-center justify-center gap-2 mt-2"
                onClick={() => {
                  navigate(`/allproducts`);
                  onCloseModal(false);
                }}
              >
                Continue Shopping
                <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        transition={Flip}
        position="bottom-right"
        autoClose={1000}
        hideProgressBar
        theme="light"
      />
    </div>
  );
}

export default Carrito;