import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { logout, user } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
      padding: '1rem 0',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      marginBottom: '2rem',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{
          display: 'flex',
          gap: '2rem',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <h3 style={{ color: 'white', margin: 0, fontSize: '1.25rem' }}>
            💰 Smart Expense
          </h3>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <Link 
              to="/dashboard" 
              style={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: isActive('/dashboard') ? '600' : '500',
                opacity: isActive('/dashboard') ? 1 : 0.9,
                borderBottom: isActive('/dashboard') ? '2px solid white' : 'none',
                paddingBottom: '0.25rem',
                transition: 'all 0.2s'
              }}
            >
              📊 Dashboard
            </Link>
            <Link 
              to="/categories" 
              style={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: isActive('/categories') ? '600' : '500',
                opacity: isActive('/categories') ? 1 : 0.9,
                borderBottom: isActive('/categories') ? '2px solid white' : 'none',
                paddingBottom: '0.25rem',
                transition: 'all 0.2s'
              }}
            >
              🏷️ Categories
            </Link>
            <Link 
              to="/expenses" 
              style={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: isActive('/expenses') ? '600' : '500',
                opacity: isActive('/expenses') ? 1 : 0.9,
                borderBottom: isActive('/expenses') ? '2px solid white' : 'none',
                paddingBottom: '0.25rem',
                transition: 'all 0.2s'
              }}
            >
              💳 Expenses
            </Link>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user && (
            <span style={{ color: 'white', fontSize: '0.875rem', opacity: 0.9 }}>
              👤 {user.username}
            </span>
          )}
          <button 
            onClick={logout}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem'
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
