import React from 'react';


const CourseCard = ({
  imageUrl = 'https://dashboard.codeparrot.ai/api/image/Z8X9N8hTinWyM7G1/img.png',
  title = 'Machine Learning Fundamentals',
  instructor = 'Dr. Sarah Johnson',
  instructorImage = 'https://dashboard.codeparrot.ai/api/image/Z8X9N8hTinWyM7G1/img-2.png',
  rating = '4.9',
  reviews = '2.3k',
  level = 'Most Popular',
  levelColor = '#4f46e5',
  levelIcon = 'https://dashboard.codeparrot.ai/api/image/Z8X9N8hTinWyM7G1/frame.png',
  starIcon = 'https://dashboard.codeparrot.ai/api/image/Z8X9N8hTinWyM7G1/frame-2.png'
}) => {
  return (
    <div className="course-card">
      <img src={imageUrl} alt={title} className="course-image" />
      <div className="course-content">
        <div className="level-badge">
          <img src={levelIcon} alt="level" className="level-icon" />
          <span style={{ color: levelColor }}>{level}</span>
        </div>
        
        <h2 className="course-title">{title}</h2>
        
        <div className="instructor-info">
          <img src={instructorImage} alt={instructor} className="instructor-image" />
          <span className="instructor-name">{instructor}</span>
        </div>
        
        <div className="rating-info">
          <img src={starIcon} alt="star" className="star-icon" />
          <span className="rating-text">{rating} ({reviews} reviews)</span>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;

