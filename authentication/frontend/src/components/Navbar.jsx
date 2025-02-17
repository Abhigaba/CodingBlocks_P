import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <NavLink exact to="/" activeClassName="active">Home</NavLink>
      <NavLink to="/login" activeClassName="active">Login</NavLink>
      <NavLink to="/register" activeClassName="active">Register</NavLink>
      <NavLink to="/profile" activeClassName="active">Profile</NavLink>

      <style jsx>{`
        .navbar {
          display: flex;
          justify-content: space-around;
          align-items: center;
          background-color: #1f2937;
          padding: 1rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .navbar a {
          color: white;
          text-decoration: none;
          font-size: 1rem;
          font-weight: 500;
          padding: 0.5rem 1rem;
          transition: color 0.3s ease-in-out, background 0.3s ease-in-out;
          border-radius: 6px;
        }

        .navbar a:hover {
          background-color: #2563eb;
          color: #ffffff;
        }

        .navbar a.active {
          background-color: #2563eb;
          color: white;
          font-weight: bold;
          border-radius: 6px;
          padding: 0.5rem 1rem;
        }

        @media (max-width: 768px) {
          .navbar {
            flex-direction: column;
            gap: 10px;
          }

          .navbar a {
            display: block;
            text-align: center;
            width: 100%;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
