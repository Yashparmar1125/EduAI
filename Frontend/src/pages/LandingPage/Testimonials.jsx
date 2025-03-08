import React from 'react';
import './Testimonials.css';
import TestimonialCard from './TestimonialCard';

const Testimonials = () => {
  return (
    <div className="testimonials-container">
      <h1 className="testimonials-title">Testimonials</h1>
      <div className="testimonials-cards">
        <TestimonialCard 
          imageUrl="https://dashboard.codeparrot.ai/api/image/Z8czSxQ2u-KHiHW2/img.png"
          text="This platform offers great internships and structured roadmaps, helping me gain experience and grow my career."
          name="Emily Roberts"
          title="Cyber Security Engineer"
        />
        <TestimonialCard 
          imageUrl="https://dashboard.codeparrot.ai/api/image/Z8czSxQ2u-KHiHW2/img-2.png"
          text="As a professor, this platform has been an invaluable resource. It has enhanced my knowledge & my teaching methods in ways."
          name="Prof. Jeo Denmark"
          title="Software Engineer"
        />
        <TestimonialCard 
          imageUrl="https://dashboard.codeparrot.ai/api/image/Z8czSxQ2u-KHiHW2/img-3.png"
          text="This platform has significantly boosted my career. The resources and opportunities have helped me grow professionally like never before."
          name="Kevin Joseph"
          title="Data Scientist"
        />
        <TestimonialCard 
          imageUrl="https://dashboard.codeparrot.ai/api/image/Z8czSxQ2u-KHiHW2/img-4.png"
          text="This platform has significantly boosted my career. The resources and opportunities have helped me grow professionally like never before."
          name="Monica Gartner"
          title="Graphics Engineer"
        />
      </div>
    </div>
  );
};

export default Testimonials;
