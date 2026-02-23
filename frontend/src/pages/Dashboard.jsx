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
          <p>Loading your dashboard...</p>
        </div>
      </>
    );
  }

  const totalExpenses = data.monthly?.reduce((sum, m) => sum + parseFloat(m.total || 0), 0) || 0;
  const currentMonthTotal = data.monthly?.[data.monthly.length - 1]?.total || 0;
  const categoryCount = data.by_category?.length || 0;

  return (
    <>
      <Navbar />
      <div className="container fade-in">
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '0.5rem' }}>Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Your expense overview and insights
          </p>
        </div>

        {/* Quick Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
          }}>
            <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '0.5rem' }}>
              Total Spent (6 months)
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700' }}>
              ₹{totalExpenses.toFixed(2)}
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(240, 147, 251, 0.3)'
          }}>
            <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '0.5rem' }}>
              This Month
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700' }}>
              ₹{parseFloat(currentMonthTotal).toFixed(2)}
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(79, 172, 254, 0.3)'
          }}>
            <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '0.5rem' }}>
              Categories
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700' }}>
              {categoryCount}
            </div>
          </div>

          {data.percent_change_30d !== null && (
            <div style={{
              background: data.percent_change_30d > 0 
                ? 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
                : 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
              color: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(250, 112, 154, 0.3)'
            }}>
              <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '0.5rem' }}>
                30-Day Change
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '700' }}>
                {data.percent_change_30d > 0 ? '+' : ''}{data.percent_change_30d}%
              </div>
            </div>
          )}
        </div>

        {/* Top Category & Peak Day */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}>
          {data.top_category && (
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                🏆 Top Spending Category
              </h3>
              <div style={{
                padding: '1.25rem',
                background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '1.15rem', fontWeight: '600', color: '#333' }}>
                  {data.top_category.category}
                </span>
                <span style={{ fontSize: '1.4rem', fontWeight: '700', color: '#d63031' }}>
                  ₹{parseFloat(data.top_category.total).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {data.peak_day_30d && (
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                📈 Highest Spending Day
              </h3>
              <div style={{
                padding: '1.25rem',
                background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '1.15rem', fontWeight: '600', color: '#333' }}>
                  {new Date(data.peak_day_30d.date).toLocaleDateString('en-IN', { 
                    day: 'numeric', 
                    month: 'short' 
                  })}
                </span>
                <span style={{ fontSize: '1.4rem', fontWeight: '700', color: '#0984e3' }}>
                  ₹{parseFloat(data.peak_day_30d.total).toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Monthly Trend & Category Breakdown */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}>
          {/* Monthly Expenses */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>
              📅 Monthly Expenses (Last 6 Months)
            </h3>
            {data.monthly && data.monthly.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {data.monthly.map((m, idx) => {
                  const amount = parseFloat(m.total);
                  const maxAmount = Math.max(...data.monthly.map(x => parseFloat(x.total)));
                  const barWidth = (amount / maxAmount) * 100;
                  
                  return (
                    <div key={idx}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '0.4rem',
                        fontSize: '0.9rem'
                      }}>
                        <span style={{ fontWeight: '500' }}>
                          {new Date(m.month).toLocaleDateString('en-IN', { 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </span>
                        <span style={{ fontWeight: '700', color: 'var(--primary)' }}>
                          ₹{amount.toFixed(2)}
                        </span>
                      </div>
                      <div style={{
                        height: '8px',
                        background: '#e9ecef',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${barWidth}%`,
                          background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                          transition: 'width 0.5s ease'
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <p style={{ fontSize: '0.9rem' }}>No expenses yet</p>
              </div>
            )}
          </div>

          {/* Category Breakdown */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>
              🏷️ Spending by Category (Last 30 Days)
            </h3>
            {data.by_category && data.by_category.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {data.by_category.slice(0, 6).map((c, idx) => {
                  const amount = parseFloat(c.total);
                  const totalCat = data.by_category.reduce((sum, x) => sum + parseFloat(x.total), 0);
                  const percentage = ((amount / totalCat) * 100).toFixed(1);
                  
                  const colors = [
                    'linear-gradient(90deg, #f093fb 0%, #f5576c 100%)',
                    'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)',
                    'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)',
                    'linear-gradient(90deg, #fa709a 0%, #fee140 100%)',
                    'linear-gradient(90deg, #30cfd0 0%, #330867 100%)',
                    'linear-gradient(90deg, #a8edea 0%, #fed6e3 100%)'
                  ];
                  
                  return (
                    <div key={idx}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '0.4rem',
                        fontSize: '0.9rem'
                      }}>
                        <span style={{ fontWeight: '500' }}>{c.category}</span>
                        <span style={{ fontWeight: '700' }}>₹{amount.toFixed(2)}</span>
                      </div>
                      <div style={{
                        height: '10px',
                        background: '#e9ecef',
                        borderRadius: '5px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${percentage}%`,
                          background: colors[idx % colors.length],
                          transition: 'width 0.5s ease'
                        }} />
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-secondary)',
                        marginTop: '0.25rem'
                      }}>
                        {percentage}% of total
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <p style={{ fontSize: '0.9rem' }}>No category data</p>
              </div>
            )}
          </div>
        </div>

        {/* Daily Trend */}
        {data.daily_trend && data.daily_trend.length > 0 && (
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>
              📊 Daily Spending Trend (Last 30 Days)
            </h3>
            <div style={{ 
              display: 'flex', 
              alignItems: 'flex-end', 
              gap: '4px',
              height: '180px',
              padding: '1rem 0'
            }}>
              {data.daily_trend.map((d, idx) => {
                const amount = parseFloat(d.total);
                const maxDaily = Math.max(...data.daily_trend.map(x => parseFloat(x.total)));
                const barHeight = maxDaily > 0 ? (amount / maxDaily) * 100 : 0;
                
                return (
                  <div
                    key={idx}
                    style={{
                      flex: 1,
                      height: `${barHeight}%`,
                      minHeight: amount > 0 ? '4px' : '0',
                      background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '3px 3px 0 0',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                    title={`${new Date(d.date).toLocaleDateString('en-IN')}: ₹${amount.toFixed(2)}`}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '0.7';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '1';
                    }}
                  />
                );
              })}
            </div>
            <div style={{ 
              fontSize: '0.75rem', 
              color: 'var(--text-secondary)',
              textAlign: 'center',
              marginTop: '0.5rem'
            }}>
              Hover over bars to see details
            </div>
          </div>
        )}

        {/* Budgets */}
        {data.budgets && data.budgets.length > 0 && (
          <div className="card" style={{ marginTop: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>
              💰 Active Budgets
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {data.budgets.map((b, idx) => {
                const spentPercent = (b.spent / b.amount) * 100;
                const isOverBudget = b.spent > b.amount;
                
                return (
                  <div key={idx} style={{
                    padding: '1rem',
                    background: isOverBudget ? '#fff5f5' : '#f0fdf4',
                    borderRadius: '8px',
                    border: `2px solid ${isOverBudget ? '#fecaca' : '#bbf7d0'}`
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '0.75rem'
                    }}>
                      <span style={{ fontWeight: '600', fontSize: '1rem' }}>
                        {b.category}
                      </span>
                      <span style={{ 
                        fontWeight: '700',
                        color: isOverBudget ? '#dc2626' : '#16a34a'
                      }}>
                        ₹{b.spent.toFixed(2)} / ₹{b.amount.toFixed(2)}
                      </span>
                    </div>
                    <div style={{
                      height: '12px',
                      background: '#e5e7eb',
                      borderRadius: '6px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${Math.min(spentPercent, 100)}%`,
                        background: isOverBudget 
                          ? 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)'
                          : 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                        transition: 'width 0.5s ease'
                      }} />
                    </div>
                    <div style={{
                      fontSize: '0.8rem',
                      marginTop: '0.5rem',
                      color: isOverBudget ? '#dc2626' : '#16a34a',
                      fontWeight: '500'
                    }}>
                      {isOverBudget 
                        ? `Over budget by ₹${b.exceeded.toFixed(2)}`
                        : `₹${b.remaining.toFixed(2)} remaining`
                      }
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
