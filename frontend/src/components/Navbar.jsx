import React, {useContext, useState } from 'react';
import assets from '../assets/assets';
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
  
  const [visible, setVisible] = useState(false);
  
  return (
    <div className='flex items-center justify-between font-medium py-5'> {/* Adjusted padding */}
      <Link to='/'>
      <img className='w-36' src={assets.f1successhubLogo} alt="Logo" />
      </Link>
      <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>

        <NavLink to="/f1questionsandanswers/:f1questionsandanswersId" className='flex felx-col  items-center gap-1 mr-4'>
          <p>Questions Type</p>
          <hr className='w-2/4 border-none hidden h-[1.5px] bg-gray-700' />
        </NavLink>

        <NavLink to='/pdf' className='flex flex-col items-center gap-1 mr-4'>
          <p>Pdf Type</p>
          <hr className='w-2/4 border-none hidden h-[1.5px] bg-gray-700' />
        </NavLink>

        <NavLink to='/aboutus' className='flex flex-col items-center gap-1 mr-4'>
          <p>About Us</p>
          <hr className='w-2/4 border-none hidden h-[1.5px] bg-gray-700' />
        </NavLink>

        <NavLink to='/login' className='flex flex-col items-center gap-1'>
          <p>Login</p>
          <hr className='w-2/4 border-none hidden h-[1.5px] bg-gray-700' />
        </NavLink>
        
      </ul>

      <div className='flex items-center gap-6'>
        <img src={assets.search_icon} className='w-5 cursor-pointer' alt="" />

        <img onClick={()=>setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt="" />

      </div>

      {/* Sidebar menu for small screens */}
      <div className={`absolute top-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
        <div className='flex flex-col text-gray-600'>
          <div onClick={()=>setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
            <img className='h-4 rotate-180' src={assets.dropdown_icon} alt="" />
            <p>Back</p>
          </div>
          <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border' to='/f1questionsandanswers/:f1questionsandanswersId'>Questions Type</NavLink>
          <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border' to='/pdf'>Pdf Type</NavLink>
          <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border' to='/aboutus'>About Us</NavLink>
          <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border' to='/login'>Login</NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
