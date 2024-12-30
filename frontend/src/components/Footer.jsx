import React from 'react'
import assets from '../assets/assets';

const Footer = () => {
  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10'>
        <div>
          <img src={assets.f1successhubLogo}className='mb-5 w-32' alt="" />
          <p className='w-full md:w-2/3 text-gray-600'>"F1 SuccessHub is your ultimate guide for F1 visa preparation. We provide comprehensive questions and answers, along with free downloadable PDFs, to help you confidently navigate your F1 visa journey. Empowering students with reliable resources to achieve their dreams."</p>
        </div>
        <div>
          <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>
        <div>
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>+977-9706750713</li>
            <li>f1successhub@gmail.com</li>
          </ul>
        </div>

      </div>
        <div className=''>
          <hr />
          <p className='py-5 text-sm text-center'>Copyright 2024@  f1successhub.com - All Right</p>
        </div>
    </div>
  )
}

export default Footer;