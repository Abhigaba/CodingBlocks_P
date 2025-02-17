import React, { useState } from 'react';
import { login } from '../utils/api';

const Login = () => {
  const [username, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ username, password });
      localStorage.setItem('token', response.data.token);
      
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login to your account</h2>
        {error && <div className="login-error">{error}</div>}
        <form className="login-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="sr-only">Email</label>
            <input
              id="username"
              type="text"
              placeholder="Email"
              value={username}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="login-input"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input"
            />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f9fafb;
          padding: 3rem 1rem;
        }
        .login-box {
          max-width: 400px;
          width: 100%;
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .login-title {
          font-size: 1.75rem;
          font-weight: bold;
          text-align: center;
          color: #1f2937;
          margin-bottom: 1rem;
        }
        .login-error {
          background-color: #fde8e8;
          color: #b91c1c;
          padding: 0.75rem;
          border-radius: 8px;
          text-align: center;
          margin-bottom: 1rem;
          border: 1px solid #f87171;
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .login-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 1rem;
          color: #374151;
          transition: border 0.2s ease-in-out;
        }
        .login-input:focus {
          border-color: #2563eb;
          outline: none;
          box-shadow: 0 0 5px rgba(37, 99, 235, 0.5);
        }
        .login-button {
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
        .login-button:hover {
          background-color: #1d4ed8;
        }
      `}</style>
    </div>
  );
};

export default Login;
