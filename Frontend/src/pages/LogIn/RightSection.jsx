import React, { useState } from 'react';
import './RightSection.css';

const RightSection = ({ defaultData = {}, onGoggleSignIn }) => {
  const [formData, setFormData] = useState({
    email: defaultData.email || '',
    password: defaultData.password || ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      // Simulate API call (replace this with actual logic)
      setTimeout(() => {
        console.log('Form submitted:', formData);
        setLoading(false);
      }, 2000);
    }
  };

  return (
    <div className="right-section">
      <div className="signup-container">
        <h1 className="signup-title">Log In</h1>
        <p className="signup-subtitle">Enter your login credentials</p>
        
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="input-group-all">
            <div className="input-group1">
              <label htmlFor="email">Email address*</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                aria-describedby="emailError"
                aria-invalid={errors.email ? 'true' : 'false'}
              />
              {errors.email && <span id="emailError" className="error-message">{errors.email}</span>}
            </div>

            <div className="input-group1">
              <label htmlFor="password">Password*</label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="********"
                value={formData.password}
                onChange={handleChange}
                aria-describedby="passwordError"
                aria-invalid={errors.password ? 'true' : 'false'}
              />
              {errors.password && <span id="passwordError" className="error-message">{errors.password}</span>}
            </div>

            <button type="submit" className="signup-button" disabled={loading}>
              {loading ? 'Logging In...' : 'LOG IN'}
            </button>
          </div>
        </form>

        <div className="social-login">
          <p>OR</p>
          <div className="social-buttons">
            <button className="social-btn" aria-label="Login with Google" onClick={onGoggleSignIn}>
              <img src="https://dashboard.codeparrot.ai/api/image/Z8KGqG37P2WCQpKV/google.png" alt="Google" />
            </button>
            <button className="social-btn" aria-label="Login with Facebook">
              <img src="https://dashboard.codeparrot.ai/api/image/Z8KGqG37P2WCQpKV/facebook.png" alt="Facebook" />
            </button>
          </div>
        </div>

        <div className="signup-prompt">
          <p>New here? <button className="signup-link" >Sign up</button></p>
        </div>
      </div>
    </div>
  );
};

export default RightSection;
