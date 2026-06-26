import { BsInstagram, BsGithub } from "react-icons/bs";
import React, { useEffect } from "react";
import { FaFacebookF, FaTwitter, FaYoutube } from "react-icons/fa";
import { Link as Anchor } from "react-router-dom";
import categories_actions from '../../store/actions/categories';
import { useSelector, useDispatch } from "react-redux";
import HomeCurriculum from "./HomeIndex/HomeCurriculum";

const Footer = () => {
  const { categories_read } = categories_actions;
  const dispatch = useDispatch();
  const categories = useSelector(store => store.categories.categories || []);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(categories_read())
    }
  }, [dispatch, categories.length, categories_read]);
  // Array de creadores para renderizar los créditos de GitHub limpiamente

  return (
    <footer className="pt-20 pb-4 border-t text-slate-600 transition-all">
      <div className="w-[87%] mx-auto px-6 lg:px-8">

        {/* Grilla Principal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 mb-12">
          {/* Columna 1: Ubicación y Redes */}
          <div className="flex flex-col gap-5">
            <h4 className="text-slate-900 text-base font-bold uppercase">
              Store location
            </h4>
            <p className="text-sm leading-relaxed text-slate-500">
              Av. Paraiso. 4345
              <br />
              42003, Bs.As., Argentina.
              <br />
              <span className="font-medium text-slate-700">info@misitio.com</span>
              <br />
              +52-1-33-12345678
            </p>
            {/* Redes Sociales con efecto hover moderno */}
            <div className="flex gap-4 mt-2">
              {[
                { icon: <BsInstagram />, url: "https://www.instagram.com" },
                { icon: <FaFacebookF />, url: "https://www.facebook.com" },
                { icon: <FaTwitter />, url: "https://www.twitter.com" },
                { icon: <FaYoutube />, url: "https://www.youtube.com" }
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-200/60 text-slate-600 hover:bg-slate-900 hover:text-white transition-all duration-300 transform hover:-translate-y-1 shadow-sm text-sm"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Columna 2: Categorías Dinámicas */}
          <div className="flex flex-col gap-4">
            <h4 className="text-slate-900 text-base font-bold uppercase">Store</h4>
            <ul className="flex flex-col gap-1 text-sm">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat._id}>
                  <Anchor
                    to={`/allproducts/${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="hover:text-indigo-600 hover:translate-x-1 inline-block transition-all duration-200 text-slate-500"
                  >
                    {cat.name}
                  </Anchor>
                </li>
              ))}
            </ul>
          </div>
          {/* Columna 3: Soporte al cliente */}
          <div className="flex flex-col gap-4">
            <h4 className="text-slate-900 text-base font-bold uppercase">
              Customer Support
            </h4>
            <ul className="flex flex-col gap-1 text-sm text-slate-500">
              {[
                { label: "Contact us", to: "/contact" },
                { label: "Attendance", to: "/attendance" },
                { label: "About Us", to: "/about" },
                { label: "Jobs / CV", to: "/formcv" }
              ].map((link, idx) => (
                <li key={idx}>
                  <Anchor
                    to={link.to}
                    className="hover:text-indigo-600 hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    {link.label}
                  </Anchor>
                </li>
              ))}
            </ul>
          </div>
          {/* Columna 4: Políticas */}
          <div className="flex flex-col gap-4">
            <h4 className="text-slate-900 text-base font-bold uppercase">Policy</h4>
            <ul className="flex flex-col gap-1 text-sm text-slate-500">
              {["Shipping and Returns", "Terms and Conditions", "Payment Methods", "FAQ"].map((policy, idx) => (
                <li key={idx}>
                  <Anchor
                    to="#"
                    className="hover:text-indigo-600 hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    {policy}
                  </Anchor>
                </li>
              ))}
            </ul>
          </div>
          <HomeCurriculum />
        </div>
        {/* Columna 4: Políticas */}
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="flex justify-center items-center gap-5 bg-white px-6 py-2.5 rounded-xl shadow-sm max-w-md">
            {[
              "https://i.ibb.co/xSGScnM/payu.png",
              "https://i.ibb.co/gg5zV28/payo2.png",
              "https://i.ibb.co/R6XPJgw/mp.jpg",
              "https://i.ibb.co/nCKJVPy/visa.png"
            ].map((imgUrl, idx) => (
              <img
                key={idx}
                src={imgUrl}
                alt="payment method"
                className="w-12 h-6 object-contain grayscale opacity-75 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
            ))}
          </div>
        </div>
        {/* Créditos de Desarrolladores (Sección inferior) */}
        <div className="pt-2 mt-2">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
            <a className="flex gap-2 items-center font-medium text-slate-500" href="https://github.com/nicodsd">
              <BsGithub className="text-base text-slate-700" />
              <span>Sample page, contact me to get yours.</span>
            </a>
            <p className="text-[11px]">© {new Date().getFullYear()} All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
