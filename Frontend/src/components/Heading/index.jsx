import React from "react";

const sizes = {
  headingxs: "text-[18px] font-bold",
  headings: "text-[20px] font-semibold",
  headingmd: "text-[24px] font-bold md:text-[22px]",
  headinglg: "text-[30px] font-bold md:text-[28px] sm:text-[26px]",
};

const Heading = ({ children, className = "", size = "headingxs", as, ...restProps }) => {
  const Component = as || "h6";

  return (
    <Component className={`text-white-a700 font-inter ${className} ${sizes[size]}`} {...restProps}>
      {children}
    </Component>
  );
};

export { Heading };