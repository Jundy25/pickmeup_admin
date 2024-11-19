import React, { useContext, useState, useEffect } from "react";
import { Menu, Dialog, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { useNavigate } from "react-router-dom";
import { Fragment } from "react";
import UserIcon from "../pictures/User-icon.png";
import userService from "../../services";
import { useAuth } from "../../hooks/useAuth";
import { AuthContext } from "../../context/AuthContext";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { isSideBarMenuOpen, setIsSideBarMenuOpen } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await userService.logout();
      logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      // 768px is Tailwind's md breakpoint
      if (window.innerWidth >= 768) {
        setIsSideBarMenuOpen(false);
      }
    };

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Initial check
    handleResize();

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsSideBarMenuOpen]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleMenuSideBar = () => {
    setIsSideBarMenuOpen(!isSideBarMenuOpen);
    console.log(isSideBarMenuOpen);
  };

  return (
    <>
      {/* Header Component */}
      <header className="bg-black text-white flex items-center justify-between p-4 relative z-50">
        <div className="flex items-center space-x-2 ">
          <div
            onClick={() => setIsSideBarMenuOpen(!isSideBarMenuOpen)}
            className={`p-2 ${
              isSideBarMenuOpen ? "ml-60" : "justify-start"
            } hover:bg-[#C8A400] rounded-full cursor-pointer`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </div>
        </div>
        <div className="relative">
          <Menu>
            {({ open }) => (
              <>
                <Menu.Button className="flex items-center space-x-2">
                  <span>ADMIN</span>
                  <ChevronDownIcon
                    className={`w-5 h-5 ${open ? "transform rotate-180" : ""}`}
                  />
                  <img
                    src={UserIcon}
                    alt="User Icon"
                    className="h-6 w-6 rounded-full"
                  />
                </Menu.Button>
                <Menu.Items className="absolute right-0 mt-2 w-48 bg-[#343536] shadow-lg rounded-lg overflow-hidden z-50">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        onClick={() => navigate("/manageacc")}
                        className={`block px-4 py-2 text-white cursor-pointer ${
                          active ? "bg-gray-600" : ""
                        }`}
                      >
                        Manage Account
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        onClick={openModal}
                        className={`block px-4 py-2 text-white cursor-pointer ${
                          active ? "bg-gray-600" : ""
                        }`}
                      >
                        Logout
                      </a>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </>
            )}
          </Menu>
        </div>
      </header>

      {/* Confirmation Modal */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="bg-white p-6 rounded-lg shadow-xl">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Confirm Logout
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to log out?
                    </p>
                  </div>

                  <div className="mt-4 flex space-x-4 justify-end">
                    <button
                      type="button"
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="bg-red-600 text-white px-4 py-2 rounded-lg"
                      onClick={() => {
                        handleLogout();
                        closeModal();
                      }}
                    >
                      Logout
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Header;
