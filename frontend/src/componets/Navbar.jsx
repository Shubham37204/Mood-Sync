import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import NavLogo from "../images/NavLogo.png"

const Navbar = () => {
    const [isLoggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const loggedInStatus = sessionStorage.getItem('access_token');
        setLoggedIn(!!loggedInStatus); // Check if access_token is truthy

        // Use event listeners to update state when sessionStorage changes
        const handleStorageChange = () => {
            const updatedLoggedInStatus = sessionStorage.getItem('access_token');
            setLoggedIn(!!updatedLoggedInStatus); // Convert to boolean
        };

        window.addEventListener('storage', handleStorageChange);

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const handleLogout = async () => {
        try {
            const token = sessionStorage.getItem('access_token');

            const response = await fetch('/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Include the JWT token in the Authorization header
                },
            });

            const data = await response.json();

            if (data.msg === 'Token has expired') {
                // Token has expired, perform frontend logout
                setLoggedIn(false);
                sessionStorage.removeItem('access_token');
                window.location.href = '/';
            } else {
                if (data.access === 'Granted') {
                    setLoggedIn(false);
                    sessionStorage.removeItem('access_token');
                    window.location.href = '/';
                }
            }
        } catch (error) {
            console.error('Logout error:', error);
            // Handle error as needed
        }
    };

    return (
        <div>
            <nav className="bg-white shadow shadow-gray-500 w-100 px-8 md:px-auto">
                <div className="md:h-16 h-28 mx-auto md:px-4 container flex items-center justify-between flex-wrap md:flex-nowrap">
                    {/* Logo */}
                    <div className="text-indigo-500 md:order-1">
                    <img src={NavLogo} alt="" className='h-14'/>
                    </div>
                    <div className="text-gray-500 order-3 w-full md:w-auto md:order-2">
                        <ul className="flex font-semibold justify-between">
                            {/* Active Link = text-indigo-500
                                Inactive Link = hover:text-indigo-500 */}
                            <li className="md:px-4 md:py-2 text-indigo-500"><NavLink to="/">Home</NavLink ></li>
                            <li className="md:px-4 md:py-2 hover:text-indigo-400"><NavLink to="/Teams">Teams</NavLink ></li>
                            <li className="md:px-4 md:py-2 hover:text-indigo-400"><NavLink to="/Contact">Contact</NavLink ></li>
                        </ul>
                    </div>
                    <div className="order-2 md:order-3">
                        {isLoggedIn ? (
                            <button onClick={handleLogout} className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-gray-50 rounded-xl flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span>Logout</span>
                            </button>
                        ) : (
                            <NavLink to="/Login">
                                <button className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-gray-50 rounded-xl flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span>Login</span>
                                </button>
                            </NavLink>
                        )}
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;
