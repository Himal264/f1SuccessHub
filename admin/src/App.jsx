import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route } from "react-router-dom";
import Add from "./pages/Add";
import List from "./pages/List";
import Login from "./components/Login";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EmailForm from "./pages/EmailForm";
import ListUniversity from "./pages/ListUniversity";
import AddUniversity from "./pages/AddUni";
import Dashboard from "./pages/Dashboard";
import CreateStory from "./pages/CreateStory";
import RoleRequest from "./pages/RoleRequest";

export const backendUrl = import.meta.env.VITE_BACKEND_URL

const App = () => {

  const [token, setToken] = useState(localStorage.getItem('token')? localStorage.getItem('token'):'');

  useEffect(()=>{
    localStorage.setItem('token', token)
  },[token])

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken}/>
          <hr />
          <div className="flex w-full">
            <Sidebar />
            <div className="w-[70%] mx-auto ml-[max(5vw, 25px)] my-8 text-gray-600 text-base">
              <Routes>
                <Route path="/" element={<Dashboard token={token} />} />
                <Route path="/add" element={<Add token={token}/>} />
                <Route path="/list" element={<List token={token}/>} />
                <Route path="/email" element={<EmailForm setToken={setToken}/>} />
                <Route path="/adduniversity" element={<AddUniversity setToken={setToken}/>} />
                <Route path="/listuniverstiy" element={<ListUniversity setToken={setToken}/>} />
                <Route path="/createstory" element={<CreateStory setToken={setToken}/>} />
                <Route path="/rolerequest" element={<RoleRequest setToken={setToken}/>} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
