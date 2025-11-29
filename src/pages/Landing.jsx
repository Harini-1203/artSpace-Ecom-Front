import React, { useState } from 'react';
import { Products } from '../components/landing/Products';
import Hero from '../components/landing/Hero';
import Footer from '../components/landing/Footer';
const Landing = ({ setCartCount }) => {
  return (
    <div className='mx-0 mt-4 '>
      <Hero />
      <Products onCartChange={setCartCount} />
      <Footer />
    </div>
  );
}
export default Landing;