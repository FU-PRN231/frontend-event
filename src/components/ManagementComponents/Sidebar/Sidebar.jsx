import { useState } from "react";
import {
  FaCalendarPlus,
  FaChartBar,
  FaClipboardList,
  FaHistory,
  FaHome,
  FaMoneyBill,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";

const SideBar = () => {
  const roleName = useSelector((state) => state.user?.role || "");
  const [isOpen, setIsOpen] = useState(false);

  const location = useLocation();

  const menuItems = {
    ORGANIZER: [
      { name: "Dashboard", link: "dashboard", icon: <FaHome /> },
      { name: "Surveys", link: "surveys", icon: <FaClipboardList /> },
      { name: "Reports", link: "reports", icon: <FaChartBar /> },
    ],
    PM: [
      { name: "Dashboard", link: "dashboard", icon: <FaHome /> },
      { name: "Event", link: "event", icon: <FaCalendarPlus /> },
    ],
    SPONSOR: [
      { name: "Dashboard", link: "dashboard", icon: <FaHome /> },
      { name: "Sponsor", link: "sponsor", icon: <FaHome /> },
      { name: "Add New", link: "add-new", icon: <FaCalendarPlus /> },
      { name: "View History", link: "view-history", icon: <FaHistory /> },
      { name: "Add Money", link: "add-money", icon: <FaMoneyBill /> },
    ],
  };

  const renderMenu = (items) => {
    if (!items) return null;
    return items.map((item, index) => (
      <>
        {/* <NavLink to={`/${roleName.toLowerCase()}/${item.link}`} key={index}> */}
        <NavLink to={`${item.link}`} key={index}>
          <li className="hover:bg-primary rounded-md text-black hover:text-white my-1">
            <a
              className={`flex items-center ${
                location.pathname?.includes(item.link)
                  ? "bg-primary text-white"
                  : ""
              }`}
            >
              {item.icon}
              <span className={`inline ml-2 text-md`}>{item.name}</span>
            </a>
          </li>
        </NavLink>
      </>
    ));
  };

  return (
    <div className="">
      <div className="h-full border-r border-gray-100 drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-side z-10  rounded-4xl">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>

          <ul className="menu p-4 w-60 min-h-full  bg-white text-base-content">
            {roleName && renderMenu(menuItems[roleName])}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
