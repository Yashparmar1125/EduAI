import React from 'react';

import heroImg from '../../assets/heroImg.png';

import FourOptions from './FourOptions'; // Import FourOptions component
import TrendingCourses from './TrendingCourses'; // Import TrendingCourses component
import Testimonials from './Testimonials'; // Import Testimonials component

const TopSection = () => {
  return (
    <div className="w-full min-h-[808px] bg-[#111827] flex justify-center items-center px-[10%] ">
      <div className="flex items-center justify-between w-full max-w-[1280px] gap-10">
        <div className="max-w-[700px] text-left flex flex-col items-start gap-2.5">
          <h1 className="w-full text-left m-0 font-urbanist text-[50px] font-bold text-white leading-tight max-w-[600px] -tracking-wider">
            Unlock Your Potential with Personalized Learning Paths
          </h1>
          <p className="font-urbanist text-2xl text-white">
            Join our community of learners and start your journey towards mastery
          </p>
          <div className="mt-5">
            <button className="bg-[#4cc9f0] text-black font-urbanist font-bold text-lg px-8 py-4 rounded-xl transition-colors duration-200 hover:bg-[#3db8df]">
              Start Learning
            </button>
          </div>
        </div>
        <div className="max-w-[650px] h-auto">
          <img
            src={heroImg}
            alt="Hero"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </div>

  );
};

export default TopSection;
