import React, { useState, useEffect } from 'react';
import { fetchHealth, fetchTasks, createTask, deleteTask } from './services/api';

function App() {
  const [listings, setListings] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState('India');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Beach');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [healthStatus, setHealthStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user] = useState({ username: 'AdvitaBhonde', role: 'Lead DevOps Architect' });

  const loadData = async () => {
    try {
      setLoading(true);
      const healthRes = await fetchHealth();
      setHealthStatus(healthRes);

      const res = await fetchTasks();
      if (res.success) {
        setListings(res.data);
      }
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Could not connect to Wanderlust Backend API. Ensure backend service is active.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      fetchHealth().then(setHealthStatus);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateListing = async (e) => {
    e.preventDefault();
    if (!title.trim() || !location.trim() || !price) return;

    try {
      const payload = {
        title,
        description,
        location,
        country,
        price: Number(price),
        category,
        imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
      };

      const res = await createTask(payload);
      if (res.success) {
        setListings([res.data, ...listings]);
        setTitle('');
        setDescription('');
        setLocation('');
        setPrice('');
        setImageUrl('');
      }
    } catch (err) {
      alert('Error creating Wanderlust listing: ' + err.message);
    }
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm('Are you sure you want to remove this Wanderlust destination?')) return;
    try {
      const res = await deleteTask(id);
      if (res.success) {
        setListings(listings.filter(l => l._id !== id));
      }
    } catch (err) {
      alert('Error deleting destination: ' + err.message);
    }
  };

  const filteredListings = listings.filter(item => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <header className="navbar">
        <div className="brand">
          <span className="brand-logo">🏖️</span>
          <div>
            <h1>Wanderlust</h1>
            <p className="brand-tagline">Explore Unique Stay Destinations & Travel Experiences</p>
          </div>
        </div>

        <div className="navbar-actions">
          <div className={`status-indicator ${healthStatus?.status === 'UP' ? 'healthy' : 'down'}`}>
            <span className="pulse-dot"></span>
            Backend: {healthStatus?.status === 'UP' ? 'UP (Online)' : 'DOWN'}
            {healthStatus?.database?.connected && ' | MongoDB Active'}
          </div>

          <div className="user-badge">
            <span className="user-icon">👤</span>
            <div>
              <div className="user-name">{user.username}</div>
              <div className="user-role">{user.role}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <h2>Find Your Next Escape with Wanderlust</h2>
          <p>Production DevSecOps & GitOps Architecture Demonstration</p>
        </div>
      </section>

      {/* Main Grid */}
      <main className="main-layout">
        {/* Sidebar: Add Listing Form */}
        <aside className="sidebar">
          <div className="card">
            <h3>📍 Add New Destination</h3>
            <form onSubmit={handleCreateListing}>
              <div className="form-field">
                <label>Listing Title *</label>
                <input
                  type="text"
                  placeholder="e.g., Luxury Oceanfront Villa"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>City / Location *</label>
                  <input
                    type="text"
                    placeholder="e.g., Goa"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Country</label>
                  <input
                    type="text"
                    placeholder="e.g., India"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Price per Night (₹) *</label>
                  <input
                    type="number"
                    placeholder="4500"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Beach">🏝️ Beach</option>
                    <option value="Mountains">🏔️ Mountains</option>
                    <option value="Trending">🔥 Trending</option>
                    <option value="Cities">🏙️ Cities</option>
                    <option value="Camping">⛺ Camping</option>
                    <option value="Luxury">✨ Luxury</option>
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label>Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Description</label>
                <textarea
                  rows="3"
                  placeholder="Scenic details, amenities, and highlights..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary">
                ➕ Post Destination
              </button>
            </form>
          </div>

          <div className="card tech-card">
            <h4>⚙️ Infrastructure Telemetry</h4>
            <ul>
              <li><strong>CI/CD:</strong> Jenkins + Docker Hub</li>
              <li><strong>GitOps:</strong> Argo CD + AWS EKS</li>
              <li><strong>IaC:</strong> Terraform AWS VPC/EKS</li>
              <li><strong>Observability:</strong> Prometheus & Grafana</li>
            </ul>
          </div>
        </aside>

        {/* Content Area: Listings */}
        <section className="content-area">
          <div className="category-bar">
            {['All', 'Beach', 'Mountains', 'Trending', 'Cities', 'Camping', 'Luxury'].map((cat) => (
              <button
                key={cat}
                className={`cat-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'All' ? '🌐 All' : cat}
              </button>
            ))}
          </div>

          {error && <div className="error-banner">{error}</div>}

          {loading ? (
            <div className="loading-box">Loading Wanderlust destinations...</div>
          ) : filteredListings.length === 0 ? (
            <div className="empty-box">
              <p>No destinations found in this category. Be the first to add one!</p>
            </div>
          ) : (
            <div className="listings-grid">
              {filteredListings.map((item) => (
                <div key={item._id || item.id} className="listing-card">
                  <div className="card-image-wrapper">
                    <img
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'}
                      alt={item.title}
                      className="card-image"
                    />
                    <span className="category-badge">{item.category || 'Trending'}</span>
                    <button
                      className="delete-icon-btn"
                      title="Remove Destination"
                      onClick={() => handleDeleteListing(item._id || item.id)}
                    >
                      🗑️
                    </button>
                  </div>

                  <div className="card-body">
                    <h3 className="card-title">{item.title}</h3>
                    <p className="card-location">📍 {item.location || 'Location'}, {item.country || 'India'}</p>
                    {item.description && <p className="card-desc">{item.description}</p>}

                    <div className="card-footer">
                      <span className="price-tag">
                        <strong>₹{item.price ? item.price.toLocaleString() : '3,500'}</strong> <small>/ night</small>
                      </span>
                      <button className="btn btn-sm btn-accent">Book Stay</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
