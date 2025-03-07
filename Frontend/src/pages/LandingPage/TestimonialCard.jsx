import React from 'react';


const TestimonialCard = ({ imageUrl, text, name, title }) => {
  return (
    <div className="testimonial-card">
      <img src={imageUrl} alt={name} className="testimonial-avatar" />
      <div className="testimonial-content">
        <p className="testimonial-text">{text}</p>
        <h2 className="testimonial-name">{name}</h2>
        <p className="testimonial-title">{title}</p>
      </div>
    </div>
  );
};

TestimonialCard.defaultProps = {
  imageUrl: 'https://dashboard.codeparrot.ai/api/image/Z8czSxQ2u-KHiHW2/img.png',
  text: 'This platform offers great internships and structured roadmaps, helping me gain experience and grow my career.',
  name: 'Emily Roberts',
  title: 'Cyber Security Engineer'
};

export default TestimonialCard;

