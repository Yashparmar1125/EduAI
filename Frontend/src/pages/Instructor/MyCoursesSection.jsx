import { Button, Img, Text, Heading } from "../../components";
import React from "react";

export default function MyCoursesSection() {
  return (
    <>
      {/* my courses section */}
      <div className="mt-1 flex items-center px-6 md:flex-col sm:px-5">
        <div className="flex w-full flex-col items-start justify-center">
          <Heading size="headingmd" as="h1" className="text-[24px] font-bold md:text-[22px]">
            My Courses
          </Heading>
          <Text as="p" className="!font-inter text-[16px] font-normal">
            Manage and track your course progress
          </Text>
        </div>
        <div className="flex w-full justify-end gap-4">
          <Img
            src="images/img_television.svg"
            alt="Television"
            className="h-[40px] w-[12%] rounded-lg object-contain"
          />
          <Button
            shape="round"
            color="blue_A700_deep_purple_A200_01"
            leftIcon={
              <Img
                src="images/img_frame_white_a700.svg"
                alt="Frame"
                className="my-0.5 h-[16px] w-[14px] object-contain"
              />
            }
            className="min-w-[202px] gap-2 rounded-lg px-4 font-inter"
          >
            Create New Course
          </Button>
        </div>
      </div>
    </>
  );
}