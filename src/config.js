if (!process.env.REACT_APP_API_BASE_URL) {
  console.warn("REACT_APP_API_BASE_URL is not defined");
}

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3000";

export default API_BASE_URL;
