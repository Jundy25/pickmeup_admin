import React, { useEffect, useState } from "react";
import Sidenav from "../../parts/Sidenav";
import Header from "../../parts/Header";
import userService from "../../../services";
import swal from "sweetalert2";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

const RidersList = () => {
  const [riders, setRiders] = useState([]);
  const [selectedRiders, setSelectedRiders] = useState([]);
  const [loadingActivate, setLoadingActivate] = useState(false);
  const [loadingDisable, setLoadingDisable] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filteredRiders, setFilteredRiders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    action: null,
    title: "",
    message: "",
  });

  useEffect(() => {
    const fetchRiders = async () => {
      try {
        setLoading(true);
        const data = await userService.fetchRiders();
        console.log("Fetched Riders Data:", data); // Log fetched data to the console
        setRiders(data);
        setFilteredRiders(data);
      } catch (error) {
        console.error("There was an error fetching the riders!", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRiders();
  }, []);

  useEffect(() => {
    setFilteredRiders(riders);
  }, [riders]);

  // Filter riders based on search input
  const handleFilter = () => {
    const filtered = riders.filter((rider) =>
      `${rider.first_name} ${rider.last_name}`
        .toLowerCase()
        .includes(searchInput.toLowerCase())
    );
    setFilteredRiders(filtered);
    setCurrentPage(1); // Reset to first page
  };

  // Clear search input and reset filter
  const clearSearchAndFilter = () => {
    setSearchInput("");
    setFilteredRiders(riders);
    setCurrentPage(1); // Reset to first page
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRiders.slice(indexOfFirstItem, indexOfLastItem);

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate Total Pages
  const totalPages = Math.ceil(filteredRiders.length / itemsPerPage);

  // Generate Page Numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handleSelectRider = (riderId) => {
    setSelectedRiders((prevSelectedRiders) => {
      if (prevSelectedRiders.includes(riderId)) {
        return prevSelectedRiders.filter((id) => id !== riderId);
      } else {
        return [...prevSelectedRiders, riderId];
      }
    });
  };

  const showConfirmationModal = (action) => {
    const isActivate = action === "activate";
    setConfirmationModal({
      isOpen: true,
      action: action,
      title: `Confirm ${isActivate ? "Activation" : "Disable"}`,
      message: `Are you sure you want to ${
        isActivate ? "activate" : "disable"
      } the selected rider${selectedRiders.length > 1 ? "s" : ""}?`,
    });
  };

  const handleActivateRiders = async () => {
    setConfirmationModal({ ...confirmationModal, isOpen: false });
    setLoadingActivate(true);
    try {
      const responses = await Promise.all(
        selectedRiders.map((riderId) =>
          userService.updateUserStatus(riderId, "Active")
        )
      );

      responses.forEach((response) => {
        const { first_name, last_name } = response.user;
        swal.fire({
          title: `${first_name} ${last_name} status updated successfully`,
          icon: "success",
          toast: true,
          timer: 3000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });
      });

      setRiders((prevRiders) =>
        prevRiders.map((rider) =>
          selectedRiders.includes(rider.user_id)
            ? { ...rider, status: "Active" }
            : rider
        )
      );

      setSelectedRiders([]);
    } catch (error) {
      console.error("Error activating riders:", error);
    } finally {
      setLoadingActivate(false);
    }
  };

  const handleDisableRiders = async () => {
    setConfirmationModal({ ...confirmationModal, isOpen: false });
    setLoadingDisable(true);
    try {
      const responses = await Promise.all(
        selectedRiders.map((riderId) =>
          userService.updateUserStatus(riderId, "Disabled")
        )
      );

      responses.forEach((response) => {
        const { first_name, last_name } = response.user;
        swal.fire({
          title: `${first_name} ${last_name} status updated successfully`,
          icon: "success",
          toast: true,
          timer: 3000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });
      });

      setRiders((prevRiders) =>
        prevRiders.map((rider) =>
          selectedRiders.includes(rider.user_id)
            ? { ...rider, status: "Disabled" }
            : rider
        )
      );
      setSelectedRiders([]);
    } catch (error) {
      console.error("Error disabling riders:", error);
    } finally {
      setLoadingDisable(false);
    }
  };

  const handleConfirmAction = () => {
    if (confirmationModal.action === "activate") {
      handleActivateRiders();
    } else if (confirmationModal.action === "disable") {
      handleDisableRiders();
    }
  };

  const isAnySelectedActive = selectedRiders.some((riderId) => {
    const rider = riders.find((r) => r.user_id === riderId);
    return rider?.status === "Active";
  });

  const isAnySelectedDisabled = selectedRiders.some((riderId) => {
    const rider = riders.find((r) => r.user_id === riderId);
    return rider?.status === "Disabled";
  });

  const openModal = (riderId) => {
    const riderInfo = riders.find((rider) => rider.user_id === riderId);
    setModalInfo(riderInfo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalInfo(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-grow">
        <div className="z-[9999]">
          <Sidenav />
        </div>
        <div className="flex flex-col w-full">
          <Header />
          <main className="flex-grow p-4 bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">VERIFIED RIDERS LIST</h1>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Search Names"
                    className="px-4 py-2 border rounded-lg"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                  <button
                    className="px-4 py-2 border rounded-lg"
                    onClick={handleFilter}
                  >
                    Filter
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-200 rounded-lg"
                    onClick={clearSearchAndFilter}
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
                <table className="animate__animated animate__fadeIn w-full text-left table-auto">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedRiders(
                                riders.map((rider) => rider.user_id)
                              );
                            } else {
                              setSelectedRiders([]);
                            }
                          }}
                          checked={
                            selectedRiders.length === riders.length &&
                            riders.length > 0
                          }
                        />
                      </th>
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">Phone Number</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">License Expiration</th>
                      <th className="px-4 py-2">OR Expiration</th>
                      <th className="px-4 py-2">Availability</th>
                      <th className="px-4 py-2">More</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((rider) => (
                      <tr key={rider.user_id} className="border-t">
                        <td className="px-4 py-2">
                          <input
                            type="checkbox"
                            checked={selectedRiders.includes(rider.user_id)}
                            onChange={() => handleSelectRider(rider.user_id)}
                          />
                        </td>
                        <td className="px-4 py-2">
                          {rider.first_name} {rider.last_name}
                        </td>
                        <td className="px-4 py-2">{rider.mobile_number}</td>
                        <td className="px-4 py-2">
                          {rider.status === "Active" ? (
                            <span className="inline-flex items-center">
                              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                              <span>{rider.status}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center">
                              <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                              <span>{rider.status}</span>
                            </span>
                          )}
                        </td>
                        <td>
                          {rider.rider?.requirement_photos?.length > 0
                            ? rider.rider.requirement_photos
                                .filter((photo) => photo.requirement_id === 6)
                                .map((photo, index) => (
                                  <>
                                    <span key={index}>{photo.photo_url}</span>
                                  </>
                                ))
                            : "No License Expiration Date"}
                        </td>
                        <td>
                          {rider.rider?.requirement_photos?.length > 0
                            ? rider.rider.requirement_photos
                                .filter((photo) => photo.requirement_id === 3)
                                .map((photo, index) => (
                                  <span key={index}>{photo.photo_url}</span>
                                ))
                            : "No OR Expiration Date"}
                        </td>
                        <td>
                          <span>{rider.rider.availability}</span>
                        </td>
                        <td className="px-4 py-2">
                          <button
                            className="bg-gray-700 text-white font-bold py-1 px-3 rounded hover:bg-gray-400"
                            onClick={() => openModal(rider.user_id)}
                          >
                            Info
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <div className="mt-6 flex items-center space-x-4">
                <button
                  className={`${
                    loadingDisable
                      ? "bg-red-700"
                      : isAnySelectedDisabled
                      ? "bg-red-300"
                      : "bg-red-500 hover:bg-red-700"
                  } text-white font-bold py-2 px-4 rounded-full`}
                  onClick={() => showConfirmationModal("disable")}
                  disabled={
                    isAnySelectedDisabled ||
                    loadingDisable ||
                    selectedRiders.length === 0
                  }
                >
                  {loadingDisable ? "Disabling..." : "Disable"}
                </button>
                <button
                  className={`${
                    loadingActivate
                      ? "bg-green-700"
                      : isAnySelectedActive
                      ? "bg-green-300"
                      : "bg-green-500 hover:bg-green-700"
                  } text-white font-bold py-2 px-4 rounded-full`}
                  onClick={() => showConfirmationModal("activate")}
                  disabled={
                    isAnySelectedActive ||
                    loadingActivate ||
                    selectedRiders.length === 0
                  }
                >
                  {loadingActivate ? "Activating..." : "Activate Rider"}
                </button>
              </div>
              {/* Add the Confirmation Modal */}
              <Transition.Root show={confirmationModal.isOpen} as={Fragment}>
                <Dialog
                  as="div"
                  className="relative z-50"
                  onClose={() =>
                    setConfirmationModal({
                      ...confirmationModal,
                      isOpen: false,
                    })
                  }
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
                                {confirmationModal.title}
                              </Dialog.Title>
                              <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                  {confirmationModal.message}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                            <button
                              type="button"
                              className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 sm:col-start-2"
                              onClick={handleConfirmAction}
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                              onClick={() =>
                                setConfirmationModal({
                                  ...confirmationModal,
                                  isOpen: false,
                                })
                              }
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
            </div>
          </main>
          <footer className="bg-white p-2 shadow-md">
            <div className="flex justify-between items-center">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`bg-gray-300 px-2 py-1 rounded ${
                  currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                Previous
              </button>
              <div className="flex gap-2">
                {pageNumbers.map((number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`px-2 py-1 rounded ${
                      number === currentPage
                        ? "cursor-not-allowed bg-gray-200"
                        : "bg-gray-300 font-bold"
                    }`}
                  >
                    {number}
                  </button>
                ))}
              </div>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`bg-gray-300 px-2 py-1 rounded ${
                  currentPage === totalPages
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }`}
              >
                Next
              </button>
            </div>
          </footer>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white w-1/2 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-yellow-600 mb-4">
              Rider Information
            </h2>
            {modalInfo && (
              <div className="space-y-2">
                <p>
                  <strong className="text-gray-700">Name:</strong>{" "}
                  {modalInfo.first_name} {modalInfo.last_name}
                </p>
                <p>
                  <strong className="text-gray-700">Phone Number:</strong>{" "}
                  {modalInfo.mobile_number}
                </p>
                <p>
                  <strong className="text-gray-700">Status:</strong>{" "}
                  {modalInfo.status}
                </p>
                <p>
                  <strong className="text-gray-700">License Expiration:</strong>{" "}
                  {modalInfo.license_expiration}
                </p>
                <p>
                  <strong className="text-gray-700">OR Expiration:</strong>{" "}
                  {modalInfo.or_expiration}
                </p>
                <p>
                  <strong className="text-gray-700">Email:</strong>{" "}
                  {modalInfo.email}
                </p>
                <p>
                  <strong className="text-gray-700">Date of Birth:</strong>{" "}
                  {modalInfo.date_of_birth
                    ? new Date(modalInfo.date_of_birth).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            )}
            <div className="mt-6 flex justify-end">
              <button
                className="bg-yellow-600 text-white py-2 px-6 rounded hover:bg-yellow-500 focus:outline-none"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RidersList;
