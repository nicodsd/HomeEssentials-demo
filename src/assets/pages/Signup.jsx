import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import apiUrl from '../../../api';
import Swal from 'sweetalert2';
import backgroundImage from '../../../public/images/banners/Register.png';
import logo from '../../../public/images/Logos/logo-solid-b.png';
import userLogin_action from '../../store/actions/userLogin_action';

const { SaveUserLogin } = userLogin_action;

export default function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  // Estado para prevenir múltiples envíos durante las llamadas encadenadas
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
    const name = formData.name.trim();
    const email = formData.email.trim();
    const password = formData.password;

    if (!name) {
      newErrors.name = 'Name is required.';
    } else if (name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

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

  async function handleForm(e) {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      name: formData.name.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      password: formData.password
    };

    const dataUser = {
      email: data.email,
      password: data.password
    };

    setLoading(true);
    try {
      // 1. Petición de Registro (Signup)
      const signupRes = await fetch(`${apiUrl}auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const signupJson = await signupRes.json();

      if (!signupRes.ok || signupJson?.success === false) {
        throw new Error(extractErrorMessage(signupJson, 'Registration failed.'));
      }

      // 2. Petición de Inicio de Sesión inmediato (Signin) tras un registro exitoso
      const signinRes = await fetch(`${apiUrl}auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataUser)
      });
      const signinJson = await signinRes.json();

      if (!signinRes.ok || !signinJson?.token) {
        throw new Error(extractErrorMessage(signinJson, 'Error logging in after registration.'));
      }

      localStorage.setItem('token', signinJson.token);
      localStorage.setItem('user', JSON.stringify(signinJson.user));

      dispatch(SaveUserLogin({
        token: signinJson.token,
        user: signinJson.user
      }));

      await Swal.fire({
        title: 'User created successfully, welcome!',
        icon: 'success',
        showConfirmButton: true,
        confirmButtonText: 'OK',
        allowOutsideClick: false
      });
      navigate('/');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', err.message || 'Registration failed.', 'error');
    } finally {
      setLoading(false);
    }
  }

  const inputBaseClass =
    'bg-[#E7E7E7] h-10 w-full rounded-md focus:outline-none focus:bg-[#7747e03f] focus:ring-2 focus:ring-[#7847E0]/40 focus:text-[#393939] px-3 duration-100 disabled:opacity-60';

  return (
    <div
      className='z-20 min-h-screen w-full flex font-sans justify-center lg:justify-end font-semibold items-center py-8 px-4 lg:px-0'
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      <div className='relative flex flex-col z-20 w-full max-w-md sm:w-[75%] md:w-[55%] lg:w-[42%] xl:w-[36%] items-center text-[#7847E0] selection:bg-[#7847E0] selection:text-[#ffe927] lg:mr-20'>
        <div className='relative h-[6rem] w-full bg-white flex items-center shadow-[0_5px_10px_rgba(0,0,0,0.15)] justify-center rounded-[8px_8px_0_0] mb-[2px]'>
          <h1 className='text-3xl font-bold'>Welcome!</h1>
          <img className='absolute w-8 opacity-10 top-3 right-3' src={logo} alt="logo" />
        </div>

        <form
          onSubmit={handleForm}
          noValidate
          className='relative w-full min-h-[30rem] bg-white p-6 sm:p-9 flex flex-col justify-evenly gap-6 rounded-[0_0_8px_8px] shadow-[0_5px_10px_rgba(0,0,0,0.15)]'
        >
          <p className='absolute bottom-3 left-3 text-4xl font-bold text-[#E7E7E7] select-none pointer-events-none'>
            Sign Up
          </p>

          <div className='relative z-10 flex justify-center w-full'>
            <div className='flex flex-col gap-3.5 w-full max-w-[25rem]'>
              <div className='flex flex-col w-full'>
                <label htmlFor='name-input' className='mb-1 text-sm'>
                  Name <span className='text-orange-500'>*</span>
                </label>
                <input
                  id='name-input'
                  className={`${inputBaseClass} ${errors.name ? 'ring-2 ring-red-400 bg-red-50' : ''}`}
                  type='text'
                  autoComplete="given-name"
                  required
                  disabled={loading}
                  value={formData.name}
                  onChange={handleChange('name')}
                  placeholder="Name"
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name && <span className='text-xs text-red-500 mt-1 font-normal'>{errors.name}</span>}
              </div>

              <div className='flex flex-col w-full'>
                <label htmlFor='lastname-input' className='mb-1 text-sm'>Last Name</label>
                <input
                  id='lastname-input'
                  className={inputBaseClass}
                  type='text'
                  autoComplete="family-name"
                  disabled={loading}
                  value={formData.lastName}
                  onChange={handleChange('lastName')}
                  placeholder="Last name"
                />
              </div>

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
                    autoComplete="new-password"
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
              className='bg-orange-400 text-white w-full sm:w-auto sm:min-w-[10rem] cursor-pointer rounded-md py-2 px-6 font-bold hover:bg-orange-500 duration-100 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm'
              type='submit'
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
            <h2 className='text-[#7847E0] text-sm'>
              Already registered? <strong><Link to='/signin' className="hover:underline">Sign in</Link></strong>
            </h2>
          </div>
        </form>
      </div>
    </div>
  );
}