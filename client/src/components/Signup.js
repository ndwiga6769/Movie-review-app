import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './Signup.css';


function Signup() {
    const navigate = useNavigate();
  const [userData, setUserData] = useState({ email: '', username: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.status === 201) {
        setMessage(`Registration successful for ${data.username}. You can now log in.`);
        navigate('/login');
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setMessage('Registration failed. Please try again later.');
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="email" name="email" value={userData.email} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Username:
          <input type="text" name="username" value={userData.username} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Password:
          <input type="password" name="password" value={userData.password} onChange={handleChange} required />
        </label>
        <br />
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Signup;
