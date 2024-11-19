import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Sidenav from "../../parts/Sidenav";
import Header from "../../parts/Header";
import userService from "../../../services";
import AddAdminForm from "./AddAdminForm";

const UserCard = ({ admin, onStatusChange, onEdit }) => {
  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    pendingStatus: null,
  });

  const handleStatusChangeClick = () => {
    const newStatus = admin.status === "Active" ? "Disabled" : "Active";
    setConfirmationModal({
      isOpen: true,
      title: `${newStatus === "Active" ? "Enable" : "Disable"} Admin User`,
      message: `Are you sure you want to ${
        newStatus === "Active" ? "enable" : "disable"
      } ${admin.first_name} ${admin.last_name}?`,
      pendingStatus: newStatus,
    });
  };

  const handleConfirmStatusChange = async () => {
    try {
      setLoading(true);
      await userService.updateAdminStatus(
        admin.user_id,
        confirmationModal.pendingStatus
      );
      onStatusChange(admin.user_id, confirmationModal.pendingStatus);
    } catch (error) {
      console.error(
        `Error updating user status for user ${admin.user_id}:`,
        error
      );
    } finally {
      setLoading(false);
      setConfirmationModal({ ...confirmationModal, isOpen: false });
    }
  };

  return (
    <>
      <div className="border p-4 rounded-lg shadow-sm bg-white mb-4 flex items-center">
        <img src="" alt="Avatar" className="h-12 w-12 rounded-full" />
        <div className="ml-4 flex-1">
          <p className="font-bold">
            {admin.first_name} {admin.last_name}
          </p>
          <p className="text-gray-500 font-bold">{admin.email}</p>
          <p className="text-gray-500 font-bold">{admin.mobile_number}</p>
          <p className="text-gray-500 font-bold">
            Status:{" "}
            <span
              className={`${
                admin.status === "Active" ? "text-green-600" : "text-red-600"
              }`}
            >
              {admin.status}
            </span>
          </p>
        </div>
        <div className="flex flex-col items-center">
          <button
            className={`${
              admin.status === "Active" ? "bg-red-500" : "bg-green-500"
            } text-white py-1 px-2 rounded mb-2 flex items-center justify-center`}
            onClick={handleStatusChangeClick}
            disabled={loading}
          >
            {loading
              ? "Loading..."
              : admin.status === "Active"
              ? "Disable"
              : "Enable"}
          </button>
          <button
            className="bg-yellow-500 text-white py-1 px-5 rounded flex items-center justify-center"
            onClick={() => onEdit(admin.user_id)}
          >
            Edit
          </button>
        </div>
      </div>

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
    </>
  );
};

const ManageAdmin = () => {
  // Rest of the ManageAdmin component remains the same
  const [showForm, setShowForm] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [editingAdminId, setEditingAdminId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSuccess = (message) => {
    setSuccessMessage(message);
    fetchAdmins();

    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const adminList = await userService.fetchAdmin();
      setAdmins(adminList);
    } catch (error) {
      console.error("Error fetching admins:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleStatusChange = (userId, newStatus) => {
    setAdmins((prevAdmins) =>
      prevAdmins.map((admin) =>
        admin.user_id === userId ? { ...admin, status: newStatus } : admin
      )
    );
  };

  const handleEdit = (userId) => {
    setEditingAdminId(userId);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingAdminId(null);
    setShowForm(true);
  };

  return (
    <div className="flex min-h-screen">
      <Sidenav />
      <div className="flex flex-col w-full">
        <main className="flex-grow p-4 bg-gray-100">
          <div className="flex">
            <div className="flex-1">
              <header className="bg-black text-white flex items-center justify-between p-4">
                <h1 className="font-bold text-xl">Admin Users</h1>
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded"
                  onClick={handleAddNew}
                >
                  Add Admin
                </button>
              </header>

              <div className="p-4">
                {showForm && (
                  <AddAdminForm
                    setShowForm={setShowForm}
                    setAdmins={setAdmins}
                    editingAdminId={editingAdminId}
                    editingAdmin={admins.find(
                      (a) => a.user_id === editingAdminId
                    )}
                    onSuccess={handleSuccess}
                  />
                )}
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="loader">Loading...</div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    {admins.map((adminUser) => (
                      <UserCard
                        key={adminUser.user_id}
                        admin={adminUser}
                        onStatusChange={handleStatusChange}
                        onEdit={handleEdit}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      {successMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default ManageAdmin;
