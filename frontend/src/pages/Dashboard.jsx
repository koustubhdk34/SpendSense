import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("analytics/")
      .then((res) => setData(res.data))
      .catch((err) => setError("Failed to load analytics"));
  }, []);

  if (error) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="alert alert-error">{error}</div>
        </div>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <Navbar />
        <div className="loading">
          <p>Loading analytics...</p>
        </div>
      </>
    );
  }

  const totalExpenses = data.monthly?.reduce((sum, m) => sum + parseFloat(m.total || 0), 0) || 0;

  return (
    <>
      <Navbar />
      <div className="container fade-in">
        <h2 style={{ marginBottom: '2rem' }}>📊 Dashboard</h2>

        {/* Stats Cards */}
        <div className="grid grid-3" style={{ marginBottom: '2rem' }}>
          <div className="stat-card">
            <div className="stat-value">₹{totalExpenses.toFixed(2)}</div>
            <div className="stat-label">Total Expenses</div>
          </div>
          
          <div className="stat-card" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
            <div className="stat-value">{data.monthly?.length || 0}</div>
            <div className="stat-label">Months Tracked</div>
          </div>
          
          <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
            <div className="stat-value">{data.by_category?.length || 0}</div>
            <div className="stat-label">Categories</div>
          </div>
        </div>

        {/* Top Category */}
        {data.top_category && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>🏆 Top Spending Category</h3>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius)',
            }}>
              <span style={{ fontSize: '1.125rem', fontWeight: '600' }}>
                {data.top_category.category}
              </span>
              <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>
                ₹{parseFloat(data.top_category.total).toFixed(2)}
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-2">
          {/* Monthly Expenses */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>📅 Monthly Expenses</h3>
            {data.monthly && data.monthly.length > 0 ? (
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {data.monthly.map((m) => (
                  <div
                    key={m.month}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '0.875rem',
                      marginBottom: '0.5rem',
                      background: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius)',
                      transition: 'transform 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                  >
                    <span style={{ fontWeight: '500' }}>{m.month}</span>
                    <span style={{ fontWeight: '700', color: 'var(--primary)' }}>
                      ₹{parseFloat(m.total).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">📊</div>
                <p>No monthly data yet</p>
              </div>
            )}
          </div>

          {/* Category Breakdown */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>🏷️ Category Breakdown</h3>
            {data.by_category && data.by_category.length > 0 ? (
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {data.by_category.map((c) => {
                  const percentage = totalExpenses > 0 
                    ? (parseFloat(c.total) / totalExpenses * 100).toFixed(1) 
                    : 0;
                  return (
                    <div key={c.category} style={{ marginBottom: '1rem' }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '0.5rem',
                      }}>
                        <span style={{ fontWeight: '500' }}>{c.category}</span>
                        <span style={{ fontWeight: '700' }}>
                          ₹{parseFloat(c.total).toFixed(2)}
                        </span>
                      </div>
                      <div style={{
                        height: '8px',
                        background: 'var(--bg-tertiary)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${percentage}%`,
                          background: 'linear-gradient(90deg, var(--primary) 0%, var(--primary-light) 100%)',
                          transition: 'width 0.3s ease',
                        }} />
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-secondary)',
                        marginTop: '0.25rem',
                      }}>
                        {percentage}% of total
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">🏷️</div>
                <p>No category data yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
