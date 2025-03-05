import React from "react";
import PropTypes from "prop-types";

const shapes = {
  round: "rounded-lg",
};
const variants = {
  gradient: {
    blue_A700_deep_purple_A200_01: "bg-gradient text-white-a700",
  },
  fill: {
    teal_400_33: "bg-teal-400_33 text-teal-300",
    amber_700_33: "bg-amber-700_33 text-yellow-700",
    blue_gray_900: "bg-blue_gray-900 text-white-a700",
    deep_purple_A200_01: "bg-deep_purple-a200_01 shadow-xs text-white-a700",
  },
};
const sizes = {
  md: "h-[48px] px-6 text-[16px]",
  sm: "h-[40px] px-4 text-[16px]",
  xs: "h-[24px] px-3 text-[14px]",
};

const Button = ({
  children,
  className = "",
  leftIcon,
  rightIcon,
  shape,
  variant = "gradient",
  size = "sm",
  color = "teal_400_33",
  ...restProps
}) => {
  return (
    <button
      className={`
        ${className} flex flex-row items-center justify-center text-center cursor-pointer whitespace-nowrap 
        ${shape && shapes[shape]} ${size && sizes[size]} ${variant && variants[variant]?.[color]}`
      }
      {...restProps}
    >
      {!!leftIcon && leftIcon}
      {children}
      {!!rightIcon && rightIcon}
    </button>
  );
};

Button.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  shape: PropTypes.oneOf(["round"]),
  size: PropTypes.oneOf(["md", "sm", "xs"]),
  variant: PropTypes.oneOf(["gradient", "fill"]),
  color: PropTypes.oneOf([
    "blue_A700_deep_purple_A200_01",
    "teal_400_33",
    "amber_700_33",
    "blue_gray_900",
    "deep_purple_A200_01",
  ]),
};

export { Button };