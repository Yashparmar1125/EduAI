import React, { useRef } from 'react';
import './TrendingCourses.css';

const TrendingCourses = () => {
  const courses = [
    {
      id: 1,
      title: 'Machine Learning Fundamentals',
      instructor: 'Dr. Sarah Johnson',
      instructorImg: 'https://dashboard.codeparrot.ai/api/image/Z8X9N8hTinWyM7G1/img-2.png',
      courseImg: 'https://dashboard.codeparrot.ai/api/image/Z8X9N8hTinWyM7G1/img.png',
      badge: 'Most Popular',
      badgeColor: '#4f46e5',
      rating: '4.9',
      reviews: '2.3k',
      badgeIcon: 'https://dashboard.codeparrot.ai/api/image/Z8X9N8hTinWyM7G1/frame.png'
    },
    {
      id: 2,
      title: 'Data Structures & Algorithms',
      instructor: 'Prof. Michael Chen',
      instructorImg: 'https://dashboard.codeparrot.ai/api/image/Z8X9N8hTinWyM7G1/img-4.png',
      courseImg: 'https://dashboard.codeparrot.ai/api/image/Z8X9N8hTinWyM7G1/img-3.png',
      badge: 'Beginner Friendly',
      badgeColor: '#16a34a',
      rating: '4.8',
      reviews: '1.8k',
      badgeIcon: 'https://dashboard.codeparrot.ai/api/image/Z8X9N8hTinWyM7G1/frame-3.png'
    },
    {
      id: 3,
      title: 'Cloud Architecture',
      instructor: 'Alex Thompson',
      instructorImg: 'https://dashboard.codeparrot.ai/api/image/Z8X9N8hTinWyM7G1/img-6.png',
      courseImg: 'https://dashboard.codeparrot.ai/api/image/Z8X9N8hTinWyM7G1/img-5.png',
      badge: 'Advanced',
      badgeColor: '#9333ea',
      rating: '4.7',
      reviews: '1.5k',
      badgeIcon: 'https://dashboard.codeparrot.ai/api/image/Z8X9N8hTinWyM7G1/frame-5.png'
    }
  ];

  // Duplicate the courses to create more cards
  const duplicatedCourses = [...courses, ...courses, ...courses];

  const containerRef = useRef(null);

  const scrollLeft = () => {
    containerRef.current.scrollBy({
      left: -containerRef.current.clientWidth,
      behavior: 'smooth'
    });
  };

  const scrollRight = () => {
    containerRef.current.scrollBy({
      left: containerRef.current.clientWidth,
      behavior: 'smooth'
    });
  };

  return (
    <div className="trending-courses">
      <h1 className="title">Trending Courses</h1>
      <p className="subtitle">
        Explore Top Courses, Master New Skills, and Level Up Your Career.
      </p>
      <div className="scroll-buttons">
        <button className="scroll-button left" onClick={scrollLeft}>&lt;</button>
        <button className="scroll-button right" onClick={scrollRight}>&gt;</button>
      </div>
      <div
        className="courses-container"
        ref={containerRef}
      >
        {duplicatedCourses.map((course, index) => (
          <div key={index} className="course-card">
            <img src={course.courseImg} alt={course.title} className="course-image" />
            <div className="course-content">
              <div className="badge-container">
                <img src={course.badgeIcon} alt="" className="badge-icon" />
                <span className="badge" style={{ color: course.badgeColor }}>
                  {course.badge}
                </span>
              </div>
              <h2 className="course-title">{course.title}</h2>
              <div className="instructor">
                <img src={course.instructorImg} alt="" className="instructor-image" />
                <span className="instructor-name">{course.instructor}</span>
              </div>
              <div className="rating">
                <img src="https://dashboard.codeparrot.ai/api/image/Z8X9N8hTinWyM7G1/frame-2.png" alt="" className="star-icon" />
                <span className="rating-text">
                  {course.rating} ({course.reviews} reviews)
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingCourses;

