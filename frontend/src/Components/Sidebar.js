import { HiOutlineHome } from "react-icons/hi"; 
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

// Icons
import { MdLogout } from "react-icons/md";
import { BiAddToQueue } from "react-icons/bi";
import { SiLivechat } from "react-icons/si";
import { CgProfile } from "react-icons/cg";
import { ImSpinner8 } from 'react-icons/im';
import { FiMenu } from 'react-icons/fi';

const Sidebar = ({ className }) => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [profilePhoto, setProfilePhoto] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = localStorage.getItem('userToken');
            if (!token) {
                navigate('/');
                return;
            }

            try {
                setIsLoading(true);
                const response = await axios.get(`${process.env.REACT_APP_URL}/api/logged-user`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserName(response.data.name);
                setProfilePhoto(response.data.profilePhoto);
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserDetails();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const handleRefresh = () => {
        navigate('/team-lead-interface');
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    return (
        <>
            {/* Toggle Button */}
            <div className="sidebar-toggle-btn d-md-none d-block" onClick={toggleSidebar}>
                <FiMenu size={28} color={isSidebarOpen ? 'white' : 'grey'} />
            </div>

            {/* Sidebar */}
            <div className={`${isSidebarOpen ? 'd-block' : 'd-none d-md-block'} ${className}`}>
                <aside className="employee-sidebar bg-dark text-white p-3 min-vh-100">
                    <div className="sidebar-header text-center mb-4">
                        <h2 className="text-white">Team Lead Panel</h2>
                        <div className="d-flex align-items-center justify-content-center mt-3 flex-column">
                            {isLoading ? (
                                <ImSpinner8 fontSize={30} className="spinner-icon text-white" />
                            ) : (
                                <>
                                    <img
                                        src={profilePhoto}
                                        alt="Profile"
                                        className="profile-image mb-2"
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            border: '2px solid white',
                                        }}
                                    />
                                    <span className="fs-5">{userName || 'Loading...'}</span>
                                </>
                            )}
                        </div>
                    </div>

                    <nav className="sidebar-nav d-flex flex-column gap-3">
                        <Link className="text-white text-decoration-none" to="/team-lead-interface" onClick={handleRefresh}>
                            <HiOutlineHome fontSize={20}  /> Dashboard
                        </Link>
                        <Link className="text-white text-decoration-none" to="/profile">
                            <CgProfile fontSize={20} /> Profile
                        </Link>
                        <Link className="text-white text-decoration-none" to="/queries">
                            <SiLivechat fontSize={20} /> Team Chats
                        </Link>
                        <Link className="text-white text-decoration-none" to="/create-task">
                            <BiAddToQueue fontSize={20} /> Create Task
                        </Link>
                        <button className="btn btn-outline-light mt-3" onClick={handleLogout}>
                            <MdLogout fontSize={20} /> Logout
                        </button>
                    </nav>
                </aside>
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
  border: 1px solid white;
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

    .content-wrapper {
      margin: 0;
      width: 100%;
      padding: 10px;
    }

    .team-lead-interface {
      flex-direction: column;
      font-size: 0.6rem;
    }

    .task-card,
    .task-dates,
    .task-info,
    .module-heading,
    .refresh-btn,
    .task-name,
    .task-module-id {
      font-size: 0.6rem !important;
    }
  }

                        `
                    }
                </style>
            </div>
        </>
    );
};

export default Sidebar;
