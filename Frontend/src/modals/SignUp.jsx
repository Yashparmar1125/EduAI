import React, { useState, useEffect } from 'react';

const SignUp = ({ closeModal }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    occupation: '',
    interests: '',
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
    if (!data.firstName) errors.firstName = 'First Name is required';
    if (!data.lastName) errors.lastName = 'Last Name is required';
    if (!data.email) errors.email = 'Email is required';
    if (!data.password) errors.password = 'Password is required';
    if (!data.occupation) errors.occupation = 'Occupation is required';
    if (!data.interests) errors.interests = 'Interests/Skills is required';
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length === 0) {
      console.log('Form submitted:', formData);
      closeModal(); // Close modal on successful form submission
    } else {
      setErrors(validationErrors);
    }
  };

  useEffect(() => {
    console.log("Form Data or Errors changed:", formData, errors);
  }, [formData, errors]);

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          &times;
        </button>

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Sign Up</h1>
        <p className="text-center text-gray-600 mb-6">Create Your Account</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">First Name*</label>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">Last Name*</label>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email*</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password*</label>
            <input
              type="password"
              name="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Occupation*</label>
            <select
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">eg. Student</option>
              <option value="student">Student</option>
              <option value="professional">Professional</option>
              <option value="other">Other</option>
            </select>
            {errors.occupation && <p className="text-red-500 text-sm">{errors.occupation}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Interests/Skills*</label>
            <select
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">eg. Video Editing</option>
              <option value="videoEditing">Video Editing</option>
              <option value="programming">Programming</option>
              <option value="design">Design</option>
            </select>
            {errors.interests && <p className="text-red-500 text-sm">{errors.interests}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            SIGN UP
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">OR</p>
          <div className="flex justify-center mt-4 space-x-4">
            <button className="p-2 border rounded-full hover:bg-gray-200">
              <img
                src="https://dashboard.codeparrot.ai/api/image/Z8KGqG37P2WCQpKV/google.png"
                alt="Google"
                className="w-6 h-6"
              />
            </button>
            <button className="p-2 border rounded-full hover:bg-gray-200">
              <img
                src="https://dashboard.codeparrot.ai/api/image/Z8KGqG37P2WCQpKV/facebook.png"
                alt="Facebook"
                className="w-6 h-6"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
