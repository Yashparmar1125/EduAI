import React, { useState } from 'react';

const RightSection = ({ defaultData = {}, onGoggleSignIn }) => {
  const [formData, setFormData] = useState({
    firstName: defaultData.firstName || '',
    lastName: defaultData.lastName || '',
    email: defaultData.email || '',
    password: defaultData.password || '',
    occupation: defaultData.occupation || '',
    interests: defaultData.interests || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Concatenate firstName and lastName into a single 'name' field
    const fullName = `${formData.firstName} ${formData.lastName}`;
  
    // Prepare data to send to the backend
    const dataToSend = {
      name: fullName, // Send concatenated name
      email: formData.email,
      password: formData.password,
      occupation: formData.occupation,
      interests: formData.interests
    };
  
    console.log('Form submitted:', dataToSend); // Optionally, log to verify
  
    try {
      // Send user registration data to the backend API
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),  // Send the concatenated name and form data to backend
      });
  
      if (response.ok) {
        console.log('User registered successfully');
        // Optionally, redirect to another page or show a success message
      } else {
        console.error('Registration failed');
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };
  return (
    <div className="flex justify-center items-center w-full h-full p-6">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-semibold mb-1 text-center text-gray-800">Sign Up</h1>
        <p className="text-lg text-center text-gray-600 mb-6">Create Your Account</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:space-x-6">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-gray-600">First Name*</label>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-gray-600">Last Name*</label>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Email*</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Password*</label>
            <input
              type="password"
              name="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Occupation</label>
            <select
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            >
              <option value="">eg. Student</option>
              <option value="student">Student</option>
              <option value="professional">Professional</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Interests/Skills</label>
            <select
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            >
              <option value="">eg. Video Editing</option>
              <option value="videoEditing">Video Editing</option>
              <option value="programming">Programming</option>
              <option value="design">Design</option>
            </select>
          </div>

          <button type="submit" className="w-full p-3 mt-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg hover:bg-gradient-to-l focus:ring-2 focus:ring-blue-400">
            REGISTER
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">OR</p>
          <div className="flex justify-center space-x-4 mt-4">
            <button className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300" onClick={onGoggleSignIn}>
              <img src="https://dashboard.codeparrot.ai/api/image/Z8KGqG37P2WCQpKV/google.png" alt="Google" />
            </button>
            <button className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300">
              <img src="https://dashboard.codeparrot.ai/api/image/Z8KGqG37P2WCQpKV/facebook.png" alt="Facebook" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSection;
