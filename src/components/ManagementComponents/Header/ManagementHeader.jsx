import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../../../redux/features/sidebarSlice";
import { NavLink } from "react-router-dom";
const ManagementHeader = () => {
  const dispatch = useDispatch();

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };
  const isOpen = useSelector((state) => state.sidebar?.isOpen);

  return (
    <>
      <header className="navbar bg-base-100 text-grey py-4">
        <div className="navbar-start">
          <label
            htmlFor="my-drawer-2"
            className="mx-10 bg-white text-primary drawer-button lg:hidden cursor-pointer"
          >
            <i className="fa-solid fa-bars"></i>
          </label>
          <NavLink to={"/"}>
            <span className="mx-10 normal-case text-xl font-bold text-primary">
              MODA
            </span>
          </NavLink>
        </div>
        <div className="navbar-end">
          <button className="btn btn-ghost btn-circle">
            <i className="fas fa-search"></i>
          </button>
          <button className="btn btn-ghost btn-circle">
            <div className="indicator">
              <i className="fas fa-bell"></i>
              <span className="badge badge-xs badge-primary indicator-item"></span>
            </div>
          </button>
        </div>
      </header>
    </>
  );
};
export default ManagementHeader;
