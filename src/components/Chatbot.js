import './Chatbot.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth, provider, signInWithPopup, signOut } from '../firebase';

function Chatbot() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("firebaseUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const savedMessages = localStorage.getItem('chat_history');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chat_history', JSON.stringify(messages));
  }, [messages]);

  const login = () => {
    signInWithPopup(auth, provider).then((result) => {
      setUser(result.user);
      localStorage.setItem("firebaseUser", JSON.stringify(result.user));
    }).catch((error) => {
      console.error("Login error:", error);
    });
  };

  const logout = () => {
    signOut(auth).then(() => {
      setUser(null);
      localStorage.removeItem("firebaseUser");
    });
  };

  const resetChat = () => {
    setMessages([]);
    setProducts([]); // also clear product results
    localStorage.removeItem('chat_history');
  };

  const handleSend = async () => {
    if (!query) return;
    setMessages([...messages, { user: query }]);
    try {
      const res = await axios.get(`http://localhost:5000/search?q=${query}`);
      setProducts(res.data);
      setMessages(prev => [...prev, { user: query, bot: `Found ${res.data.length} product(s)` }]);
    } catch {
      setMessages(prev => [...prev, { user: query, bot: 'Error connecting to server' }]);
    }
    setQuery('');
  };

  if (!user) {
    return (
      <div className="chatbot-container">
        <h2>🔐 Please Login to Use Uplyft Chatbot</h2>
        <button onClick={login}>Login with Google</button>
      </div>
    );
  }

  return (
    <div className="chatbot-container">
      <div className="chat-header">
        <h2>🛍️ Welcome, {user.displayName}!</h2>
        <div>
          <button className="reset-btn" onClick={resetChat}>Reset Chat</button>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className="message">
            <p><strong>You:</strong> {msg.user}</p>
            {msg.bot && <p><strong>Bot:</strong> {msg.bot}</p>}
          </div>
        ))}
      </div>

      <div>
        <input 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a product..."
        />
        <button onClick={handleSend}>Send</button>
      </div>

      <div className="results">
        <h3>Results:</h3>
        {products.map((p) => (
          <div key={p.id} className="result-item">
            <strong>{p.name}</strong> - ₹{p.price}<br />
            <small>{p.description}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Chatbot;
