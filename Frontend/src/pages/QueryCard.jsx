
import React from "react";

const QueryCard = ({ userImage, title, description, replies, timeAgo, onOpenModal }) => {
  return (
    <div className="w-full max-w-[928px] h-auto bg-[#3A0CA3] rounded-[14px] p-6 mb-4 md:p-4 sm:p-3">
      <div className="flex gap-4 items-center flex-wrap">
        <img
          src={userImage}
          alt="User"
          className="w-[74px] h-[74px] rounded-full sm:w-[50px] sm:h-[50px]"
        />

        <div className="flex flex-col flex-grow gap-2">
          <h2 className="text-white text-xl font-bold leading-tight sm:text-lg">
            {title}
          </h2>

          <p className="text-[#d1d5db] text-base sm:text-sm">
            {description}
          </p>

          <div className="flex items-center gap-4 text-[#9ca3af] text-sm flex-wrap">
            <div className="flex items-center gap-1">
              <img
                src="https://dashboard.codeparrot.ai/api/image/Z8nnurwkNXOiaWCz/frame.png"
                alt="replies"
                className="w-[22px] h-[22px] sm:w-[18px] sm:h-[18px]"
              />
              <span>{replies}</span>
            </div>

            <div className="flex items-center gap-1">
              <img
                src="https://dashboard.codeparrot.ai/api/image/Z8nnurwkNXOiaWCz/frame-2.png"
                alt="time"
                className="w-[22px] h-[22px] sm:w-[18px] sm:h-[18px]"
              />
              <span>{timeAgo}</span>
            </div>

            <button
              className="ml-auto bg-[#24bdff] text-[#121111] font-bold px-4 py-2 rounded-lg hover:bg-[#1da7e6] transition-colors cursor-pointer sm:px-3 sm:py-1"
              onClick={onOpenModal}
            >
              Join the discussion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueryCard;
