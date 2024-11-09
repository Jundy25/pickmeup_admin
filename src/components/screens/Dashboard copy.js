import React, { useEffect, useState } from "react";
import { BadgeCheck, Clock, Eye, EyeOff, TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Sidenav from "../parts/Sidenav";
import Header from "../parts/Header";
import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";
import userService from "../../services";

const RiderVerification = ({ counts }) => {
  const totalRiders = counts.verified + counts.pending;
  const verifiedPercentage = ((counts.verified / totalRiders) * 100) || 0;
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg"> {/* Reduced padding from p-6 to p-4 */}
      <h2 className="text-lg font-bold mb-4 text-gray-800">Rider Verification Status</h2> {/* Reduced text-xl to text-lg and mb-6 to mb-4 */}
      
      <div className="space-y-4"> {/* Reduced space-y-6 to space-y-4 */}
        <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="absolute left-0 h-full bg-green-500 transition-all duration-500 ease-in-out"
            style={{ width: `${verifiedPercentage}%` }}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-green-50 rounded-lg border border-green-100 transition-all duration-200 hover:shadow-md"> {/* Reduced padding from p-4 to p-3 */}
            <div className="flex items-center justify-between mb-2">
              <BadgeCheck className="w-5 h-5 text-green-500" /> {/* Reduced from w-6 h-6 */}
              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                {verifiedPercentage.toFixed(0)}%
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-1">Verified Riders</p>
            <p className="text-2xl font-bold text-gray-800">{counts.verified}</p> {/* Reduced from text-3xl */}
          </div>

          <div className="p-3 bg-orange-50 rounded-lg border border-orange-100 transition-all duration-200 hover:shadow-md"> {/* Reduced padding from p-4 to p-3 */}
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-orange-500" /> {/* Reduced from w-6 h-6 */}
              <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                {(100 - verifiedPercentage).toFixed(0)}%
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-1">Pending Verification</p>
            <p className="text-2xl font-bold text-gray-800">{counts.pending}</p> {/* Reduced from text-3xl */}
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Total Riders: <span className="font-semibold text-gray-700">{totalRiders}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

const EarningsOverview = ({ stats, areEarningsVisible, setAreEarningsVisible }) => {
  const earningsTrend = stats.monthlyEarnings > stats.lastMonthEarnings;
  const monthlyGrowth = ((stats.monthlyEarnings - stats.lastMonthEarnings) / stats.lastMonthEarnings * 100) || 0;
  
  // Sample data for the chart - in real app, this would come from stats
  const chartData = [
    { name: 'Mon', earnings: 2400 },
    { name: 'Tue', earnings: 3000 },
    { name: 'Wed', earnings: 2800 },
    { name: 'Thu', earnings: 3200 },
    { name: 'Fri', earnings: 3800 },
    { name: 'Sat', earnings: 4200 },
    { name: 'Sun', earnings: 3600 },
  ];

  return (
    <div className="animate__animated animate__fadeIn bg-white p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">Earnings Overview</h2>
        <div className="flex items-center gap-2">
          <select className="text-sm border rounded-md px-2 py-1 text-gray-600">
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
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
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-3 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <DollarSign className="w-5 h-5 opacity-80" />
            <span className="text-xs font-medium bg-yellow-400 bg-opacity-30 px-2 py-1 rounded-full">
              This Week
            </span>
          </div>
          <p className="text-sm mt-1 opacity-90">Weekly Earnings</p>
          <p className="text-xl font-bold mt-1">
            {areEarningsVisible ? `₱${stats.weeklyEarnings.toLocaleString()}` : "****"}
          </p>
          <div className="flex items-center mt-2 text-xs">
            {earningsTrend ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            <span>{Math.abs(monthlyGrowth).toFixed(1)}% vs last week</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-3 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <Calendar className="w-5 h-5 opacity-80" />
            <span className="text-xs font-medium bg-yellow-400 bg-opacity-30 px-2 py-1 rounded-full">
              This Month
            </span>
          </div>
          <p className="text-sm mt-1 opacity-90">Monthly Earnings</p>
          <p className="text-xl font-bold mt-1">
            {areEarningsVisible ? `₱${stats.monthlyEarnings.toLocaleString()}` : "****"}
          </p>
          <div className="flex items-center mt-2 text-xs">
            {earningsTrend ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            <span>{Math.abs(monthlyGrowth).toFixed(1)}% vs last month</span>
          </div>
        </div>
      </div>

      <div className="mt-4 h-36"> {/* Fixed height for the chart */}
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis 
              hide={!areEarningsVisible}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length && areEarningsVisible) {
                  return (
                    <div className="bg-white shadow-lg rounded-lg p-2 text-sm">
                      <p className="font-medium">{`₱${payload[0].value.toLocaleString()}`}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line 
              type="monotone" 
              dataKey="earnings" 
              stroke="#EAB308" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4">
        <div className="bg-gray-50 p-2 rounded-lg">
          <p className="text-xs text-gray-500">Avg. Per Ride</p>
          <p className="font-semibold text-sm">
            {areEarningsVisible ? `₱${stats.avgPerRide?.toLocaleString() || '0'}` : "****"}
          </p>
        </div>
        <div className="bg-gray-50 p-2 rounded-lg">
          <p className="text-xs text-gray-500">Best Day</p>
          <p className="font-semibold text-sm">
            {areEarningsVisible ? (stats.bestDay || 'Saturday') : "****"}
          </p>
        </div>
        <div className="bg-gray-50 p-2 rounded-lg">
          <p className="text-xs text-gray-500">Growth</p>
          <p className="font-semibold text-sm text-green-600">
            {areEarningsVisible ? `+${monthlyGrowth.toFixed(1)}%` : "****"}
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
    pending: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [recentBookings, setRecentBookings] = useState([]);
  const [displayedBookings, setDisplayedBookings] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [stats, setStats] = useState({
    weeklyEarnings: 24500,
    monthlyEarnings: 98000,
    lastMonthEarnings: 85000,
    avgPerRide: 450,
    bestDay: 'Saturday',
    avgRideDistance: 0,
    avgRideTime: 0,
  });
  const [areEarningsVisible, setAreEarningsVisible] = useState(true);
  useEffect(() => {
    const calculatePageSize = () => {
      const rowHeight = 53;
      const tableContainer = document.querySelector(".bookings-table-container");
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

  useEffect(() => {
    const fetchCounts = async () => {
      setIsLoading(true);
      try {
        const { counts: countsData, bookings: bookingsData } =
          await userService.getDashboardCounts();
        setCounts(countsData);
        setRecentBookings(bookingsData);
        setTimeout(fetchCounts, 60000);
      } catch (error) {
        console.error("Error fetching dashboard counts:", error);
      } finally {
        setIsLoading(false);
        setIsInitialLoading(false);
      }
    };

    fetchCounts();
  }, []);

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

  return (
    <div className="flex h-screen">
      <Sidenav />
      <div className="flex flex-col w-full">
        <Header />
        <main className="flex-grow p-3 bg-gray-100 overflow-hidden"> {/* Reduced padding from p-4 to p-3 */}
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3"> {/* Reduced gap-4 to gap-3 and mb-4 to mb-3 */}
            <div className="animate__animated animate__fadeIn bg-yellow-500 p-4 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200"> {/* Reduced padding from p-6 to p-4 */}
              <h2 className="text-lg font-bold text-white mb-2">Active Riders</h2> {/* Reduced from text-xl */}
              <p className="text-3xl font-bold text-white mb-2">{counts.active_riders}</p> {/* Reduced from text-4xl */}
              <p className="text-sm text-white text-opacity-90">Total Active Riders</p>
            </div>
            <div className="animate__animated animate__fadeIn bg-yellow-500 p-4 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200">
              <h2 className="text-xl font-bold text-white mb-2">Disabled Riders</h2>
              <p className="text-4xl font-bold text-white mb-2">{counts.disabled_riders}</p>
              <p className="text-white text-opacity-90">Total Disabled Riders</p>
            </div>
            <div className="animate__animated animate__fadeIn bg-yellow-500 p-4 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200">
              <h2 className="text-xl font-bold text-white mb-2">Customers</h2>
              <p className="text-4xl font-bold text-white mb-2">{counts.customers}</p>
              <p className="text-white text-opacity-90">Total Number of Customers</p>
            </div>
            <div className="animate__animated animate__fadeIn bg-yellow-500 p-4 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200">
              <h2 className="text-xl font-bold text-white mb-2">Completed Rides</h2>
              <p className="text-4xl font-bold text-white mb-2">{counts.completed_rides}</p>
              <p className="text-white text-opacity-90">Total Completed Rides</p>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <EarningsOverview 
              stats={stats} 
              areEarningsVisible={areEarningsVisible}
              setAreEarningsVisible={setAreEarningsVisible}
            />
            <RiderVerification counts={counts} />
          </div>

          {/* Recent Bookings */}
          <div className="bg-white animate__animated animate__fadeIn rounded-lg shadow-lg p-4 flex flex-col h-[calc(100vh-420px)] min-h-[250px]"> {/* Adjusted height calculation and reduced padding */}
            <h2 className="text-lg font-bold mb-3">Recent Bookings</h2> {/* Reduced from text-xl and mb-4 to mb-3 */}
            <div className="bookings-table-container flex-grow overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> {/* Reduced padding */}
                      Booking ID
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> {/* Reduced padding */}
                      Customer
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> {/* Reduced padding */}
                      Rider
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> {/* Reduced padding */}
                      Status
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> {/* Reduced padding */}
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayedBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-4 py-3 whitespace-nowrap">{booking.id}</td> {/* Reduced padding */}
                      <td className="px-4 py-3 whitespace-nowrap">{booking.customer}</td> {/* Reduced padding */}
                      <td className="px-4 py-3 whitespace-nowrap">{booking.rider}</td> {/* Reduced padding */}
                      <td className="px-4 py-3 whitespace-nowrap">{booking.status}</td> {/* Reduced padding */}
                      <td className="px-4 py-3 whitespace-nowrap">{booking.date}</td> {/* Reduced padding */}
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