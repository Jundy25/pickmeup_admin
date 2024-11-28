// src/App.js
import React, { useContext, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  Navigate,
} from "react-router-dom";
import Login from "./components/screens/Login";
import { Dashboard } from "./components/screens/Dashboard";
import { Feedback } from "./components/screens/Feedback";
import { Report } from "./components/screens/Reports";
import RidersList from "./components/screens/riders/RidersList";
import { ManageUser } from "./components/screens/ManageUser";
import { BookingHistory } from "./components/screens/BookingHistory";
import { RidersApplicant } from "./components/screens/riders/RidersApplicant";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import ManageAdmin from "./components/screens/super-admin/ManageAdmin";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Sidenav from "./components/parts/Sidenav";
import Settings from "./components/Settings";
import ManageAccount from "./components/ManageAccount";
import RidersPayment from "./components/screens/riders/RidersPayment";
import RidersLocation from "./components/screens/riders/RidersLocation";
import Header from "./components/parts/Header";
const AxiosInterceptor = ({ children }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          logout();
          navigate("/");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate, logout]);

  return children;
};

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const { isSideBarMenuOpen } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
          <Sidenav />
        <main
        className={`transition-all duration-300 ${
          isSideBarMenuOpen ? "lg:ml-64" : ""
          }`}
        >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/report" element={<Report />} />
            <Route path="/riderslist" element={<RidersList />} />
            <Route path="/ridersapplicant" element={<RidersApplicant />} />
            <Route path="/riderspayment" element={<RidersPayment />} />
            <Route path="/manageuser" element={<ManageUser />} />
            <Route path="/manageadmin" element={<ManageAdmin />} />
            <Route path="/bookinghistory" element={<BookingHistory />} />
            <Route path="/riderslocation" element={<RidersLocation />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/manageacc" element={<ManageAccount />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
      </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AxiosInterceptor>
          <div className="App">
            <AppContent />
          </div>
        </AxiosInterceptor>
      </Router>
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;
