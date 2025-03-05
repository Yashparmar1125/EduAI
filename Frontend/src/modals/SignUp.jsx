import React, { useState, useEffect } from 'react';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
;  // Use navigate instead of useHistory 


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
          <h2 className="text-4xl font-bold mb-4">Welcome!</h2>
          <p className="text-lg">Join our platform and explore personalized opportunities.</p>
        </div>

        <div className="w-1/2 p-8 relative">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
          >
            &times;
          </button>

          <h1 className="text-3xl font-bold text-center text-white mb-4">Create an Account</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex space-x-4">
              <div className="w-1/2">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {errors.firstName && <p className="text-red-400 text-sm">{errors.firstName}</p>}
              </div>
              <div className="w-1/2">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {errors.lastName && <p className="text-red-400 text-sm">{errors.lastName}</p>}
              </div>
            </div>

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

            <select
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Occupation</option>
              <option value="student">Student</option>
              <option value="professional">Professional</option>
              <option value="other">Other</option>
            </select>
            {errors.occupation && <p className="text-red-400 text-sm">{errors.occupation}</p>}

            <select
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select Interests/Skills</option>
              <option value="videoEditing">Video Editing</option>
              <option value="programming">Programming</option>
              <option value="design">Design</option>
            </select>
            {errors.interests && <p className="text-red-400 text-sm">{errors.interests}</p>}

            <button
              type="submit"
              className="w-full py-3 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Sign Up
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-gray-400">Or sign up with</p>
            <div className="flex justify-center gap-4 mt-2">
              <button className="bg-blue-600 text-white p-3 rounded-lg" ><FaGoogle /></button>
              <button className="bg-blue-800 text-white p-3 rounded-lg"><FaFacebook /></button>
            </div>
            <p className="text-gray-400 mt-4">
              Already a user? <a href="/login" className="text-purple-500">Log in</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
