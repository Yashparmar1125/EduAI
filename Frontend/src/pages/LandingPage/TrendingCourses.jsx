import React, { useRef } from 'react';


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
    <div className="w-full py-8 px-4 flex flex-col items-center bg-[#111827] text-white text-center relative">
      <h1 className="font-urbanist text-5xl font-black text-white mb-4">Trending Courses</h1>
      <p className="font-urbanist text-xl font-semibold text-white my-5 text-center max-w-[840px] mb-8">
        Explore Top Courses, Master New Skills, and Level Up Your Career.
      </p>
      
      <div className="absolute top-1/2 w-full flex justify-between transform -translate-y-1/2">
        <button 
          className="bg-[#111827] border-none text-white text-3xl px-4 py-2 cursor-pointer transition-colors hover:bg-black/80" 
          onClick={scrollLeft}
        >
          &lt;
        </button>
        <button 
          className="bg-[#111827] border-none text-white text-3xl px-4 py-2 cursor-pointer transition-colors hover:bg-black/80" 
          onClick={scrollRight}
        >
          &gt;
        </button>
      </div>

      <div
        ref={containerRef}
        className="flex flex-row gap-8 flex-nowrap overflow-x-hidden pb-4 w-full max-w-[1280px] cursor-grab active:cursor-grabbing scrollbar-hide"
      >
        {duplicatedCourses.map((course, index) => (
          <div 
            key={index} 
            className="w-full h-[378px] bg-white rounded-xl border border-[#f3f4f6] overflow-hidden p-6 max-w-[300px] transition-all duration-200 flex-none hover:transform hover:-translate-y-1.5 hover:shadow-lg"
          >
            <img src={course.courseImg} alt={course.title} className="w-full h-48 object-cover rounded-xl mb-4" />
            <div className="p-0">
              <div className="flex items-center gap-2 mb-2">
                <img src={course.badgeIcon} alt="" className="w-3.5 h-3.5" />
                <span className="font-urbanist" style={{ color: course.badgeColor }}>
                  {course.badge}
                </span>
              </div>
              <h2 className="font-urbanist text-xl font-bold text-black mb-3">{course.title}</h2>
              <div className="flex items-center gap-2 mb-2">
                <img src={course.instructorImg} alt={course.instructor} className="w-8 h-8 rounded-full" />
                <span className="font-urbanist text-sm text-gray-600">{course.instructor}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-urbanist text-sm text-gray-600">

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

