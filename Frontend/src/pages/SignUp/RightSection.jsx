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
        <h1 className="signup-title">Sign Up</h1>
        <p className="signup-subtitle">Create Your Account</p>
        
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="name-row">
            <div className="input-group1">
              <label>First Name*</label>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="input-group1">
              <label>Last Name*</label>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="input-group1">
            <label>Email*</label>
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

          <div className="input-group">
            <label>Occupation</label>
              <select
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}>
                <option value="">eg. Student</option>
                <option value="student">Student</option>
                <option value="professional">Professional</option>
                <option value="other">Other</option>
              </select>
            
          </div>

          <div className="input-group">
            <label>Interests/Skills</label>
              <select
                name="interests"
                value={formData.interests}
                onChange={handleChange}
              >
                <option value="">eg. Video Editing</option>
                <option value="videoEditing">Video Editing</option>
                <option value="programming">Programming</option>
                <option value="design">Design</option>
              </select>
          </div>

          <button type="submit" className="signup-button">SIGN UP</button>
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
