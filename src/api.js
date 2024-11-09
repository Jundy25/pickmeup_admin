// src/api/axios.js
import axios from "axios";
import API_URL from "./api_url";

const instance = axios.create({
  baseURL: API_URL,
});

export default instance;