import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/",
  withCredentials: true,
});

// Add response interceptor
api.interceptors.response.use(
  (response) => response.data, // Automatically extract the data
  (error) => {
    // Handle errors
    const message =
      error.response?.data?.message || error.message || "An error occurred";
    return Promise.reject(new Error(message));
  }
);

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
export const emailSignup = (name, email, password, interests) => {
  return api.post(
    "/api/auth/register",
    { name, email, password, interests },
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

// Create Course API
export const createCourse = (formData) => {
  return api.post("/api/course/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
};

// Get Course Details API
export const getCourseDetails = (courseId) => {
  return api.get(`/api/course/${courseId}`, {
    withCredentials: true,
  });
};

// Get instructor's dashboard statistics
export const getInstructorStats = () => {
  return api.get("/api/instructor/stats", {
    withCredentials: true,
  });
};

// Get instructor's courses
export const getInstructorCourses = () => {
  return api.get("/api/instructor/courses", {
    withCredentials: true,
  });
};

// Get course statistics
export const getCourseStats = (courseId) => {
  return api.get(`/api/instructor/courses/${courseId}/stats`, {
    withCredentials: true,
  });
};

// Delete Course API
export const deleteCourse = (courseId) => {
  return api.delete(`/api/course/delete/${courseId}`, {
    withCredentials: true,
  });
};

// Enroll in Course API
export const enrollCourse = (courseId) => {
  return api.post(`/api/course/enroll/${courseId}`);
};

// Update Course API
export const updateCourse = (courseId, formData) => {
  return api.put(`/api/course/update/${courseId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
};

// Assessment APIs
export const createAssessment = (assessmentData) => {
  return api.post("/api/assessment/create", assessmentData, {
    withCredentials: true,
  });
};

export const getInstructorAssessments = () => {
  return api.get("/api/assessment/get", {
    withCredentials: true,
  });
};

export const getAssessmentDetails = (assessmentId) => {
  return api.get(`/api/assessment/get/${assessmentId}`, {
    withCredentials: true,
  });
};

export const updateAssessment = (assessmentId, assessmentData) => {
  return api.put(`/api/assessment/update/${assessmentId}`, assessmentData, {
    withCredentials: true,
  });
};

export const deleteAssessment = (assessmentId) => {
  return api.delete(`/api/assessment/delete/${assessmentId}`, {
    withCredentials: true,
  });
};

export const getAssessmentStats = (assessmentId) => {
  return api.get(`/api/assessment/${assessmentId}/stats`, {
    withCredentials: true,
  });
};

// Dashboard APIs
export const getDashboardData = () => {
  const token = localStorage.getItem("auth_token");
  return api.get("/api/dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
};

// Get all courses with filters
export const getAllCourses = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.search) params.append("search", filters.search);
  if (filters.category) params.append("category", filters.category);
  if (filters.level) params.append("level", filters.level);

  return api.get(`/api/course/explore?${params.toString()}`);
};
