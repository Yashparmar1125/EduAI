import React, { useState } from 'react';
import './RightSection.css';

const RightSection = ({ defaultData = {} }) => {
  const [formData, setFormData] = useState({
    firstName: defaultData.firstName || '',
    lastName: defaultData.lastName || '',
    email: defaultData.email || '',
    password: defaultData.password || '',
    occupation: defaultData.occupation || '',
    interests: defaultData.interests || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="right-section">
      <div className="signup-container">
        <h1 className="signup-title">Log In</h1>
        <p className="signup-subtitle">Enter your login credentials</p>
        
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="input-group-all">
          <div className="input-group1">
            <label>Email address*</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="input-group1">
            <label>Password*</label>
            <input
              type="password"
              name="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="signup-button">SIGN UP</button>
          </div>
        </form>

        <div className="social-login">
          <p>OR</p>
          <div className="social-buttons">
            <button className="social-btn">
              <img src="https://dashboard.codeparrot.ai/api/image/Z8KGqG37P2WCQpKV/google.png" alt="Google" />
            </button>
            <button className="social-btn">
              <img src="https://dashboard.codeparrot.ai/api/image/Z8KGqG37P2WCQpKV/facebook.png" alt="Facebook" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSection;
