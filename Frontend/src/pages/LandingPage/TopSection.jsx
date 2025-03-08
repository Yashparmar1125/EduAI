import React from 'react';
import './TopSection.css';
import FourOptions from './FourOptions'; // Import FourOptions component
import TrendingCourses from './TrendingCourses'; // Import TrendingCourses component
import Testimonials from './Testimonials'; // Import Testimonials component

const TopSection = ({
  title = "Unlock Your Potential: Personalized Learning Paths for Your Growth",
  description = "Elevate your skills with AI-driven learning paths, goal tracking, and a thriving community.",
  buttonText = "Start Learning",
  imageUrl = "https://dashboard.codeparrot.ai/api/image/Z8XcNm9e-96e2cWE/img.png"
}) => {
  return (
    <>
      <section className="top-section">
        <div className="content-container">
          {/* Left Side: Text Content */}
          <div className="text-content">
            <h1 className="title">
              Unlock Your Potential:<br />
              Personalized <br/>Learning Paths<br/> for Your Growth
            </h1>
            <p className="description">
              Elevate your skills with AI-driven learning paths,<br />
              goal tracking, and a thriving community.
            </p>
            <div className="button-wrapper">
              <button className="start-learning-btn">{buttonText}</button>
            </div>
          </div>

          {/* Right Side: Image */}
          <div className="image-container">
            <img src={imageUrl} alt="Learning illustration" className="hero-image"/>
          </div>
        </div>
      </section>
      <FourOptions /> {/* Include FourOptions component */}
      <TrendingCourses /> {/* Include TrendingCourses component */}
      <Testimonials /> {/* Include Testimonials component */}
    </>
  );
};

export default TopSection;
