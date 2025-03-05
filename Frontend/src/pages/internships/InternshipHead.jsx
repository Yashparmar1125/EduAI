import React from 'react';
import headerImage from "../../assets/image.png"
import './InternshipHead.css';

const InternshipHead = () => {
  return (
    <div className="internship-container">
      <div className="background-section">
        <div className="svg-container">
          <img src="https://dashboard.codeparrot.ai/api/image/Z8W39G9e-96e2cVl/frame.png" alt="Background Frame" className="background-frame" />
        </div>
        <div className="gradient-container">
          <img src="https://dashboard.codeparrot.ai/api/image/Z8W39G9e-96e2cVl/containe.png" alt="Background Gradient" className="background-gradient" />
        </div>
      </div>

      <div className="content-section">
        <div className="text-content">
          <h3 className="welcome-text">Welcome to</h3>
          <h1 className="title-text">
            Internship Opportunities<br />
            based on your learnings!
          </h1>
          <p className="description-text">
            Discover a world of learning through hands-on experience. Dive into diverse internship programs designed to boost your skills and knowledge. Recommended some internship opportunities based on skills you have learned!
          </p>
          <div className="button-group">
            <button className="get-started-btn">Get Started</button>
            <button className="learn-more-btn">
              Learn More
              <img src="https://dashboard.codeparrot.ai/api/image/Z8W39G9e-96e2cVl/frame-2.png" alt="Arrow" className="arrow-icon" />
            </button>
          </div>
        </div>

        <div className="illustration-section">
          <div className="illustration-container">
            <img src={headerImage} alt="Illustration" className="main-illustration" />
            {/* Add other illustration elements as needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipHead;

