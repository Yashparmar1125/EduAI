import { Img, Text, Heading, Button } from "./..";
import React from "react";

export default function CourseProgressOverview({
  mainImage = "images/img_img_192x360.png",
  publishButtonText = "Published",
  courseTitle = "Advanced Web Development",
  studentsCountText = "1,234 Students",
  progressLabel = "Progress",
  progressPercentage = "85%",
  ...props
}) {
  return (
    <div
      {...props}
      className={`${props.className} flex flex-col w-[50%] md:w-full md:px-5 border-blue_gray-800_7f border border-solid bg-blue_gray-900_7f rounded-[12px]`}
    >
      <div className="relative h-[192px] content-center self-stretch">
        <Img src={mainImage} alt="Image" className="h-[192px] w-full flex-1 object-cover" />
        <Button
          size="xs"
          variant="fill"
          className="absolute right-[13.30px] top-[9px] m-auto min-w-[88px] rounded-[12px] px-3 font-inter"
        >
          {publishButtonText}
        </Button>
      </div>
      <div className="flex flex-col items-start justify-center self-stretch p-5">
        <Heading as="h6" className="text-[18px] font-bold">
          {courseTitle}
        </Heading>
        <div className="mt-2 flex items-center gap-2 self-stretch">
          <Img src="images/img_contrast.svg" alt="1234 Students" className="h-[16px]" />
          <Text as="p" className="!font-inter text-[16px] font-normal">
            {studentsCountText}
          </Text>
        </div>
        <div className="mt-4 flex flex-col gap-1 self-stretch">
          <div className="flex flex-wrap justify-between gap-5">
            <Text size="textxs" as="p" className="!font-inter text-[14px] font-normal">
              {progressLabel}
            </Text>
            <Text size="textxs" as="p" className="!font-inter text-[14px] font-normal !text-deep_purple-a100">
              {progressPercentage}
            </Text>
          </div>
          <div className="flex rounded bg-blue_gray-800">
            <div className="h-[8px] w-[84%] bg-gradient1" />
          </div>
        </div>
        <div className="mt-8 flex justify-between gap-5 self-stretch">
          <Img src="images/img_frame_blue_gray_300.svg" alt="Progress" className="h-[16px]" />
          <Img src="images/img_frame_blue_gray_300_16x16.svg" alt="Image" className="h-[16px]" />
          <Img src="images/img_frame_blue_gray_300_16x18.svg" alt="Image" className="h-[16px]" />
          <Img src="images/img_thumbs_up.svg" alt="Image" className="h-[16px]" />
        </div>
      </div>
    </div>
  );
}