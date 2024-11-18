import axios from "axios";
import { API_URL, img_url } from "./api_url";
import swal from "sweetalert2";

const userService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(API_URL + "login", { email, password });

      if (response.data.status === "Disabled") {
        // Successful login
        swal.fire({
          title: "Account Disabled! Please Contact SuperAdmin for More Info!",
          icon: "warning",
          toast: true,
          timer: 4000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });

        // Additional actions if needed, like saving the token
        return response.data;
      }
      
      if (response.data.token) {
        // Successful login
        swal.fire({
          title: "Login Successfully",
          icon: "success",
          toast: true,
          timer: 4000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });

        // Additional actions if needed, like saving the token
        return response.data;
      }
    } catch (error) {
      // Error or unsuccessful login
      swal.fire({
        title: "Username or password does not exist",
        icon: "error",
        toast: true,
        timer: 3000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  },

  logout: async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        API_URL + "logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.message === "Successfully logout") {
        // Display success alert for logout
        swal.fire({
          title: "You have been logged out...",
          icon: "success",
          toast: true,
          timer: 3000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });

        // Optionally, clear the token from localStorage
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Error logging out:", error);
      // Optionally handle any errors if needed
    }
  },
  signup: async (userData) => {
    try {
      const response = await axios.post(API_URL + "signup", userData);
      return response.data; // Return the response data
      
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  },

  fetchAdminById: async (userId) => {
    const response = await axios.get(API_URL + `adminId/${userId}`);
    
    return response.data;
  },

  getDashboardCounts: async () => {
    const response = await axios.get(API_URL + "dashboard/counts");
    return response.data;
  },

  fetchRiders: async () => {
    const response = await axios.get(API_URL + "riders");
    return response.data;
  },

  fetchRequirements: async () => {
    const response = await axios.get(API_URL + "riders_req");
    return response.data;
  },

  fetchCustomers: async () => {
    try {
      const response = await axios.get(API_URL + "customers");
      return response.data;
    } catch (error) {
      console.error("Error fetching customers:", error);
      throw error;
    }
  },

  fetchAdmin: async () => {
    const response = await axios.get(API_URL + "admin");
    return response.data;
  },

  // getAdminById: async (editingAdminId) => {
  //   const response = await axios.get(API_URL + 'admin/' + editingAdminId);
  //   return response.data;
  // },

//   updateAccount: async (userId, formData) => {
//     try {
//         console.log('Updating account for user:', userId);
//         console.log('FormData contents before sending:');
//         for (let pair of formData.entries()) {
//             console.log(pair[0], pair[1]);
//         }

//         const url = `${API_URL}update_account/${userId}`; // Make sure path matches Laravel route
//         console.log('Request URL:', url);

//         const response = await axios({
//             method: 'put',  // Change to POST if your Laravel route expects POST
//             url: url,
//             data: formData,
//             headers: {
//                 'Authorization': `Bearer ${localStorage.getItem('token')}`,
//                 'Content-Type': 'multipart/form-data',
//                 'Accept': 'application/json'
//             }
//         });
        
//         // Handle 304 responses
//         if (response.status === 304) {
//             return {
//                 status: 304,
//                 message: 'No changes were made',
//                 user: response.data?.user || null
//             };
//         }

//         return response.data;
//     } catch (error) {
//         console.error('Service error:', error.response || error);
//         throw new Error(
//             error.response?.data?.error || 
//             error.response?.data?.message || 
//             'An error occurred while updating the account.'
//         );
//     }
// },
  updateAccount: async (userId, formData) => {
    try {
      // Debug logs
      console.log('Updating account for user:', userId);
      console.log('FormData contents before sending:');
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const url = `${API_URL}update_account/${userId}`;
      console.log('Request URL:', url);

      const response = await axios.put(url, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Full response:', response);
      return response.data;
    } catch (error) {
      console.error('Service error:', error.response || error);
      throw new Error(
        error.response?.data?.error || 
        error.response?.data?.message || 
        'An error occurred while updating the account.'
      );
    }
  },

  updateAdmin: async (editingAdmin, adminData) => {
    console.log("ANG YAWA NGA ID: ", editingAdmin.user_id);
    try {
      const response = await axios.put(API_URL + `update_admin/${editingAdmin.user_id}`, adminData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateAdminStatus: async (userId, status) => {
    try {
      const response = await axios.put(
        API_URL + "admin/" + userId + "/status",
        { status }
      );
      console.log(
        `API response for updating user ${userId} status:`,
        response.data
      );
      return response.data;
    } catch (error) {
      console.error(`API error for updating user ${userId} status:`, error);
      throw error;
    }
  },

  updateUserStatus: async (userId, status) => {
    try {
      const response = await axios.put(
        API_URL + "customer/" + userId + "/status",
        { status }
      );
      console.log(
        `API response for updating user ${userId} status:`,
        response.data
      );
      return response.data;
    } catch (error) {
      console.error(`API error for updating user ${userId} status:`, error);
      throw error;
    }
  },

  updateRiderStatus: async (userId, status) => {
    try {
      const response = await axios.put(
        API_URL + "rider/" + userId + "/status",
        { status }
      );
      console.log(
        `API response for updating user ${userId} status:`,
        response.data
      );
      return response.data;
    } catch (error) {
      console.error(`API error for updating user ${userId} status:`, error);
      throw error;
    }
  },

  fetchHistory: async () => {
    try {
      const response = await axios.get(API_URL + "history");
      return response.data;
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      throw error;
    }
  },

  fetchFeedbacks: async () => {
    try {
      const response = await axios.get(API_URL + "feedbacks");
      return response.data;
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      throw error;
    }
  },

  fetchReports: async () => {
    try {
      const response = await axios.get(API_URL + "reports");
      return response.data;
    } catch (error) {
      console.error("Error fetching reports:", error);
      throw error;
    }
  },

  verifyRider: async (userId, status) => {
    try {
      const response = await axios.put(`${API_URL}verify_rider/${userId}`, {
        status,
      });
      return response.data;
    } catch (error) {
      console.error("Error Verifying Rider:", error);
      throw error;
    }
  },

  fetchLoc: async () => {
    try {
      const response = await axios.get(API_URL + "riders/locations");
      return response.data;
    } catch (error) {
      console.error("Error fetching locations:", error);
      throw error;
    }
  },

  
};

export default userService;
