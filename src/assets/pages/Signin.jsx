import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import apiUrl from '../../../api';
import backgroundImage from '../../../public/images/banners/Signin.png';
import logo from '../../../public/images/Logos/logo-solid-b.png';
import userLogin_action from '../../store/actions/userLogin_action';

const { SaveUserLogin } = userLogin_action;

export default function Signin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  // Estado para controlar el envío duplicado
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    const email = formData.email.trim();
    const password = formData.password;

    if (!email) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const extractErrorMessage = (payload, fallback) => {
    const raw = payload?.message || payload?.error || fallback;
    return Array.isArray(raw) ? raw[0] : raw;
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const dataUser = {
      email: formData.email.trim(),
      password: formData.password
    };

    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataUser)
      });

      const dataUserResponse = await res.json();

      if (!res.ok || !dataUserResponse.success) {
        throw new Error(extractErrorMessage(dataUserResponse, 'Invalid email or password.'));
      }

      localStorage.setItem("token", dataUserResponse.token);
      localStorage.setItem("user", JSON.stringify(dataUserResponse.user));

      dispatch(SaveUserLogin({
        token: dataUserResponse.token,
        user: dataUserResponse.user
      }));

      navigate('/');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', err.message || 'Invalid email or password.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const inputBaseClass =
    'bg-[#E7E7E7] h-10 w-full rounded-md focus:outline-none focus:bg-[#7747e03f] focus:ring-2 focus:ring-[#7847E0]/40 focus:text-[#393939] px-3 duration-100 disabled:opacity-60';

  return (
    <div
      className='z-20 min-h-screen w-full flex font-sans justify-center lg:justify-start font-semibold items-center py-8 px-4 lg:px-0'
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover"
      }}
    >
      <div className='relative flex flex-col z-20 w-full max-w-md sm:w-[75%] md:w-[55%] lg:w-[42%] xl:w-[36%] justify-center items-center text-[#7847E0] selection:bg-[#7847E0] selection:text-[#ffe927] lg:ml-20'>

        <div className='relative h-[6rem] w-full bg-white flex justify-center items-center shadow-[0_5px_10px_rgba(0,0,0,0.15)] rounded-[8px_8px_0_0] mb-[2px]'>
          <h1 className='text-3xl font-bold'>Welcome back!</h1>
          <img className='absolute w-8 opacity-10 top-3 right-3' src={logo} alt="logo" />
        </div>

        <form
          onSubmit={handleSignIn}
          noValidate
          className='relative w-full min-h-[30rem] bg-white p-6 sm:p-9 flex flex-col justify-evenly gap-6 rounded-[0_0_8px_8px] shadow-[0_5px_10px_rgba(0,0,0,0.15)]'
        >
          <p className='absolute bottom-3 left-3 text-4xl font-bold text-[#E7E7E7] select-none pointer-events-none'>
            Login
          </p>

          <div className='relative z-10 flex justify-center w-full'>
            <div className='flex flex-col gap-4 w-full max-w-[25rem]'>
              <div className='flex flex-col w-full'>
                <label htmlFor='email-input' className='mb-1 text-sm'>
                  Email <span className='text-orange-500'>*</span>
                </label>
                <input
                  id='email-input'
                  className={`${inputBaseClass} ${errors.email ? 'ring-2 ring-red-400 bg-red-50' : ''}`}
                  type='email'
                  autoComplete="email"
                  required
                  disabled={loading}
                  value={formData.email}
                  onChange={handleChange('email')}
                  placeholder="example@email.com"
                  aria-invalid={Boolean(errors.email)}
                />
                {errors.email && <span className='text-xs text-red-500 mt-1 font-normal'>{errors.email}</span>}
              </div>

              <div className='flex flex-col w-full'>
                <label htmlFor="password-input" className='mb-1 text-sm'>
                  Password <span className='text-orange-500'>*</span>
                </label>
                <div className='relative w-full'>
                  <input
                    id="password-input"
                    className={`${inputBaseClass} pr-10 ${errors.password ? 'ring-2 ring-red-400 bg-red-50' : ''}`}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    minLength={8}
                    disabled={loading}
                    value={formData.password}
                    onChange={handleChange('password')}
                    placeholder="min. 8 characters"
                    aria-invalid={Boolean(errors.password)}
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword((prev) => !prev)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-[#7847E0]/70 hover:text-[#7847E0] focus:outline-none'
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
                {errors.password && <span className='text-xs text-red-500 mt-1 font-normal'>{errors.password}</span>}
              </div>
            </div>
          </div>

          <div className='relative z-10 flex flex-col justify-center items-center gap-2.5'>
            <button
              type="submit"
              disabled={loading}
              className='bg-[#FF8A00] text-white w-full sm:w-auto sm:min-w-[10rem] hover:bg-[#ff9823] hover:drop-shadow-[0_3px_3px_rgba(0,0,0,0.3)] duration-100 py-2 px-6 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed'
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