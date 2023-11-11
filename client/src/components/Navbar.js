import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Import the CSS file

const Navbar = () => {
  //check if user is logged in
  const isLoggedIn = localStorage.getItem('token');

  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li className="nav-item">
          <Link to="/">Home</Link>
        </li>
        {isLoggedIn ? ( // Conditionally render based on user's login status
        <>
          <li className="nav-item">
            <Link to="/movies">Movies</Link>
          </li>
          <li className="nav-item">
            <Link to="/addMovie">Add Movie</Link>
          </li>
          <li className="nav-item">
            <Link to="/logout">Logout</Link>
          </li>
        </>
      ) : (
        <li className="nav-item">
          <Link to="/login">Login</Link>
        </li>
      )}
      </ul>
    </nav>
  );
};

export default Navbar;
