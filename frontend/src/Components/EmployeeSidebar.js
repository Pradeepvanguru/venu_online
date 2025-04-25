import { FiDatabase } from "react-icons/fi"; 
import { CgProfile } from "react-icons/cg"; 
import { HiOutlineChatAlt2 } from "react-icons/hi"; 
import { MdOutlineLogout } from "react-icons/md"; 
import { FcHome } from "react-icons/fc"; 
import React,{ useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './EmployeeSidebar.css';
import axios from 'axios';
import { FiMenu } from 'react-icons/fi';
import { HiOutlineHome } from "react-icons/hi"; 


const EmployeeSidebar = ( {className}) => {
    const navigate = useNavigate();
    const [profilePhoto, setProfilePhoto] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    // const [userName, setUserName] = useState('');
    const userName=localStorage.getItem("userName")

     useEffect(() => {
            const fetchUserDetails = async () => {
                const token = localStorage.getItem('userToken');
    
                if (!token) {
                    navigate('/');
                    return;
                }
    
                try {
                    const response = await axios.get(`${process.env.REACT_APP_URL}/api/logged-user`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    setProfilePhoto(response.data.profilePhoto); // this is "uploads/filename.jpg"
                } catch (error) {
                    console.error('Error fetching user:', error);
                }
            };
            fetchUserDetails();
    
        }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const handlerefresh = () => {
        navigate('/employee-dashboard');
        // window.location.reload();
    };
    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };
    
    

    return (
       
        <>
         {/* Toggle Button */}
                    <div className="sidebar-toggle-btn d-md-none d-block" onClick={toggleSidebar}>
                       <FiMenu className="p-1" size={28} color={isSidebarOpen ? 'white' : 'black'} position={'relative'}/>
                    </div>
        
                    {/* Sidebar */}
    <div className={`${isSidebarOpen ? 'd-block' : 'd-none d-md-block'} ${className}`}>
        
        <aside className="employee-sidebar">
             
            <div className="sidebar-header">
            
                <h2>Teammate Panel</h2>
                <div className="d-flex align-items-center justify-content-center mt-3">
                    <img
                        src={profilePhoto}
                        alt="Profile"
                        className="profile-image"
                        style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            marginRight: '45px',
                            border:'1px solid white',
                        }}
                    />
                    <span className='fs-5 font-weight-semibold'>{userName || 'Loading...'}</span>
                </div>
            </div>
            <nav className="sidebar-nav">
                <Link to="/employee-dashboard" onClick={() => handlerefresh()}><HiOutlineHome fontSize={20} /> Dashboard</Link>
                <Link to="/profile" className="dropdown-item"><CgProfile fontSize={20}/> Profile </Link>
                 <Link to="/queries"> <HiOutlineChatAlt2 fontSize={20} /> Team Chats </Link>
                 <Link to="/file-modules"><FiDatabase fontSize={20}/> Tasks Data </Link>
                <button className="logout-btn" onClick={handleLogout}><MdOutlineLogout fontSize={20} /> Logout</button>
            </nav>
            <style>
                    {
                        `
                        /* Toggle button */
.sidebar-toggle-btn {
    position: absolute;
  top: 15px;
  left: 15px;
  z-index: 2001;
  background-color:transparent;
  color: white;
  padding: 6px 10px;
  border-radius: 5px;
  cursor: pointer;
  display: none;
  border: 1px solid red;
}
@media screen and (max-width: 768px){
    .sidebar-toggle {
      display: flex;
    }

    .sidebar {
      position: relative;
      left: 0;
      top: 0;
      width: 200px;
      background-color: #2a2a2a;
      height: 100vh;
      transition: transform 0.3s ease;
      transform: translateX(-100%);
      z-index: 1200;
    }

    .visible {
      transform: translateX(0);
      z-index:1200;
      width: 150px;
      display: block;
      
    }

    .hidden {
      transform: translateX(-100%);
      display: none;
     
    }

  

                        `
                    }
                </style>
        </aside>
        </div>
        </>
    );
};

export default EmployeeSidebar;
