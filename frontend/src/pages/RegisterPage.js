// frontend/src/pages/RegisterPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../RegisterPage.css'

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // check password
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {

      await axios.post('/api/auth/register', { username, password });
      alert('Registration successful! Please log in.');
      navigate('/login');


    } catch (error) {
      console.error(error);
      if (error.response && error.response.data.message) {
        alert(`Registration failed: ${error.response.data.message}`);
      } else {
        alert('Registration failed, error in backend');
      }
    }
  };

  return (
    <div className="register-page">
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Username:</label>
          <input
            type='text'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={6}
            placeholder='Enter username'
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder='Enter your password'
          />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            type='password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            placeholder='Confirm password'
          />
        </div>
        <button type='submit'>Register</button>
      </form>
      <p>
        Already have an account? <Link to='/login'>Log in here</Link>.
      </p>

      <div className="quotation-div">
        <p className="quotation">"Track your financial trading decisions, it's what the pros do."</p>

      </div>
    </div>
    </div>
  );
}

export default RegisterPage;
