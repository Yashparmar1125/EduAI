import { Img } from "./..";
import React from "react";
import { MenuItem, Menu, Sidebar } from "react-pro-sidebar";

export default function Sidebar1({ ...props }) {
  const [collapsed, setCollapsed] = React.useState(false);

  //use this function to collapse/expand the sidebar
  //function collapseSidebar() {
  //    setCollapsed(!collapsed)
  //}

  return (
    <Sidebar
      {...props}
      width="258px !important"
      collapsedWidth="80px !important"
      collapsed={collapsed}
      className={`${props.className} flex flex-col h-screen pt-[104px] top-0 md:pt-5 bg-gray-900 !sticky overflow-auto`}
    >
      <Menu
        menuItemStyles={{
          button: {
            padding: "14px 14px 14px 24px",
            gap: "12px",
            color: "#d1d5db",
            fontWeight: 400,
            fontSize: "16px",
            [`&:hover, &.ps-active`]: { color: "#ffffff", backgroundColor: "#1f2937 !important" },
          },
        }}
        className="w-full self-stretch"
      >
        <MenuItem icon={<Img src="images/img_dashboard.svg" alt="Dashboard" className="h-[16px] w-[16px]" />}>
          Dashboard
        </MenuItem>
        <MenuItem icon={<Img src="images/img_frame.svg" alt="Image" className="h-[16px] w-[20px]" />}>Courses</MenuItem>
        <MenuItem icon={<Img src="images/img_lock.svg" alt="Lock" className="h-[16px] w-[20px]" />}>Community</MenuItem>
        <MenuItem icon={<Img src="images/img_close.svg" alt="Close" className="h-[16px] w-[16px]" />}>
          Certificates
        </MenuItem>
        <MenuItem icon={<Img src="images/img_frame_blue_gray_100.svg" alt="Image" className="h-[16px] w-[16px]" />}>
          Settings
        </MenuItem>
      </Menu>
    </Sidebar>
  );
}