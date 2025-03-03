import React from 'react';
import LeftSection from './LeftSection';
import RightSection from './RightSection';
import './Layout.css';

const Layout = () => {
  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-background/95">
      <div className="flex-grow flex justify-center items-center">
        <LeftSection />
      </div>
      <div className="flex-grow flex justify-center items-center">
        <RightSection />
      </div>
    </div>
  );
};

export default Layout;
