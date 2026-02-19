import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    amount: "",
    note: "",
    incurred_at: "",
    category_id: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadExpenses = async () => {
    try {
      const res = await API.get("expenses/");
      setExpenses(res.data.results || res.data);
    } catch (err) {
      setError("Failed to load expenses");
    }
  };

  const loadCategories = async () => {
    try {
      const res = await API.get("categories/");
      setCategories(res.data.results || res.data);
    } catch (err) {
      console.error("Failed to load categories");
    }
  };

  useEffect(() => {
    loadExpenses();
    loadCategories();
  }, []);

  const submit = async () => {
    if (!form.amount || !form.incurred_at) {
      setError("Amount and date are required");
      return;
    }
    setError("");
    setLoading(true);
    try {
      // Remove category_id if empty
      const payload = { ...form };
      if (!payload.category_id) {
        delete payload.category_id;
      }
      
      console.log("Sending payload:", payload); // Debug log
      
      await API.post("expenses/", payload);
      setForm({ amount: "", note: "", incurred_at: "", category_id: "" });
      loadExpenses();
    } catch (err) {
      console.error("Error response:", err.response); // Debug log
      const errorMsg = err.response?.data?.detail 
        || JSON.stringify(err.response?.data) 
        || "Failed to create expense";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (id) => {
    if (!confirm("Delete this expense?")) return;
    try {
      await API.delete(`expenses/${id}/`);
      loadExpenses();
    } catch (err) {
      setError("Failed to delete expense");
    }
  };

  const totalAmount = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

  return (
    <>
      <Navbar />
      <div className="container fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ margin: 0 }}>💳 Expenses</h2>
          <div className="stat-card" style={{ padding: '1rem 1.5rem', margin: 0 }}>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Total</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>₹{totalAmount.toFixed(2)}</div>
          </div>
        </div>

        {/* Add Expense Form */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Add New Expense</h3>
          <div className="grid grid-2" style={{ marginBottom: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Amount (₹)</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Date & Time</label>
              <input
                type="datetime-local"
                value={form.incurred_at}
                onChange={(e) => setForm({ ...form, incurred_at: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-2" style={{ marginBottom: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Note (Optional)</label>
              <input
                placeholder="What did you spend on?"
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Category (Optional)</label>
              <select
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button 
            onClick={submit} 
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? "Adding..." : "➕ Add Expense"}
          </button>
        </div>

        {error && (
          <div className="alert alert-error">{error}</div>
        )}

        {/* Expenses List */}
        {expenses.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">💳</div>
              <h3>No Expenses Yet</h3>
              <p>Start tracking by adding your first expense above</p>
            </div>
          </div>
        ) : (
          <div className="card" style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Note</th>
                  <th>Category</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((e) => (
                  <tr key={e.id}>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {new Date(e.incurred_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td style={{ fontWeight: '700', color: 'var(--primary)' }}>
                      ₹{parseFloat(e.amount).toFixed(2)}
                    </td>
                    <td>{e.note || <span style={{ color: 'var(--text-secondary)' }}>—</span>}</td>
                    <td>
                      {e.category_name ? (
                        <span style={{
                          background: 'var(--bg-tertiary)',
                          padding: '0.25rem 0.75rem',
                          borderRadius: 'var(--radius)',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}>
                          {e.category_name}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-secondary)' }}>—</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => deleteExpense(e.id)}
                        className="btn-danger"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}
                        title="Delete expense"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
