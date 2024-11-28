import React, { useEffect, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Sidenav from "../parts/Sidenav";
import Header from "../parts/Header";
import userService from "../../services";
import swal from "sweetalert2";

const UserCard = ({
  customer,
  handleStatusChangeClick,
  loadingUserId,
  openModal,
}) => {
  const isLoading = loadingUserId === customer.user_id;

  return (
    <tr key={customer.user_id}>
      <td className="py-0.5 px-4">
        {customer.first_name} {customer.last_name}
      </td>
      <td className="py-0.5 px-4 text-center">
        <span
          className={`px-4 py-2 rounded ${
            customer.status === "Active" ? "text-green-600" : "text-red-600"
          } text-gray-400 font-bold`}
        >
          {customer.status}
        </span>
      </td>

      <td className="py-0.5 px-4 text-right">
        <button
          className={`${
            customer.status === "Active" ? "bg-red-500" : "bg-green-500"
          } text-white px-2 py-1 rounded`}
          style={{ minWidth: "100px" }} // Adjust width as needed
          onClick={() => handleStatusChangeClick(customer)}
          disabled={isLoading}
        >
          {isLoading ? (
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
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
          ) : customer.status === "Active" ? (
            "Disable"
          ) : (
            "Enable"
          )}
        </button>
      </td>

      <td className="py-0.5 px-4 text-center">
        <button
          className="bg-gray-700 text-white font-bold py-1 px-3 rounded hover:bg-gray-400"
          onClick={() => openModal(customer)}
        >
          Info
        </button>
      </td>
    </tr>
  );
};

export const ManageUser = () => {
  const [customers, setCustomers] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [loadingUserId, setLoadingUserId] = useState(null);
  const [infoModal, setInfoModal] = useState({
    isOpen: false,
    customer: null,
  });
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    customerToUpdate: null,
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const data = await userService.fetchCustomers();
        setCustomers(data);
        setFilteredCustomers(data);
      } catch (error) {
        console.error("There was an error fetching the Customers!", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleFilter = () => {
    const filtered = customers.filter((customer) =>
      `${customer.first_name} ${customer.last_name}`
        .toLowerCase()
        .includes(searchInput.toLowerCase())
    );
    setFilteredCustomers(filtered);
    setCurrentPage(1);
  };

  const handleStatusChangeClick = (customer) => {
    const newStatus = customer.status === "Active" ? "Disabled" : "Active";
    setConfirmationModal({
      isOpen: true,
      title: `${newStatus === "Active" ? "Enable" : "Disable"} User`,
      message: `Are you sure you want to ${
        newStatus === "Active" ? "enable" : "disable"
      } ${customer.first_name} ${customer.last_name}?`,
      customerToUpdate: customer,
    });
  };

  const handleConfirmStatusChange = async () => {
    const customer = confirmationModal.customerToUpdate;
    if (!customer) return;

    try {
      setLoadingUserId(customer.user_id);
      const newStatus = customer.status === "Active" ? "Disabled" : "Active";
      const response = await userService.updateUserStatus(
        customer.user_id,
        newStatus
      );

      const updatedCustomers = filteredCustomers.map((c) =>
        c.user_id === customer.user_id ? { ...c, status: newStatus } : c
      );
      setFilteredCustomers(updatedCustomers);

      const { first_name, last_name } = response.user;
      swal.fire({
        title: `Customer ${first_name} ${last_name} Status Successfully Updated`,
        icon: "success",
        toast: true,
        timer: 3000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(
        `Error updating user status for user ${customer.user_id}:`,
        error
      );
    } finally {
      setLoadingUserId(null);
      setConfirmationModal({ ...confirmationModal, isOpen: false });
    }
  };

  const openModal = (customer) => {
    setSelectedCustomer(customer);
    console.log(customer);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setSelectedCustomer(null);
  };

  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="z-[9999]">
        <Sidenav />
      </div>
      <div className="flex-grow flex flex-col">
        <main className="flex-grow bg-gray-100">
          <div className="p-2">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-2 border-b border-gray-200">
                <h2 className="text-xl font-bold">Users</h2>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Search Names"
                    className="border border-gray-300 rounded-l px-4 py-2"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                  <button
                    className="bg-gray-300 px-4 py-2 rounded-r"
                    onClick={handleFilter}
                  >
                    Filter
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
                <div className="overflow-auto">
                  <table className="animate__animated animate__fadeIn min-w-full bg-white table-auto">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b border-gray-200 text-left">
                          Customer Name
                        </th>
                        <th className="px-4 border-b border-gray-200 py-2 text-center ">
                          Status
                        </th>
                        <th className="px-4 border-b border-gray-200 py-2 text-right ">
                          Action
                        </th>
                        <th className="px-4 border-b border-gray-200 py-2 ">
                          More
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentCustomers.map((customer) => (
                        <UserCard
                          key={customer.user_id}
                          customer={customer}
                          handleStatusChangeClick={handleStatusChangeClick}
                          loadingUserId={loadingUserId}
                          openModal={openModal}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
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

      {/* Confirmation Modal */}
      <Transition.Root show={confirmationModal.isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() =>
            setConfirmationModal({ ...confirmationModal, isOpen: false })
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
                      onClick={handleConfirmStatusChange}
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
      {/* Modal for User Info */}
      {showModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">User Information</h2>
            <p>
              <strong>Name:</strong> {selectedCustomer.first_name}{" "}
              {selectedCustomer.last_name}
            </p>
            <p>
              <strong>Status:</strong> {selectedCustomer.status}
            </p>
            <p>
              <strong>Mobile Number:</strong> {selectedCustomer.mobile_number}
            </p>
            <button
              className="bg-gray-700 text-white font-bold py-1 px-3 rounded mt-4"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
