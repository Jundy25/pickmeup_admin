// Sidenav.js
import React, { useContext } from "react";
import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import logo from "../pictures/Pick-Me-Up-Logo.png";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { AuthContext } from "../../context/AuthContext";

const Sidenav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userRole } = useAuth();
  const { isSideBarMenuOpen } = useContext(AuthContext);

  const handleClick = (item) => {
    if (location.pathname !== item) {
      navigate(item);
    }
  };

  const menuItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/riderslist", label: "Manage Riders", parent: "Riders" },
    { path: "/riderspayment", label: "Rider Payment", parent: "Riders" },
    { path: "/ridersapplicant", label: "Rider Applications", parent: "Riders" },
    { path: "/riderslocation", label: "Rider Location", parent: "Riders" },
    { path: "/manageuser", label: "Manage Users" },
    { path: "/manageadmin", label: "Manage Admin", role: 1 },
    { path: "/bookinghistory", label: "Booking History" },
    { path: "/feedback", label: "Feedbacks" },
    { path: "/report", label: "Reports" },
  ];

  const isActive = (path) => location.pathname === path;
  const isParentActive = (parent) =>
    menuItems
      .filter((item) => item.parent === parent)
      .some((item) => isActive(item.path)) ||
    location.pathname.startsWith("/riders");

  return (
    <>
      {isSideBarMenuOpen && (
        <div className="bg-yellow-500 w-64 h-screen fixed top-0 left-0 overflow-y-auto">
          <div className="p-4 flex justify-between items-center ">
            <Link to={"/dashboard"}>
              <div className="flex space-x-2 items-center">
                <img src={logo} alt="Logo" className="h-10 w-10" />
                <span className="text-white font-bold text-xl">PickMeUp</span>
              </div>
            </Link>
          </div>
          <div className="mt-4">
            {/* Dashboard */}
            <button
              onClick={() => handleClick("/dashboard")}
              className={`block w-full text-left px-4 py-2 ${
                isActive("/dashboard")
                  ? "bg-yellow-600 text-white cursor-not-allowed"
                  : "text-black bg-yellow-500 hover:bg-yellow-600"
              }`}
              disabled={isActive("/dashboard")}
            >
              Dashboard
            </button>

            {/* Riders */}
            <Disclosure defaultOpen={isParentActive("Riders")}>
              {({ open }) => (
                <>
                  <Disclosure.Button className="w-full flex justify-between items-center p-4 text-white bg-black mt-2">
                    <span>Riders</span>
                    <ChevronDownIcon
                      className={`w-5 h-5 ${
                        open ? "transform rotate-180" : ""
                      }`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="bg-gray-800 text-white">
                    {menuItems
                      .filter((item) => item.parent === "Riders")
                      .map((child, childIndex) => (
                        <button
                          key={childIndex}
                          onClick={() => handleClick(child.path)}
                          className={`block w-full text-left px-4 py-2 ${
                            isActive(child.path)
                              ? "bg-yellow-600 text-white cursor-not-allowed"
                              : "hover:bg-gray-700"
                          }`}
                          disabled={isActive(child.path)}
                        >
                          {child.label}
                        </button>
                      ))}
                  </Disclosure.Panel>
                  <Disclosure.Panel className="bg-gray-800 text-white">
                    {menuItems
                      .filter((item) => item.parent === "RidersPayment")
                      .map((child, childIndex) => (
                        <button
                          key={childIndex}
                          onClick={() => handleClick(child.path)}
                          className={`block w-full text-left px-4 py-2 ${
                            isActive(child.path)
                              ? "bg-yellow-600 text-white cursor-not-allowed"
                              : "hover:bg-gray-700"
                          }`}
                          disabled={isActive(child.path)}
                        >
                          {child.label}
                        </button>
                      ))}
                  </Disclosure.Panel>
                  <Disclosure.Panel className="bg-gray-800 text-white">
                    {menuItems
                      .filter((item) => item.parent === "RidersLocation")
                      .map((child, childIndex) => (
                        <button
                          key={childIndex}
                          onClick={() => handleClick(child.path)}
                          className={`block w-full text-left px-4 py-2 ${
                            isActive(child.path)
                              ? "bg-yellow-600 text-white cursor-not-allowed"
                              : "hover:bg-gray-700"
                          }`}
                          disabled={isActive(child.path)}
                        >
                          {child.label}
                        </button>
                      ))}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>

            {/* Manage Users */}
            <button
              onClick={() => handleClick("/manageuser")}
              className={`block w-full text-left px-4 py-2 ${
                isActive("/manageuser")
                  ? "bg-yellow-600 text-white cursor-not-allowed"
                  : "text-black bg-yellow-500 hover:bg-yellow-600"
              }`}
              disabled={isActive("/manageuser")}
            >
              Manage Users
            </button>

            {/* Manage Admin */}
            {userRole === 1 && (
              <button
                onClick={() => handleClick("/manageadmin")}
                className={`block w-full text-left px-4 py-2 ${
                  isActive("/manageadmin")
                    ? "bg-yellow-600 text-white cursor-not-allowed"
                    : "text-black bg-yellow-500 hover:bg-yellow-600"
                }`}
                disabled={isActive("/manageadmin")}
              >
                Manage Admin
              </button>
            )}

            {/* Booking History */}
            <button
              onClick={() => handleClick("/bookinghistory")}
              className={`block w-full text-left px-4 py-2 ${
                isActive("/bookinghistory")
                  ? "bg-yellow-600 text-white cursor-not-allowed"
                  : "text-black bg-yellow-500 hover:bg-yellow-600"
              }`}
              disabled={isActive("/bookinghistory")}
            >
              Booking History
            </button>

            {/* Feedback */}
            <button
              onClick={() => handleClick("/feedback")}
              className={`block w-full text-left px-4 py-2 ${
                isActive("/feedback")
                  ? "bg-yellow-600 text-white cursor-not-allowed"
                  : "text-black bg-yellow-500 hover:bg-yellow-600"
              }`}
              disabled={isActive("/feedback")}
            >
              Feedbacks
            </button>

            {/* Report */}
            <button
              onClick={() => handleClick("/report")}
              className={`block w-full text-left px-4 py-2 ${
                isActive("/report")
                  ? "bg-yellow-600 text-white cursor-not-allowed"
                  : "text-black bg-yellow-500 hover:bg-yellow-600"
              }`}
              disabled={isActive("/report")}
            >
              Reports
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidenav;
