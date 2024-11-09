import React, { useState, useEffect, useContext, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Sidenav from "../../parts/Sidenav";
import Header from "../../parts/Header";
import userService from "../../../services";
import { img_url } from "../../../api_url";
import defaultProfileLogo from "../../pictures/avatar.png";
import { X, Loader } from "react-feather";
import swal from "sweetalert2";
import { AuthContext } from "../../../context/AuthContext";

// UserCard component
const UserCard = ({ rider, onMoreInfo }) => {
  const { user, requirementphotos, verification_status } = rider;

  const getStatusColor = (status) => {
    switch (status) {
      case "Unverified":
        return "text-orange-600";
      case "Pending":
        return "text-yellow-600";
      case "Verified":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const statusColor = getStatusColor(verification_status);

  return (
    <div className="border p-2 rounded-lg shadow-sm bg-white mb-4">
      <div className="flex items-center">
        <img
          src={user.avatar || defaultProfileLogo}
          alt="Avatar"
          className="h-12 w-12 rounded-full"
        />
        <div className="ml-4">
          <p className="font-bold">{user.first_name}</p>
          <p className="text-gray-600">@{user.user_name}</p>
          <p className="text-xs">
            <span className={statusColor}>{verification_status}</span>
          </p>
        </div>
        <div className="ml-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoreInfo(user, requirementphotos, verification_status);
            }}
            className="bg-gray-700 text-white px-2 py-1 rounded hover:bg-gray-400 transition-colors"
          >
            More Info
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal component
const Modal = ({
  verification_status,
  user,
  requirementphotos,
  onClose,
  onVerifyClick,
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isSideBarMenuOpen } = useContext(AuthContext); // Add this line to get sidebar state

  if (!user) return null;

  const BASE_URL = `${img_url}/storage/`;

  const requirementMapping = {
    1: "Motorcycle Picture",
    2: "ROCR",
    3: "OR Expiration Date",
    4: "Drivers License",
    5: "Drivers License Number",
    6: "License Expiration Date",
    7: "TPL Insurance",
    8: "Barangay Clearance",
    9: "Police Clearance",
    10: "Plate Number",
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Unverified":
        return "text-orange-600";
      case "Pending":
        return "text-yellow-600";
      case "Verified":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const handleVerificationToggle = async () => {
    setIsLoading(true);
    try {
      await onVerifyClick(user.user_id, verification_status);
      onClose(); // Close the modal after verification is complete
    } catch (error) {
      console.error("Error toggling verification status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderRequirement = (photo) => {
    const fullUrl = `${BASE_URL}${photo.photo_url}`;
    const isTextRequirement = [3, 5, 6, 10].includes(photo.requirement_id);

    const handleImageClick = () => {
      if (!isTextRequirement) {
        setSelectedImage(fullUrl);
      }
    };

    return (
      <div
        key={photo.requirement_id}
        className="bg-gray-200 p-4 rounded text-center h-full"
      >
        <p className="text-gray-700 font-medium mb-2">
          {requirementMapping[photo.requirement_id]}
        </p>
        {isTextRequirement ? (
          <p className="mt-2 text-lg font-semibold break-all">
            {photo.photo_url}
          </p>
        ) : (
          <img
            src={fullUrl}
            alt={requirementMapping[photo.requirement_id]}
            className="w-full h-48 object-cover rounded cursor-pointer"
            onClick={handleImageClick}
          />
        )}
      </div>
    );
  };

  const statusColor = getStatusColor(verification_status);

  // Calculate modal position and width based on sidebar state
  const modalClasses = `
    fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50
    ${isSideBarMenuOpen ? 'pl-64' : ''} transition-all duration-300
  `;

  const modalContentClasses = `
    bg-white rounded-lg shadow-lg overflow-y-auto relative
    w-11/12 max-w-7xl max-h-[90vh]
    ${isSideBarMenuOpen ? 'ml-0' : 'mx-auto'}
    p-4 md:p-8
  `;

  return (
    <div className={modalClasses}>
      <div className={modalContentClasses}>
        <div className="flex flex-col md:flex-row items-center md:items-start space-x-0 md:space-x-6">
          <div className="flex-shrink-0 mb-4 md:mb-0">
            <img
              src={user.avatar || defaultProfileLogo}
              alt="Avatar"
              className="h-24 w-24 md:h-32 md:w-32 rounded-full"
            />
          </div>
          <div className="flex-grow text-center md:text-left">
            <div className="flex flex-col md:flex-row justify-between items-center mb-2">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-0">
                {user.first_name} {user.last_name}
              </h2>
              <button
                className={`px-4 py-2 rounded transition-colors ${
                  verification_status === "Verified"
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                } flex items-center justify-center`}
                onClick={handleVerificationToggle}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader className="animate-spin mr-2" size={16} />
                ) : null}
                {verification_status === "Verified" ? "Unverify" : "Verify"}
              </button>
            </div>
            <p className="text-xs">
              <span className={statusColor}>{verification_status}</span>
            </p>
            <p className="text-gray-600 text-base md:text-lg mb-1">@{user.user_name}</p>
            <p className="text-gray-600 text-base md:text-lg mb-1">{user.mobile_number}</p>
            <p className="text-gray-600 text-base md:text-lg mb-1">{user.email}</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Requirements</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {requirementphotos && requirementphotos.length > 0 ? (
              requirementphotos.map(renderRequirement)
            ) : (
              <p className="text-gray-600">No requirements available</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {selectedImage && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50">
          <div className={`bg-white p-4 rounded-lg shadow-lg relative max-w-4xl w-full mx-4 ${isSideBarMenuOpen ? 'ml-64' : ''}`}>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 text-red-600 hover:text-red-800 transition-colors"
            >
              <X size={24} />
            </button>
            <img
              src={selectedImage}
              alt="Enlarged"
              className="w-full h-auto rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Main Component
export const RidersApplicant = () => {
  const [riders, setRiders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [filteredRiders, setFilteredRiders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verificationData, setVerificationData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRiders = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const data = await userService.fetchRequirements();
        const sortedData = sortRiders(data);
        setRiders(sortedData);
        setFilteredRiders(sortedData);
      } catch (error) {
        console.error("Error fetching riders:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchRiders();
  }, []);

  const sortRiders = (ridersList) => {
    const order = { Pending: 0, Verified: 1, Unverified: 2 };
    return ridersList.sort(
      (a, b) => order[a.verification_status] - order[b.verification_status]
    );
  };

  useEffect(() => {
    const filtered = riders.filter((rider) =>
      `${rider.user.first_name} ${rider.user.last_name} ${rider.user.user_name}${rider.verification_status}`
        .toLowerCase()
        .includes(searchInput.toLowerCase())
    );
    const sortedFiltered = sortRiders(filtered);
    setFilteredRiders(sortedFiltered);
    setCurrentPage(1);
  }, [searchInput, riders]);

  const clearSearch = () => {
    setSearchInput("");
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRiders = filteredRiders.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredRiders.length / itemsPerPage);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handleStatusChange = async (userId, newStatus) => {
    setRiders((prevRiders) => {
      const updatedRiders = prevRiders.map((rider) =>
        rider.user.user_id === userId
          ? { ...rider, verification_status: newStatus }
          : rider
      );
      return sortRiders(updatedRiders);
    });

    setFilteredRiders((prevFilteredRiders) => {
      const updatedFilteredRiders = prevFilteredRiders.map((rider) =>
        rider.user.user_id === userId
          ? { ...rider, verification_status: newStatus }
          : rider
      );
      return sortRiders(updatedFilteredRiders);
    });

    setSelectedUser((prev) => {
      if (prev && prev.user.user_id === userId) {
        return {
          ...prev,
          verification_status: newStatus,
        };
      }
      return prev;
    });
  };

  const handleVerifyClick = async (userId, currentStatus) => {
    const newStatus = currentStatus === "Verified" ? "Pending" : "Verified";
    setVerificationData({
      userId,
      currentStatus,
      newStatus,
    });
    setIsModalOpen(true);
  };

  const handleVerificationConfirm = async () => {
    if (!verificationData) return;

    setIsLoading(true);
    try {
      const response = await userService.verifyRider(
        verificationData.userId,
        verificationData.newStatus
      );

      if (response) {
        swal.fire({
          title: "User Status Successfully Updated",
          icon: "success",
          toast: true,
          timer: 3000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });

        await handleStatusChange(
          verificationData.userId,
          verificationData.newStatus

          
        );
        
      }
    } catch (error) {
      console.error("Error updating verification status:", error);

      swal.fire({
        title: "Error updating verification status",
        icon: "error",
        toast: true,
        timer: 3000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
      setVerificationData(null);
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-grow">
          <div className="z-[9999]">
            <Sidenav />
          </div>
          <div className=" flex flex-col w-full">
            <Header />
            <main className="flex-grow p-4 bg-gray-100 overflow-auto">
              <div className="flex justify-between items-center mb-2">
                <h1 className="text-2xl font-bold">Rider Requirements</h1>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Search Name or Username"
                    className="px-7 py-2 border rounded-lg"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                  <button
                    className="px-4 py-2 bg-gray-200 rounded-lg"
                    onClick={clearSearch}
                  >
                    Clear
                  </button>
                </div>
              </div>
              {loading ? (
                <div className="flex justify-center items-center py-10">
                  <svg
                    className="animate-spin h-10 w-10 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              ) : (
                <div className="p-2">
                  {currentRiders.map((rider, index) => (
                    <UserCard
                      key={index}
                      rider={rider}
                      onMoreInfo={() =>
                        setSelectedUser({
                          verification_status: rider.verification_status,
                          user: rider.user,
                          requirementphotos: rider.requirementphotos,
                        })
                      }
                    />
                  ))}
                </div>
              )}
            </main>

            <footer className="bg-white p-2 shadow-md">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`bg-gray-300 px-2 py-1 rounded-md text-sm ${
                    currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Prev
                </button>
                <span className="text-gray-600 text-sm font-bold">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`bg-gray-300 px-2 py-1 rounded-md text-sm ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  Next
                </button>
              </div>
            </footer>
          </div>
        </div>
        {selectedUser && (
          <Modal
            user={selectedUser.user}
            requirementphotos={selectedUser.requirementphotos}
            verification_status={selectedUser.verification_status}
            onClose={() => setSelectedUser(null)}
            onStatusChange={handleStatusChange}
            onVerifyClick={handleVerifyClick}
          />
        )}
      </div>
      {/* Confirmation Modal */}
      <Transition.Root show={isModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-semibold leading-6 text-gray-900"
                      >
                        Confirm{" "}
                        {verificationData?.newStatus === "Verified"
                          ? "Verification"
                          : "Unverification"}
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to{" "}
                          {verificationData?.newStatus === "Verified"
                            ? "verify"
                            : "unverify"}{" "}
                          this rider?
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 sm:col-start-2"
                      onClick={handleVerificationConfirm}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader className="animate-spin mr-2" size={16} />
                      ) : null}
                      Confirm
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};
