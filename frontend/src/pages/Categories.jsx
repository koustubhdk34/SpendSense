import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const res = await API.get("categories/");
      setCategories(res.data.results || res.data);
    } catch (err) {
      setError("Failed to load categories");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    if (!name.trim()) return;
    setError("");
    setLoading(true);
    try {
      await API.post("categories/", { name });
      setName("");
      load();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    if (!confirm("Delete this category?")) return;
    try {
      await API.delete(`categories/${id}/`);
      load();
    } catch (err) {
      setError("Failed to delete category");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container fade-in">
        <h2 style={{ marginBottom: '2rem' }}>🏷️ Categories</h2>

        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Add New Category</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <input
              style={{ flex: '1', minWidth: '250px' }}
              placeholder="Enter category name (e.g., Food, Transport)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && create()}
            />
            <button 
              onClick={create} 
              disabled={loading || !name.trim()}
              style={{ minWidth: '120px' }}
            >
              {loading ? "Adding..." : "➕ Add"}
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">{error}</div>
        )}

        {categories.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">🏷️</div>
              <h3>No Categories Yet</h3>
              <p>Create your first category to start organizing expenses</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-3">
            {categories.map((c) => (
              <div
                key={c.id}
                className="card"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1.25rem',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow)';
                }}
              >
                <span style={{ fontSize: '1rem', fontWeight: '600' }}>
                  {c.name}
                </span>
                <button
                  onClick={() => deleteCategory(c.id)}
                  className="btn-danger"
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}
                  title="Delete category"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
