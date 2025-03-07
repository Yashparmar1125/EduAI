import React from 'react';


const FourOptions = () => {
  const options = [
    {
      icon: "https://dashboard.codeparrot.ai/api/image/Z8X6dMhTinWyM7Gv/healthic.png",
      title: "SKILL ASSESSMENT",
      description: "Elevate your potential! Click to assess your skills and discover where you stand."
    },
    {
      icon: "https://dashboard.codeparrot.ai/api/image/Z8X6dMhTinWyM7Gv/gis-map.png",
      title: "INTERNSHIPS",
      description: "Kickstart Your Career! Explore exciting internships and gain real-world experience."
    },
    {
      icon: "https://dashboard.codeparrot.ai/api/image/Z8X6dMhTinWyM7Gv/fluent-c.png",
      title: "COMMUNITY",
      description: "Find Your Tribe! Join a thriving community that matches your passion and interests."
    },
    {
      icon: "https://dashboard.codeparrot.ai/api/image/Z8X6dMhTinWyM7Gv/carbon-d.png",
      title: "DASHBOARD",
      description: "Your Learning Hub! Track progress, ongoing lectures, certificates, and more."
    }
  ];

  return (
    <div className="bg-black min-h-screen p-8">
      <h1 className="font-urbanist text-5xl font-black text-white text-center mb-12">
        Your Personalized Path to Success
      </h1>
      
      <div className="max-w-[900px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {options.map((option, index) => (
          <div 
            key={index} 
            className="bg-white rounded-xl p-6 cursor-pointer relative min-h-[273px] transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
          >
            <div className="mb-6">
              <img src={option.icon} alt={option.title} className="w-[52px] h-[52px] object-contain" />
            </div>
            <div className="mt-auto">
              <h2 className="font-urbanist text-[1.4rem] font-bold text-black mb-2">
                {option.title}
              </h2>
              <p className="font-urbanist text-lg font-semibold text-[#727272] mt-6">
                {option.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FourOptions;

