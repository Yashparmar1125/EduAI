import React from "react";
import PropTypes from "prop-types";

const shapes = {
  round: "rounded-lg",
};

const variants = {
  fill: {
    blue_gray_900: "bg-blue_gray-900",
    gray_900_01: "bg-gray-900_01",
  },
};

const sizes = {
  xs: "h-[40px] px-2.5 text-[16px]",
  sm: "h-[50px] px-3",
};

const Input = React.forwardRef(
  (
    {
      className = "",
      name = "",
      placeholder = "",
      type = "text",
      label = "",
      prefix,
      suffix,
      onChange,
      shape,
      variant = "fill",
      size = "sm",
      color = "gray_900_01",
      ...restProps
    },
    ref
  ) => {
    return (
      <label
        className={`
          ${className} flex items-center justify-center cursor-text rounded-lg  
          ${shape && shapes[shape]} ${variant && (variants[variant]?.[color] || variants[variant])} ${size && sizes[size]}
        `}
      >
        {!!label && label}
        {!!prefix && prefix}
        <input ref={ref} type={type} name={name} placeholder={placeholder} onChange={onChange} {...restProps} />
        {!!suffix && suffix}
      </label>
    );
  }
);

Input.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  label: PropTypes.string,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  shape: PropTypes.oneOf(["round"]),
  size: PropTypes.oneOf(["xs", "sm"]),
  variant: PropTypes.oneOf(["fill"]),
  color: PropTypes.oneOf(["blue_gray_900", "gray_900_01"]),
};

export { Input };