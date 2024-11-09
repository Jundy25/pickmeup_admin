import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../pictures/Pick-Me-Up-Logo.png";
import { useAuth } from "../../hooks/useAuth";
import userService from "../../services";
import logo2 from "../pictures/image.png";

const Login = () => {
  const navigate = useNavigate();
  const [visiblePass, setVisiblePass] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { token, role, user_id } = await userService.login(email, password);
      console.log("Creds",token, role, user_id)

      if (role !== 1 && role !== 2) {
        setError("Unauthorized access");
        setIsLoading(false);
        return;
      }

      login(token, role, user_id);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVisiblePass = () => {
    setVisiblePass(!visiblePass);
  };

  return (
    <div className="min-h-screen shadow-xl flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8 bg-gray-100">
      <div className="max-w-7xl w-full bg-white shadow-xl rounded-lg flex flex-col md:flex-row">
        {/* Left: Image */}
        <div className="hidden md:flex md:w-full bg-gray-300 rounded-l-lg overflow-hidden">
          <img
            src="https://img.freepik.com/free-vector/illustration-delivery-service-with-masks-concept_23-2148503285.jpg?t=st=1730057288~exp=1730060888~hmac=1faae0757aa0d4924e6d7c33553b3db002e73e29f8e6e581f524032b0def45d4&w=996"
            alt="Image"
            className="object-contain mx-auto"
          />
        </div>
        {/* Right: Login Form */}
        <div className="flex flex-col shadow-xl justify-center items-center md:w-1/2 p-8 sm:p-12">
          <div className="w-full">
            <div className="flex justify-center mb-4">
              <img src={logo} alt="Logo" className="h-28" />
            </div>
            <h2 className="text-center text-xl font-extrabold text-gray-900 mb-2">
              Welcome to <span style={{ color: "#EAB308" }}>Pick Me Up</span>
            </h2>
            <p className="text-center text-sm text-gray-600 mb-6">
              Fill the credentials below to log into Pick Me Up Admin Page
            </p>
            <form className="space-y-6" onSubmit={handleLogin}>
              {/* Email Address Input */}

              <div className="flex mb-6">
                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 text-gray-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  id="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-none rounded-e-lg bg-gray-200 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5 "
                  autoComplete="email"
                />
              </div>

              {/* Password Input */}
              <div className="flex mb-6 items-center">
                <span className="inline-flex items-center px-3 py-2 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 text-gray-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                    />
                  </svg>
                </span>

                <div className="relative flex-1">
                  <input
                    type={visiblePass ? "text" : "password"}
                    id="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-none rounded-e-lg bg-gray-200 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full text-sm border-gray-300 p-2.5"
                    autoComplete="current-password"
                  />
                  <div
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                    onClick={toggleVisiblePass}
                  >
                    {visiblePass ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6 "
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>

              {showSpinner && (
                <div role="status" className="spinner flex justify-center">
                  <svg
                    aria-hidden="true"
                    className="w-8 h-8 text-gray-200 animate-spin fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex shadow-lg justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-[#EAB308] hover:bg-[#D39906] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EAB308]"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    Processing...
                  </>
                ) : (
                  "Log in"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
