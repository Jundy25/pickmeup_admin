import React, { useEffect, useState } from "react";
import Sidenav from "../parts/Sidenav";
import Header from "../parts/Header";
import userService from "../../services";

export const BookingHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customerSearch, setCustomerSearch] = useState("");
  const [riderSearch, setRiderSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await userService.fetchHistory();
        console.log(data); // Log the response data
        setHistory(data);
      } catch (error) {
        console.error("There was an error fetching the History!", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleClearSearch = () => {
    setCustomerSearch("");
    setRiderSearch("");
    setStartDate("");
  };

  const filteredHistory = history.filter((booking) => {
    const customerName = booking.user
      ? `${booking.user.first_name} ${booking.user.last_name}`.toLowerCase()
      : "";
    const riderName = booking.rider
      ? `${booking.rider.first_name} ${booking.rider.last_name}`.toLowerCase()
      : "";
    const rideDate = new Date(booking.ride_date);
    const formattedDate = rideDate.toLocaleDateString();
    const formattedTime = rideDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const rideDateTime = `${formattedDate} ${formattedTime}`;

    const start = startDate
      ? new Date(startDate).toISOString().split("T")[0]
      : null;

    const isWithinDateRange =
      !start || rideDate.toISOString().split("T")[0] === start;

    return (
      customerName.includes(customerSearch.toLowerCase()) &&
      riderName.includes(riderSearch.toLowerCase()) &&
      isWithinDateRange
    );
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHistory.slice(indexOfFirstItem, indexOfLastItem);

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate Total Pages
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

  // Generate Page Numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="z-[9999]">
        <Sidenav />
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <main className="flex-1 p-3 bg-gray-100 overflow-auto">
          <div className="min-w-fit">
            <div className="bg-white shadow rounded-lg flex flex-col">
              <div className="p-4 border-b border-gray-200 overflow-x-auto">
                <h2 className="text-xl font-bold">Booking History</h2>
                <div className="flex flex-wrap gap-4 mt-4 min-w-max">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Search Customer"
                      className="border border-gray-300 rounded px-4 py-2"
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                    />
                    <button
                      className="px-4 py-2 bg-gray-200 rounded-lg"
                      onClick={() => setCustomerSearch("")}
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Search Rider"
                      className="border border-gray-300 rounded px-4 py-2"
                      value={riderSearch}
                      onChange={(e) => setRiderSearch(e.target.value)}
                    />
                    <button
                      className="px-4 py-2 bg-gray-200 rounded-lg"
                      onClick={() => setRiderSearch("")}
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="date"
                      className="border border-gray-300 rounded px-4 py-2"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                    <button
                      className="px-4 py-2 bg-gray-200 rounded-lg"
                      onClick={() => setStartDate("")}
                    >
                      Clear
                    </button>
                  </div>
                  <button
                    className="px-4 py-2 bg-gray-200 rounded-lg"
                    onClick={handleClearSearch}
                  >
                    Clear All
                  </button>
                </div>
              </div>
              {/*  */}
              {loading ? (
                <div className="p-4 text-center">Loading...</div>
              ) : (
                <div className=" overflow-x-auto">
                  <table className="animate__animated animate__fadeIn min-w-full bg-white">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b border-gray-200 text-left">
                          Ride ID
                        </th>
                        <th className="py-2 px-4 border-b border-gray-200 text-left">
                          Customer
                        </th>
                        <th className="py-2 px-4 border-b border-gray-200">
                          Rider
                        </th>
                        <th className="py-2 px-4 border-b border-gray-200">
                          Date & Time
                        </th>
                        <th className="py-2 px-4 border-b border-gray-200">
                          Type
                        </th>
                        <th className="py-2 px-4 border-b border-gray-200">
                          Pick Up Location
                        </th>
                        <th className="py-2 px-4 border-b border-gray-200">
                          Drop Off Location
                        </th>
                        <th className="py-2 px-4 border-b border-gray-200">
                          Fare
                        </th>
                        <th className="py-2 px-4 border-b border-gray-200">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((booking, index) => {
                        const rideDate = new Date(booking.ride_date);
                        const formattedDate = rideDate.toLocaleDateString();
                        const formattedTime = rideDate.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        });
                        const rideDateTime = `${formattedDate} ${formattedTime}`;

                        return (
                          <tr key={index}>
                            <td className="py-2 px-4 border-b border-gray-200">
                              {booking.ride_id || "N/A"}
                            </td>
                            <td className="py-2 px-4 border-b border-gray-200">
                              {booking.user
                                ? `${booking.user.first_name} ${booking.user.last_name}`
                                : "N/A"}
                            </td>
                            <td className="py-2 px-4 border-b border-gray-200">
                              {booking.rider
                                ? `${booking.rider.first_name} ${booking.rider.last_name}`
                                : "N/A"}
                            </td>
                            <td className="py-2 px-4 border-b border-gray-200">
                              {rideDateTime}
                            </td>
                            <td className="py-2 px-4 border-b border-gray-200">
                              {booking.ride_type}
                            </td>
                            <td className="py-2 px-4 border-b border-gray-200">
                              {booking.pickup_location}
                            </td>
                            <td className="py-2 px-4 border-b border-gray-200">
                              {booking.dropoff_location}
                            </td>
                            <td className="py-2 px-4 border-b border-gray-200">
                              {booking.fare}
                            </td>
                            <td className="py-2 px-4 border-b border-gray-200">
                              {booking.status}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
        {/* Footer for Pagination */}
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
  );
};
