import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import F1QestionsandAnswer from './pages/F1QestionsandAnswer';
import About from './pages/About'
import Pdf from './pages/Pdf';
import Login from './pages/Login';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
        <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/f1questionsandanswers" element={<F1QestionsandAnswer />} />
        <Route path='/aboutus' element={<About/>}/>
        <Route path="/f1questionsandanswers/:f1questionsandanswersId" element={<F1QestionsandAnswer />} />
        <Route path="/pdf" element={<Pdf />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
};

export default App;
