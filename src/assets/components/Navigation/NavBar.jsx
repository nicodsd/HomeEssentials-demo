import React, { useState, useEffect } from 'react';
import MiddleNavBar from './MiddleNavBar';
import SearchAndLogoNavbar from './SearchAndLogoNavbar';
import FloatingNavBar from './FloatingNavBar';

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 120) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="w-full z-40 relative">
      <FloatingNavBar isScrolled={isScrolled} />
      {/* Standard Navbar (Fades out when scrolled, fades in at top) */}
      <div className={`transition-opacity duration-300 ${isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        {/* Banner superior */}
        <MiddleNavBar />

        {/* Logo y bloque de usuario principal */}
        <SearchAndLogoNavbar />
      </div>
    </header>
  );
};

export default NavBar;