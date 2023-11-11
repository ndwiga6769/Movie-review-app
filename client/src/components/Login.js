import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Link } from 'react-router-dom';
import './Login.css';

function Login({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.status === 200) {
        // Assuming the server returns a JWT token upon successful login
        localStorage.setItem('token', data.token);
        setIsLoggedIn(true);
        navigate('/'); // Navigate to the protected route
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setMessage('Login failed. Please try again later.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="email" name="email" value={userData.email} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Password:
          <input type="password" name="password" value={userData.password} onChange={handleChange} required />
        </label>
        <br />
        <button type="submit">Log In</button>
      </form>
      {message && <p>{message}</p>}
      <p>
        No account? <Link to="/signup">Create account</Link>
      </p>
    </div>
  );
}

export default Login;
