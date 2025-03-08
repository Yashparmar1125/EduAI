import React from 'react';
import './FourOptions.css';

const FourOptions = () => {
  const options = [
    {
      icon: "https://dashboard.codeparrot.ai/api/image/Z8X6dMhTinWyM7Gv/healthic.png",
      title: "SKILL ASSESSMENT",
      description: "Elevate your potential! Click to assess your skills and discover where you stand."
    },
    {
      icon: "https://dashboard.codeparrot.ai/api/image/Z8X6dMhTinWyM7Gv/gis-map.png",
      title: "INTERNSHIPS",
      description: "Kickstart Your Career! Explore exciting internships and gain real-world experience."
    },
    {
      icon: "https://dashboard.codeparrot.ai/api/image/Z8X6dMhTinWyM7Gv/fluent-c.png",
      title: "COMMUNITY",
      description: "Find Your Tribe! Join a thriving community that matches your passion and interests."
    },
    {
      icon: "https://dashboard.codeparrot.ai/api/image/Z8X6dMhTinWyM7Gv/carbon-d.png",
      title: "DASHBOARD",
      description: "Your Learning Hub! Track progress, ongoing lectures, certificates, and more."
    }
  ];

  return (
    <div className="four-options-container">
      <h1 className="main-title">Your Personalized Path to Success</h1>
      
      <div className="options-grid">
        {options.map((option, index) => (
          <div key={index} className="option-card">
            <div className="icon-container">
              <img src={option.icon} alt={option.title} className="option-icon" />
            </div>
            <div className="card-content">
              <h2 className="card-title">{option.title}</h2>
              <p className="card-description">{option.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FourOptions;
