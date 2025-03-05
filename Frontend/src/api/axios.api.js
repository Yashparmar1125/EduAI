import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/",
  withCredentials: true,
});

// Google login API
export const googleLogin = (auth_token) => {
  return api.post(
    "/api/auth/google/login",
    { auth_token },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

// Email/password login API
export const emailLogin = (email, password) => {
  return api.post(
    "/api/auth/login",
    { email, password },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

// Email/password signup API  
export const emailSignup = (name, email, password) => {
  return api.post(
    "/api/auth/register",
    { name, email, password },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

// Google signup API
export const googleSignup = (auth_token) => {
  return api.post(
    "/api/auth/google/register",
    { auth_token },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};