import React from 'react';

const LeftSection = () => {
  return (
    <div className="flex flex-col items-center justify-center min-w-[240px] max-w-[560px] p-8 bg-gradient-to-r from-[#6a4c93] via-[#282828] to-[#3d3d3d] bg-size-[400%] animate-gradient bg-no-repeat rounded-2xl shadow-xl">
      <div className="w-full max-w-[280px] mb-6 flex justify-center">
        <img
          src="https://dashboard.codeparrot.ai/api/image/Z8KGqG37P2WCQpKV/img.png"
          alt="AI Learning Platform"
          className="w-full h-auto object-contain rounded-2xl"
        />
      </div>
      <div className="text-center">
        <h1 className="text-3xl font-semibold mb-5 text-white max-w-[451px]">
          Your AI-Powered Learning Journey Starts Here!
        </h1>
        <p className="text-lg text-white max-w-[351px]">
          Join thousands of learners and instructors in our innovative AI-enhanced learning platform.
        </p>
      </div>
    </div>
  );
};

export default LeftSection;
