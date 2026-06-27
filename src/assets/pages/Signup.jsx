import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useRef } from 'react';
import apiUrl from '../../../api';
import axios from '../../utils/fetchWrapper.js';
import Swal from 'sweetalert2';
import backgroundImage from '../../../public/images/banners/Register.png';
import logo from '../../../public/images/Logos/logo-solid-b.png';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function Signup() {
  const navigate = useNavigate();
  const passwordRef = useRef();
  const emailRef = useRef();
  const nameRef = useRef();
  const lastNameRef = useRef();

  // Estado para prevenir múltiples envíos durante las llamadas encadenadas
  const [loading, setLoading] = useState(false);

  function handleForm(e) {
    e.preventDefault();

    const inputName = nameRef.current.value;
    const inputLastName = lastNameRef.current.value;
    const inputEmail = emailRef.current.value;
    const inputPassword = passwordRef.current.value;

    if (!inputName || !inputEmail || !inputPassword) return;

    const data = {
      name: inputName,
      lastName: inputLastName,
      email: inputEmail,
      password: inputPassword
    };

    const dataUser = {
      email: inputEmail,
      password: inputPassword
    };

    setLoading(false);
    setLoading(true);

    // 1. Petición de Registro (Signup)
    axios.post(`${apiUrl}auth/signup`, data)
      .then(() => {
        // 2. Petición de Inicio de Sesión inmediato (Signin) tras un registro exitoso
        axios.post(`${apiUrl}auth/signin`, dataUser)
          .then((res) => {
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            Swal.fire({
              title: "User created successfully, welcome!",
              icon: "success",
              showConfirmButton: true,
              confirmButtonText: "OK",
              allowOutsideClick: false
            }).then(() => {
              navigate("/");
            });
          })
          .catch((err) => {
            console.error(err);
            const errMsg = err.response?.data?.message || "Error logging in after registration.";
            Swal.fire("Error", Array.isArray(errMsg) ? errMsg[0] : errMsg, "error");
          })
          .finally(() => setLoading(false));
      })
      .catch((err) => {
        console.error(err);
        const errMsg = err.response?.data?.message || "Registration failed.";
        Swal.fire("Error", Array.isArray(errMsg) ? errMsg[0] : errMsg, "error");
        setLoading(false);
      });
  }

  return (
    <div
      className='z-20 min-h-screen w-[100%] flex font-sans justify-end font-semibold items-center'
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className='relative flex flex-col z-20 sm:w-[60%] md:w-[55%] lg:w-[40%] w-[50%] items-center text-[#7847E0] selection:bg-[#7847E0] selection:text-[#ffe927] mr-20'>
        <div className='relative h-[6rem] w-[100%] sm:w-[100%] bg-white flex items-center shadow-[0_5px_10px_rgba(0,0,0,0.15)] justify-center rounded-[8px_8px_0_0] mb-[2px]'>
          <h1 className='text-3xl font-bold'>Welcome!</h1>
          <img className='absolute w-8 opacity-10 top-3 right-3' src={logo} alt="logo" />
        </div>

        <form onSubmit={handleForm} className='relative sm:w-[100%] h-[30rem] bg-white p-9 flex flex-col justify-evenly rounded-[0_0_8px_8px] shadow-[0_5px_10px_rgba(0,0,0,0.15)]'>
          <p className='absolute bottom-3 left-3 text-4xl font-bold text-[#E7E7E7] select-none'>Sign Up</p>

          <div className='flex justify-center w-full'>
            <div className='flex flex-col gap-4'>
              <div className='flex flex-col w-full'>
                <label htmlFor='name-input'>Name</label>
                <input
                  id='name-input'
                  className='bg-[#E7E7E7] h-10 w-[100%] xl:w-[25rem] rounded-md focus:outline-none focus:bg-[#7747e03f] focus:text-[#393939] pl-[0.5rem] duration-100'
                  type='text'
                  autoComplete="given-name"
                  required
                  disabled={loading}
                  ref={nameRef}
                  placeholder="Name"
                />
              </div>
              <div className='flex flex-col w-full'>
                <label htmlFor='lastname-input'>Last Name</label>
                <input
                  id='lastname-input'
                  className='bg-[#E7E7E7] h-10 w-[100%] xl:w-[25rem] rounded-md focus:outline-none focus:bg-[#7747e03f] focus:text-[#393939] pl-[0.5rem] duration-100'
                  type='text'
                  autoComplete="family-name"
                  disabled={loading}
                  ref={lastNameRef}
                  placeholder="Last name"
                />
              </div>
              <div className='flex flex-col w-full'>
                <label htmlFor='email-input'>Email</label>
                <input
                  id='email-input'
                  className='bg-[#E7E7E7] h-10 w-[100%] xl:w-[25rem] rounded-md focus:outline-none focus:bg-[#7747e03f] focus:text-[#393939] pl-[0.5rem] duration-100'
                  type='email'
                  autoComplete="email"
                  required
                  disabled={loading}
                  ref={emailRef}
                  placeholder="example@email.com"
                />
              </div>
              <div className='flex flex-col w-full'>
                <label htmlFor="password-input">Password</label>
                <input
                  id="password-input"
                  className='bg-[#E7E7E7] h-10 w-[100%] xl:w-[25rem] rounded-md focus:outline-none focus:bg-[#7747e03f] focus:text-[#393939] pl-[0.5rem] duration-100'
                  type='password'
                  autoComplete="new-password"
                  required
                  disabled={loading}
                  ref={passwordRef}
                  placeholder="min. 8 characters"
                />
              </div>
            </div>
          </div>

          <div className='flex flex-col justify-center items-center gap-2'>
            <input
              className='bg-orange-400 text-white xl:w-[25%] cursor-pointer border rounded-md p-2 font-bold hover:bg-orange-500 duration-100 disabled:opacity-50 disabled:cursor-not-allowed'
              type='submit'
              value={loading ? 'Registering...' : 'Register'}
              disabled={loading}
            />
            <ToastContainer />
            <h2 className='text-[#7847E0] text-sm'>
              Already registered? <strong><Link to='/signin' className="hover:underline">Sign in</Link></strong>
            </h2>
          </div>
        </form>
      </div>
    </div>
  );
}