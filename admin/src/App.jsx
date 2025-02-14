import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route, useNavigate } from "react-router-dom";
import Add from "./pages/Add";
import List from "./pages/List";
import Login from "./components/Login";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EmailForm from "./pages/EmailForm";
import ListUniversity from "./pages/ListUniversity";
import AddUniversity from "./pages/AddUni";
import CreateStory from "./pages/CreateStory";
import RoleRequest from "./pages/RoleRequest";
import EventAdd from "./pages/EventAdd";
import AdminDashboard from "./pages/AdminDashboard";
import AdminChat from "./pages/AdminChat";
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';


export const backendUrl = import.meta.env.VITE_BACKEND_URL

const App = () => {

  const [token, setToken] = useState(localStorage.getItem('token')? localStorage.getItem('token'):'');
  const navigate = useNavigate();
  const [showChat, setShowChat] = useState(false);

  useEffect(()=>{
    localStorage.setItem('token', token)
  },[token])

  const handleChatClick = () => {
    setShowChat(!showChat);
  };

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
                <Route path="/eventadd" element={<EventAdd setToken={setToken}/>} />
                <Route path="/" element={<AdminDashboard token={token} />} />
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

          {/* Chat Button and Container */}
          <div className="fixed bottom-5 right-[10%] z-40">
            <button
              onClick={() => setShowChat(!showChat)}
              className="bg-[#F37021] hover:bg-[#e85d0a] text-white rounded-full p-3 shadow-lg transition-all duration-300 ease-in-out hover:scale-110 flex flex-col items-center"
              title="Open Messages"
            >
              <IoChatbubbleEllipsesOutline size={24} />
              <span className="text-xs mt-1 font-medium">Chat</span>
            </button>

            {showChat && <AdminChat onClose={() => setShowChat(false)} />}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
