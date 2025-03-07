import React from 'react';
import './LeftSection.css';

const LeftSection = () => {
  return (
    <div className="left-section">
      <div className="image-container">
        <img 
          src="https://dashboard.codeparrot.ai/api/image/Z8KGqG37P2WCQpKV/img.png"
          alt="AI Learning Platform"
          className="main-image"
        />
      </div>
      <div className="text-content">
        <h1 className="title">
          Your AI-Powered Learning Journey Starts Here!
        </h1>
        <p className="description">
          Join thousands of learners and instructors in our innovative AI-enhanced learning platform.
        </p>
      </div>
    </div>
  );
};

export default LeftSection;
