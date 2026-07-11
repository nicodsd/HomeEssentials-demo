import React, { useState } from 'react';
import { toast } from 'react-toastify';

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter a valid email address.');
      return;
    }
    toast.success('Successfully subscribed to the newsletter!');
    setEmail('');
  };

  return (
    <div className="w-[95%] lg:w-[85%] py-12 rounded-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-black relative overflow-hidden">


      <div className="flex-1 z-10 text-center md:text-left">
        <h2 className="text-2xl md:text-4xl font-bold text-black mb-3">Join Our Newsletter</h2>
        <p className="text-black text-sm md:text-base max-w-md mx-auto md:mx-0">
          Sign up to receive exclusive offers, latest news, and updates directly in your inbox!
        </p>
      </div>

      <div className="w-full md:w-1/2 lg:w-[45%] z-10">
        <form onSubmit={handleSubscribe} className="flex w-full border border-gray-100 items-center bg-white p-1.5 rounded-full focus-within:ring-4 focus-within:ring-[#7847E0]/30 transition-all duration-300">
          <div className="pl-4 text-slate-400 hidden sm:block">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address..."
            className="flex-1 bg-transparent px-4 py-2 text-slate-800 focus:outline-none placeholder-slate-400 text-sm sm:text-base w-full"
            required
          />
          <button
            type="submit"
            className="bg-[#7847E0] hover:bg-[#6333c7] text-white px-6 sm:px-8 py-3 rounded-full font-semibold transition-all shadow-md active:scale-95 text-sm sm:text-base whitespace-nowrap"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
};

export default Newsletter;
