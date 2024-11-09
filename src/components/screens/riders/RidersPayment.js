import React, { useState } from "react";
import Header from "../../parts/Header";
import Sidenav from "../../parts/Sidenav";

const RidersPayment = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // New state for modal type
  const [riderName, setRiderName] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState("");

  // Sample data - replace with actual data from your backend
  const [payments, setPayments] = useState([
    { id: 1, riderName: "John Doe", amount: 150, date: "2024-10-01" },
    { id: 2, riderName: "Jane Smith", amount: 200, date: "2024-09-25" },
    { id: 3, riderName: "Michael Brown", amount: 180, date: "2024-09-18" },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPayment = {
      id: payments.length + 1,
      riderName,
      amount: Number(paymentAmount),
      date: paymentDate,
    };
    setPayments([newPayment, ...payments]);
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType("");
    resetForm();
  };

  const resetForm = () => {
    setRiderName("");
    setPaymentAmount("");
    setPaymentDate("");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-grow">
        <div className="z-[9999]">
          <Sidenav />
        </div>
        <div className="flex flex-col w-full">
          <Header />
          <main className="flex-grow p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Riders Payments</h1>
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setModalType("recordPayment");
                }}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Record Payment
              </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="animate__animated animate__fadeIn min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Riders Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Proof of Payment
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.riderName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${payment.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.date}
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900">
                        <button
                          onClick={() => {
                            setIsModalOpen(true);
                            setModalType("viewProof");
                          }}
                          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">
                      {modalType === "recordPayment"
                        ? "Record New Payment"
                        : "Proof of Payment"}
                    </h2>
                    <button
                      onClick={closeModal}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Conditional content for the modal */}
                  {modalType === "recordPayment" ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Form Fields for Record Payment */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Riders Name
                        </label>
                        <input
                          type="text"
                          value={riderName}
                          onChange={(e) => setRiderName(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Payment Amount
                        </label>
                        <input
                          type="number"
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Payment Date
                        </label>
                        <input
                          type="date"
                          value={paymentDate}
                          onChange={(e) => setPaymentDate(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </div>
                      <div className="flex justify-end gap-3 mt-6">
                        <button
                          type="button"
                          onClick={closeModal}
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                          Save Payment
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div>
                      {/* Content for Viewing Proof of Payment */}
                      <p>
                        This is where you would display the proof of payment
                        details.
                      </p>
                      <button
                        onClick={closeModal}
                        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        Close
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default RidersPayment;
