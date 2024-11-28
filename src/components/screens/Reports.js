import React, { useEffect, useState } from "react";
import Sidenav from "../parts/Sidenav";
import Header from "../parts/Header";
import userService from "../../services";

export const Report = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await userService.fetchReports();
        setReports(response.data);
        console.log(response.data)
      } catch (error) {
        console.error("There was an error fetching the feedbacks!", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Filter feedbacks based on search input
  const filteredReports = reports.filter((report) =>
    `${report.sender_first_name || ""} ${report.sender_last_name || ""}`
      .toLowerCase()
      .includes(searchInput.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReports.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate Total Pages
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  // Generate Page Numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-grow">
        <div className="z-[9999]">
          <Sidenav />
        </div>
        <div className="flex flex-col w-full">
          <main className="flex-grow p-2 bg-gray-100 overflow-auto">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center overflow-x-auto mb-4">
                <h2 className="text-2xl font-bold">Reports</h2>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Search Names"
                    className="px-4 py-2 border rounded-lg"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                  <button className="px-4 py-2 bg-gray-200 rounded-lg">
                    Filter
                  </button>
                </div>
              </div>
              {loading ? (
                <div className="p-4 text-center">Loading...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="animate__animated animate__fadeIn w-full bg-gray-100 rounded-lg shadow">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="p-4 text-left">Sender</th>
                        <th className="p-4 text-left">Reason</th>
                        <th className="p-4 text-left">Recipient</th>
                        <th className="p-4 text-left">Comment</th>
                        <th className="p-4 text-left">Date</th>
                        <th className="p-4 text-left">Ride ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((report) => (
                        <tr
                          className="bg-white border-b"
                          key={report.report_id}
                        >
                          <td className="p-4">
                            {report.sender_first_name &&
                            report.sender_last_name
                              ? `${report.sender_first_name} ${report.sender_last_name}`
                              : "N/A"}
                          </td>
                          <td className="p-4">{report.reason || "N/A"}</td>
                          <td className="p-4">
                            {report.recipient_first_name &&
                            report.recipient_last_name
                              ? `${report.recipient_first_name} ${report.recipient_last_name}`
                              : "N/A"}
                          </td>
                          <td className="p-4">
                          {report.comment || "N/A"}
                          </td>
                          <td className="p-4">
                            {report.created_at
                              ? new Date(
                                  report.created_at
                                ).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className="p-4">{report.ride_id || "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </main>
          {/* Footer with Pagination */}
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
    </div>
  );
};
