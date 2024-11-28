import React, { useEffect, useState, useCallback } from "react";
import { BadgeCheck, Clock, Eye, EyeOff } from "lucide-react";
import Sidenav from "../parts/Sidenav";
import Header from "../parts/Header";
import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";
import userService from "../../services";
import Pusher from "pusher-js";

const RiderVerification = ({ counts }) => {
  const totalRiders = counts.verified + counts.pending;
  const verifiedPercentage = (counts.verified / totalRiders) * 100 || 0;

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      {" "}
      {/* Reduced padding from p-6 to p-4 */}
      <h2 className="text-lg font-bold mb-2 text-gray-800">
        Rider Verification Status
      </h2>{" "}
      {/* Reduced text-xl to text-lg and mb-6 to mb-4 */}
      <div className="space-y-4">
        {" "}
        {/* Reduced space-y-6 to space-y-4 */}
        <div className="relative w-full h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute left-0 h-full bg-green-500 transition-all duration-500 ease-in-out"
            style={{ width: `${verifiedPercentage}%` }}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-green-50 rounded-lg border border-green-100 transition-all duration-200 hover:shadow-md">
            {" "}
            {/* Reduced padding from p-4 to p-3 */}
            <div className="flex items-center justify-between mb-1">
              <BadgeCheck className="w-5 h-5 text-green-500" />{" "}
              {/* Reduced from w-6 h-6 */}
              <p className="text-gray-600 text-sm mb-1">Verified Riders</p>
              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                {verifiedPercentage.toFixed(0)}%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {counts.verified}
            </p>{" "}
            {/* Reduced from text-3xl */}
          </div>

          <div className="p-3 bg-orange-50 rounded-lg border border-orange-100 transition-all duration-200 hover:shadow-md">
            {" "}
            {/* Reduced padding from p-4 to p-3 */}
            <div className="flex items-center justify-between mb-1">
              <Clock className="w-5 h-5 text-orange-500" />{" "}
              {/* Reduced from w-6 h-6 */}
              <p className="text-gray-600 text-sm mb-1">Pending Verification</p>
              <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                {(100 - verifiedPercentage).toFixed(0)}%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{counts.pending}</p>{" "}
            {/* Reduced from text-3xl */}
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Total Riders:{" "}
            <span className="font-semibold text-gray-700">{totalRiders}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const [counts, setCounts] = useState({
    active_riders: 0,
    disabled_riders: 0,
    customers: 0,
    completed_rides: 0,
    verified: 0,
    pending: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [recentBookings, setRecentBookings] = useState([]);
  const [displayedBookings, setDisplayedBookings] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [stats, setStats] = useState({
    weeklyEarnings: 0,
    monthlyEarnings: 0,
    avgRideDistance: 0,
    avgRideTime: 0,
  });
  const [areEarningsVisible, setAreEarningsVisible] = useState(true);
  const { userRole } = useAuth();

  useEffect(() => {
    const calculatePageSize = () => {
      const rowHeight = 53;
      const tableContainer = document.querySelector(
        ".bookings-table-container"
      );
      if (tableContainer) {
        const availableHeight = tableContainer.clientHeight;
        const visibleRows = Math.floor(availableHeight / rowHeight);
        setPageSize(Math.max(visibleRows - 1, 3));
      }
    };

    calculatePageSize();
    window.addEventListener("resize", calculatePageSize);
    return () => window.removeEventListener("resize", calculatePageSize);
  }, []);

  useEffect(() => {
    setDisplayedBookings(recentBookings.slice(0, pageSize));
  }, [recentBookings, pageSize]);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const { counts: countsData, bookings: bookingsData } =
        await userService.getDashboardCounts();
      setCounts(countsData);
      setRecentBookings(bookingsData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
      setIsInitialLoading(false);
    }
  }, []);

  // Update displayed bookings when data changes
  useEffect(() => {
    setDisplayedBookings(recentBookings.slice(0, pageSize));
  }, [recentBookings, pageSize]);

  // Pusher setup for booking updates
  useEffect(() => {
    // Initial data fetch
    fetchDashboardData();

    // Pusher setup
    const pusher = new Pusher("1b95c94058a5463b0b08", {
      cluster: "ap1",
      encrypted: true,
    });

    const channel = pusher.subscribe("dashboard");

    // Listen for the DASHBOARD_UPDATE event and update state
    channel.bind("DASHBOARD_UPDATE", (data) => {
      console.log(data);
      setCounts(data.counts);
      setRecentBookings(data.bookings);
    });

    // Cleanup function
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [fetchDashboardData]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (isInitialLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }
  console.log(userRole);
  return (
    <div className="flex h-screen">
      <div className="z-[9999]">
        <Sidenav />
      </div>
      <div className="flex flex-col w-full min-w-0">
        <main className="flex-grow p-3 bg-gray-100 overflow-auto">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
            <div className="animate__animated animate__fadeIn bg-yellow-500 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200">
              <h2 className="text-xl font-bold text-white mb-2">
                Active Riders
              </h2>
              <p className="text-4xl font-bold text-white mb-2">
                {counts.active_riders}
              </p>
              <p className="text-white text-opacity-90">Total Active Riders</p>
            </div>
            {userRole !== 1 ? (
              <div className="animate__animated animate__fadeIn bg-yellow-500 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200">
                <h2 className="text-xl font-bold text-white mb-2">
                  Disabled Riders
                </h2>
                <p className="text-4xl font-bold text-white mb-2">
                  {counts.disabled_riders}
                </p>
                <p className="text-white text-opacity-90">
                  Total Disabled Riders
                </p>
              </div>
            ) : (
              <div className="animate__animated animate__fadeIn bg-yellow-500 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200">
                <h2 className="text-xl font-bold text-white mb-2">
                  Active Admins
                </h2>
                <p className="text-4xl font-bold text-white mb-2">
                  {counts.admin_count !== undefined
                    ? counts.admin_count
                    : counts.admincount}
                </p>
                <p className="text-white text-opacity-90">
                  Total Active Admins
                </p>
              </div>
            )}
            <div className="animate__animated animate__fadeIn bg-yellow-500 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200">
              <h2 className="text-xl font-bold text-white mb-2">Customers</h2>
              <p className="text-4xl font-bold text-white mb-2">
                {counts.customers}
              </p>
              <p className="text-white text-opacity-90">
                Total Number of Customers
              </p>
            </div>
            <div className="animate__animated animate__fadeIn bg-yellow-500 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200">
              <h2 className="text-xl font-bold text-white mb-2">
                Completed Rides
              </h2>
              <p className="text-4xl font-bold text-white mb-2">
                {counts.completed_rides}
              </p>
              <p className="text-white text-opacity-90">
                Total Completed Rides
              </p>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="animate__animated animate__fadeIn grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4 flex justify-between items-center">
                Earnings Overview
                <button
                  onClick={() => setAreEarningsVisible(!areEarningsVisible)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {areEarningsVisible ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">Weekly Earnings</p>
                  <p className="text-2xl font-bold">
                    {areEarningsVisible
                      ? `₱${stats.weeklyEarnings.toLocaleString()}`
                      : "****"}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">Monthly Earnings</p>
                  <p className="text-2xl font-bold">
                    {areEarningsVisible
                      ? `₱${stats.monthlyEarnings.toLocaleString()}`
                      : "****"}
                  </p>
                </div>
              </div>
            </div>

            {/* Updated Rider Verification Component */}
            <RiderVerification counts={counts} />
          </div>

          {/* Recent Bookings */}
          <div className="bg-white animate__animated animate__fadeIn rounded-lg shadow-lg p-6 flex flex-col h-[calc(100vh-540px)] min-h-[300px]">
            <h2 className="text-xl font-bold mb-4">Recent Bookings</h2>
            <div className="bookings-table-container flex-grow overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rider
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fare
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayedBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        #{booking.ride_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {booking.user
                          ? `${booking.user.first_name} ${booking.user.last_name}`
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {booking.rider
                          ? `${booking.rider.first_name} ${booking.rider.last_name}`
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            booking.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "Canceled"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        ₱{booking.fare}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
