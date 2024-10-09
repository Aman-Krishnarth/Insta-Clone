import React from "react";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./LeftSidebar";

function MainLayout() {
  return (
    <div className="">
      <LeftSidebar />

      <div className="">
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;