import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { logout, user } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      background: 'white',
      borderBottom: '1px solid #e2e8f0',
      padding: '1rem 0',
      marginBottom: '1.5rem',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{
          display: 'flex',
          gap: '2.5rem',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <h3 style={{ 
            color: '#5a67d8', 
            margin: 0, 
            fontSize: '1.3rem',
            fontWeight: '600'
          }}>
            SpendSense
          </h3>
          <div style={{ display: 'flex', gap: '1.75rem', flexWrap: 'wrap' }}>
            <Link 
              to="/dashboard" 
              style={{
                color: isActive('/dashboard') ? '#5a67d8' : '#718096',
                textDecoration: 'none',
                fontWeight: isActive('/dashboard') ? '600' : '500',
                borderBottom: isActive('/dashboard') ? '2px solid #5a67d8' : 'none',
                paddingBottom: '0.25rem',
                transition: 'all 0.2s',
                fontSize: '0.95rem'
              }}
            >
              Dashboard
            </Link>
            <Link 
              to="/categories" 
              style={{
                color: isActive('/categories') ? '#5a67d8' : '#718096',
                textDecoration: 'none',
                fontWeight: isActive('/categories') ? '600' : '500',
                borderBottom: isActive('/categories') ? '2px solid #5a67d8' : 'none',
                paddingBottom: '0.25rem',
                transition: 'all 0.2s',
                fontSize: '0.95rem'
              }}
            >
              Categories
            </Link>
            <Link 
              to="/expenses" 
              style={{
                color: isActive('/expenses') ? '#5a67d8' : '#718096',
                textDecoration: 'none',
                fontWeight: isActive('/expenses') ? '600' : '500',
                borderBottom: isActive('/expenses') ? '2px solid #5a67d8' : 'none',
                paddingBottom: '0.25rem',
                transition: 'all 0.2s',
                fontSize: '0.95rem'
              }}
            >
              Expenses
            </Link>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {user && (
            <span style={{ 
              color: '#718096', 
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              {user.username}
            </span>
          )}
          <button 
            onClick={logout}
            style={{
              background: '#f7fafc',
              color: '#4a5568',
              border: '1px solid #e2e8f0',
              padding: '0.5rem 1.1rem',
              fontSize: '0.9rem'
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
