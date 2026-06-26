import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import apiUrl from '../../../api';
import { useRef } from "react";
import backgroundImage from '../../../public/images/banners/Signin.png';
import logo from '../../../public/images/Logos/logo-solid-b.png';
import { useDispatch } from "react-redux";
import userLogin_action from '../../store/actions/userLogin_action';

const { SaveUserLogin } = userLogin_action;

export default function Signin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const emailRef = useRef();
  const passwordRef = useRef();

  // Estado para controlar el envío duplicado
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();

    const inputEmail = emailRef.current.value;
    const inputPassword = passwordRef.current.value;

    if (!inputEmail || !inputPassword) return;

    const dataUser = {
      email: inputEmail,
      password: inputPassword
    };

    try {
      setLoading(true);
      const res = await axios.post(`${apiUrl}auth/signin`, dataUser);

      // Persistencia en almacenamiento local
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Sincronización con Redux
      dispatch(SaveUserLogin({
        token: res.data.token,
        user: res.data.user
      }));

      setTimeout(() => {
        navigate('/');
      }, 1000);

    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Invalid email or password.";
      alert(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className='z-20 min-h-screen flex font-semibold items-center'
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover"
      }}
    >
      <div className='relative flex flex-col z-20 sm:w-[40%] w-[80%] justify-center items-center text-[#7847E0] selection:bg-[#7847E0] selection:text-[#ffe927] sm:ml-20'>

        <div className='relative h-[6rem] w-[100%] bg-white flex justify-center items-center shadow-[0_5px_10px_rgba(0,0,0,0.15)] rounded-[8px_8px_0_0] mb-[2px]'>
          <h1 className='text-3xl font-bold'>Welcome back!</h1>
          <img className='absolute w-8 opacity-10 top-3 right-3' src={logo} alt="logo" />
        </div>

        <form
          onSubmit={handleSignIn}
          className='xl:relative w-[100%] h-[30rem] bg-white xl:p-9 flex flex-col justify-evenly rounded-[0_0_8px_8px] shadow-[0_5px_10px_rgba(0,0,0,0.15)]'
        >
          <p className='absolute bottom-3 left-3 text-4xl font-bold text-[#E7E7E7] select-none'>Login</p>

          <div className='flex justify-center w-full'>
            <div className='flex flex-col gap-4'>
              <div className='flex flex-col w-full'>
                <label htmlFor='email-input'>Email</label>
                <input
                  id='email-input'
                  className='bg-[#E7E7E7] h-10 xl:w-[25rem] sm:w-[100%] rounded-md focus:outline-none focus:bg-[#7747e03f] focus:text-[#393939] pl-[0.5rem] duration-100'
                  type='email'
                  autoComplete="email"
                  required
                  ref={emailRef}
                  placeholder="example@email.com"
                />
              </div>

              <div className='flex flex-col w-full'>
                <label htmlFor="password-input">Password</label>
                <input
                  id="password-input"
                  className='bg-[#E7E7E7] h-10 xl:w-[25rem] sm:w-[100%] rounded-md focus:outline-none focus:bg-[#7747e03f] focus:text-[#393939] pl-[0.5rem] duration-100'
                  type='password'
                  autoComplete="current-password"
                  required
                  ref={passwordRef}
                  placeholder="min. 8 characters"
                />
              </div>
            </div>
          </div>

          <div className='flex flex-col justify-center items-center'>
            <button
              type="submit"
              disabled={loading}
              className='bg-[#FF8A00] text-white md:w-[35%] hover:bg-[#ff9823] hover:drop-shadow-[0_3px_3px_rgba(0,0,0,0.3)] duration-100 p-2 rounded-xl mb-2 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
            <h2 className='text-[#7847E0] text-sm'>
              Don´t have an account? <strong><Link to='/signup' className="hover:underline">Register</Link></strong>
            </h2>
          </div>
        </form>

      </div>
    </div>
  );
}