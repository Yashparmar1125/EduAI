import { CloseSVG } from "../Input/close";
import { Img, Input } from "./..";
import React from "react";

export default function Header({ ...props }) {
  const [searchBarValue, setSearchBarValue] = React.useState("");

  return (
    <header {...props} className={`${props.className} border-blue_gray-900 border-b border-solid bg-gray-900_cc`}>
      <div className="flex w-full justify-between gap-5 px-6 py-4 md:flex-col sm:px-5">
        <Input
          color="blue_gray_900"
          size="xs"
          shape="round"
          name="search"
          placeholder={`Search courses...`}
          value={searchBarValue}
          onChange={(e) => setSearchBarValue(e.target.value)}
          prefix={
            <div className="flex h-[16px] w-[14px] items-center justify-center">
              <Img src="images/img_search.svg" alt="Search" className="my-0.5 h-[16px] w-[16px] object-contain" />
            </div>
          }
          suffix={
            searchBarValue?.length > 0 ? (
              <CloseSVG onClick={() => setSearchBarValue("")} height={16} width={16} />
            ) : null
          }
          className="w-[50%] gap-3 rounded-lg px-2.5 font-inter text-blue_gray-200 md:w-full"
        />
        <div className="flex items-center gap-4">
          <a href="#">
            <Img src="images/img_button.svg" alt="Button" className="h-[32px]" />
          </a>
          <a href="#">
            <Img src="images/img_img.png" alt="Img" className="h-[40px] rounded-[20px] object-cover" />
          </a>
        </div>
      </div>
    </header>
  );
}