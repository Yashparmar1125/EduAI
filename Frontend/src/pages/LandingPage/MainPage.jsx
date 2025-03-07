import React from 'react';
import TopSection from './TopSection';
import FourOptions from './FourOptions';
import TrendingCourses from './TrendingCourses';
import Testimonials from './Testimonials';

const MainPage = () => {
  return (
    <div className="w-full min-h-screen">
      <TopSection />
      <FourOptions />
      <TrendingCourses />
      <Testimonials />
    </div>
  );
};

export default MainPage;