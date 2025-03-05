import React, { useState, useEffect } from 'react';
import { FaGoogle, FaFacebook } from 'react-icons/fa';

const Login = ({ closeModal }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = (data) => {
    const errors = {};
    if (!data.email) errors.email = 'Email is required';
    if (!data.password) errors.password = 'Password is required';
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length === 0) {
      console.log('Form submitted:', formData);
      closeModal();
    } else {
      setErrors(validationErrors);
    }
  };

  useEffect(() => {
    console.log("Form Data or Errors changed:", formData, errors);
  }, [formData, errors]);

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-90 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl flex">
        <div className="w-1/2 bg-purple-500 text-white flex flex-col justify-center items-center p-10 rounded-l-2xl">
          <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
          <p className="text-lg">Log in and continue your journey with us.</p>
        </div>

        <div className="w-1/2 p-8 relative">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
          >
            &times;
          </button>

          <h1 className="text-3xl font-bold text-center text-white mb-4">Log In</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}

            <button
              type="submit"
              className="w-full py-3 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Log In
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-gray-400">Or log in with</p>
            <div className="flex justify-center gap-4 mt-2">
              <button className="bg-blue-600 text-white p-3 rounded-lg"><FaGoogle /></button>
              <button className="bg-blue-800 text-white p-3 rounded-lg"><FaFacebook /></button>
            </div>
            <p className="text-gray-400 mt-4">
              New here? <a href="/signup" className="text-purple-500">Create an account</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
