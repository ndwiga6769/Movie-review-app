import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Movie from "./Movie";
import AddMovie from './AddMovie';
import Navbar from './Navbar';
import Login from './Login';
import Signup from './Signup';
import Logout from './Logout';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  return (
    <div className="app">
      
      <Router>
      <Navbar isLoggedIn={isLoggedIn} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movie />} />
          <Route path="/addMovie" element={<AddMovie />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/logout" element={<Logout setIsLoggedIn={setIsLoggedIn} />} />
        </Routes>
      </Router> 
      
    </div>
  );
}

export default App;
