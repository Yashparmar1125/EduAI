import React from "react";

const sizes = {
  textxs: "text-[14px] font-normal",
  texts: "text-[16px] font-normal",
  textmd: "text-[20px] font-normal",
};

const Text = ({ children, className = "", as, size = "texts", ...restProps }) => {
  const Component = as || "p";

  return (
    <Component className={`text-blue_gray-300 font-poppins ${className} ${sizes[size]} `} {...restProps}>
      {children}
    </Component>
  );
};

export { Text };