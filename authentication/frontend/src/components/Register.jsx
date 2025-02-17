import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../utils/api';

const Register = () => {
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({ username, email, password });
      navigate('/login'); // Redirect to login page
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="register-title">Create an Account</h2>
        {error && <div className="register-error">{error}</div>}
        <form className="register-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={username}
            onChange={(e) => setName(e.target.value)}
            required
            className="register-input"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="register-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="register-input"
          />
          <button type="submit" className="register-button">Register</button>
        </form>
      </div>

      <style jsx>{`
        .register-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f9fafb;
          padding: 3rem 1rem;
        }

        .register-box {
          max-width: 400px;
          width: 100%;
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .register-title {
          font-size: 1.75rem;
          font-weight: bold;
          text-align: center;
          color: #1f2937;
          margin-bottom: 1rem;
        }

        .register-error {
          background-color: #fde8e8;
          color: #b91c1c;
          padding: 0.75rem;
          border-radius: 8px;
          text-align: center;
          margin-bottom: 1rem;
          border: 1px solid #f87171;
        }

        .register-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .register-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 1rem;
          color: #374151;
          transition: border 0.2s ease-in-out;
        }

        .register-input:focus {
          border-color: #2563eb;
          outline: none;
          box-shadow: 0 0 5px rgba(37, 99, 235, 0.5);
        }

        .register-button {
          width: 100%;
          padding: 0.75rem;
          background-color: #2563eb;
          color: white;
          font-size: 1rem;
          font-weight: bold;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.2s ease-in-out;
        }

        .register-button:hover {
          background-color: #1d4ed8;
        }
      `}</style>
    </div>
  );
};

export default Register;
