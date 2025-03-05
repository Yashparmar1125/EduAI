import { Helmet } from 'react-helmet';
import CourseProgressOverview from '../../components/CourseProgressOverview';
import Header from '../../components/Header';
import Sidebar1 from '../../components/Sidebar1';
import MyCoursesSection from './MyCoursesSection';
import React from 'react';

const  InstructorDashboard =()=>{
  return (
    <>
      <Helmet>
        <title>Course Dashboard - Manage and Track Progress</title>
        <meta
          name="description"
          content="Access your course dashboard to manage and track progress in Advanced Web Development, Digital Marketing, and more. Engage with the community and earn certificates."
        />
      </Helmet>
      <div className="relative w-full content-center md:h-auto">
        <div className="flex-1 border-2 border-solid border-blue_gray-100_01 bg-white-a700">
          <div className="flex bg-gray-900_02">
            <Sidebar1 />
            <div className="flex-1">
              <div className="mb-[864px]">
                <Header />

                {/* my courses section */}
                <MyCoursesSection />
                <div className="my-6 ml-6 mr-[410px] flex gap-6 md:mx-0 md:flex-col">
                  <CourseProgressOverview />
                  <CourseProgressOverview
                    mainImage="images/img_img_1.png"
                    publishButtonText="Draft"
                    courseTitle="Digital Marketing Fundamentals"
                    studentsCountText="892 Students"
                    progressLabel="Progress"
                    progressPercentage="45%"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-6 right-[25.50px] m-auto h-[52px] w-[3%] rounded-[24px] bg-gradient object-contain" />
      </div>
    </>
  );
}

export default InstructorDashboard;