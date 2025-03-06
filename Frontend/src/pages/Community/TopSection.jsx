import React, { Fragment } from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import comImage from '@/assets/com_image.jpg';
import aiImage from '@/assets/AI.png'; // Updated AI image path

const TopSection = ({ title, subtitle, buttons }) => {
  return (
    <Fragment>
      {/* Updated Background with Image */}
      <div
        className="flex flex-col items-center justify-center w-full py-36 bg-black bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${comImage})` }}
      >
        <div className="flex flex-col items-center justify-center gap-14 w-full max-w-7xl px-4">
          {/* Text Container */}
          <div className="flex flex-col items-center justify-center w-full gap-4">
            <h1 className="text-white text-5xl md:text-6xl font-bold text-center leading-tight tracking-tighter">
              {title}
            </h1>
            <p className="text-white text-xl md:text-2xl font-normal text-center leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Buttons Container */}
          <div className="flex flex-row items-center justify-center gap-4">
            {buttons.map((button, index) => (
              <Button
                key={index}
                style={{
                  backgroundColor: button.bgColor,
                  borderColor: button.borderColor,
                  color: 'black',
                  padding: '0.75rem 1.25rem',
                  fontWeight: 'bold',
                  borderRadius: '1rem',
                  transition: 'background-color 0.2s',
                }}
                className="hover:bg-opacity-80"
              >
                {button.text}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Community Section */}
      <div className="flex flex-col items-center justify-center w-full py-12 bg-gray-800">
        <h2 className="text-white text-4xl font-bold">Join Our Vibrant Learning Community!</h2>
        <p className="text-white text-xl mt-4">Connect, Learn, and Grow</p>

        {/* Search Bar with Icon */}
        <div className="flex flex-row items-center justify-center mt-6 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" size={20} />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 text-white bg-[#7209B7] rounded-lg border-none outline-none w-200"
            />
          </div>
          <Button
            style={{
              backgroundColor: '#7209B7',
              color: 'white',
              padding: '0.75rem 1.25rem',
              fontWeight: 'bold',
              borderRadius: '0.5rem',
            }}
            className="hover:bg-opacity-80 w-32 h-10"
          >
            Search
          </Button>
        </div>
      </div>

      {/* Title "Artificial Intelligence" */}
      <div className="flex flex-col items-left justify-center w-full py-6 pl-55 pt-10 bg-gray-00">
        <h2 className="text-gray-910 text-3xl font-bold">Artificial Intelligence</h2>
      </div>

      {/* Cards Section */}
      <div className="flex flex-wrap justify-center gap-9 p-4 bg-gray-00">
        {/* Existing 4 Cards */}
        {["Artificial Intelligence", "Machine Learning", "Data Science", "Deep Learning"].map((topic, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg w-72 overflow-hidden">
            <div className="relative">
              <img src={comImage} alt="AI Banner" className="w-full h-32 object-cover" />
              <div className="absolute -bottom-6 left-4 w-14 h-14 bg-white rounded-full overflow-hidden border-2 border-white shadow-md">
                <img src={aiImage} alt="AI Icon" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="bg-blue-600 text-white text-center p-6 pt-8 rounded-b-2xl">
              <h3 className="text-xl font-bold">{topic}</h3>
              <p className="text-lg mt-2">Learn more about {topic} and its impact</p>
              <button className="bg-white text-black font-bold py-2 px-4 rounded-xl mt-4 shadow">Join the thread</button>
            </div>
          </div>
        ))}
      </div>

      {/* Additional 4 Cards Below */}
      <div className="flex flex-wrap justify-center gap-9 p-4 bg-gray-00">
        {["Computer Vision", "NLP", "Robotics", "Cybersecurity"].map((topic, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg w-72 overflow-hidden">
            <div className="relative">
              <img src={comImage} alt="AI Banner" className="w-full h-32 object-cover" />
              <div className="absolute -bottom-6 left-4 w-14 h-14 bg-white rounded-full overflow-hidden border-2 border-white shadow-md">
                <img src={aiImage} alt="AI Icon" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="bg-blue-600 text-white text-center p-6 pt-8 rounded-b-2xl">
              <h3 className="text-xl font-bold">{topic}</h3>
              <p className="text-lg mt-2">Explore {topic} and its real-world applications</p>
              <button className="bg-white text-black font-bold py-2 px-4 rounded-xl mt-4 shadow">Join the thread</button>
            </div>
          </div>
        ))}
      </div>

      {/* Title "Physics and Mathematics" */}
      <div className="flex flex-col items-left justify-center w-full py-6 pl-55 pt-10 bg-gray-00">
        <h2 className="text-gray-910 text-3xl font-bold">Physics and Mathematics</h2>
      </div>

      
      {/* Cards Section */}
      <div className="flex flex-wrap justify-center gap-9 p-4 bg-gray-00">
        {/* Existing 4 Cards */}
        {["Artificial Intelligence", "Machine Learning", "Data Science", "Deep Learning"].map((topic, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg w-72 overflow-hidden">
            <div className="relative">
              <img src={comImage} alt="AI Banner" className="w-full h-32 object-cover" />
              <div className="absolute -bottom-6 left-4 w-14 h-14 bg-white rounded-full overflow-hidden border-2 border-white shadow-md">
                <img src={aiImage} alt="AI Icon" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="bg-purple-600 text-white text-center p-6 pt-8 rounded-b-2xl">
              <h3 className="text-xl font-bold">{topic}</h3>
              <p className="text-lg mt-2">Learn more about {topic} and its impact</p>
              <button className="bg-white text-black font-bold py-2 px-4 rounded-xl mt-4 shadow">Join the thread</button>
            </div>
          </div>
        ))}
      </div>

      {/* Additional 4 Cards Below */}
      <div className="flex flex-wrap justify-center gap-9 p-4 bg-gray-00">
        {["Computer Vision", "NLP", "Robotics", "Cybersecurity"].map((topic, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg w-72 overflow-hidden">
            <div className="relative">
              <img src={comImage} alt="AI Banner" className="w-full h-32 object-cover" />
              <div className="absolute -bottom-6 left-4 w-14 h-14 bg-white rounded-full overflow-hidden border-2 border-white shadow-md">
                <img src={aiImage} alt="AI Icon" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="bg-purple-600 text-white text-center p-6 pt-8  rounded-b-2xl">
              <h3 className="text-xl font-bold">{topic}</h3>
              <p className="text-lg mt-2">Explore {topic} and its real-world applications</p>
              <button className="bg-white text-black font-bold py-2 px-4 rounded-xl mt-4 shadow">Join the thread</button>
            </div>
          </div>
        ))}
      </div>
    </Fragment>
  );
};

TopSection.defaultProps = {
  title: "Welcome to Your E-Learning Community!",
  subtitle: "Connect with peers and educators to enhance your knowledge.",
  buttons: [
    { text: "Create Space", bgColor: "#f5dbdb", borderColor: "#ad9b9b" },
    { text: "Add a question", bgColor: "#4cc9f0", borderColor: "#2463eb" }
  ]
};

export default TopSection;