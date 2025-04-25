import { AiOutlineCodeSandbox } from "react-icons/ai"; 
import { RiContactsLine } from "react-icons/ri"; 
import { BiBulb } from "react-icons/bi"; 
import { GoHome } from "react-icons/go"; 
// src/Components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ isAuthenticated, onLogout }) => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <p className="px-3"><Link to="/"><AiOutlineCodeSandbox color='#ff4a4a' fontSize={50}/>Collab</Link></p>
            </div>
            <div className="navbar-links">
                <Link to="/"><GoHome /> Home</Link>
                <Link to="/about"> <BiBulb /> About</Link>
                <Link to="/contact"><RiContactsLine /> Contact</Link>
                {!isAuthenticated && (
                    <div className="navbar-dropdown">
                        <span>Login/Signup</span>
                        <div className="dropdown-content">
                            <Link to="/team-lead-auth">Team Lead</Link>
                            <Link to="/employee-auth">Employee</Link>
                        </div>
                    </div>
                )}
                {isAuthenticated && (
                    <button className="logout-btn" onClick={onLogout}>
                        Logout
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
