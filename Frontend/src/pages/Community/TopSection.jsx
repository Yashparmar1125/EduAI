import React, { Fragment, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import comImage from '@/assets/com_image.jpg';
import aiImage from '@/assets/AI.png'; // Updated AI image path
import CreateSpaceModal from './CreateSpace'; // Import CreateSpaceModal
import { useNavigate } from 'react-router-dom';

const TopSection = ({ title, subtitle, buttons }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialTab, setInitialTab] = useState('createSpace');
  const [currentAISlide, setCurrentAISlide] = useState(0);
  const [currentPhysicsSlide, setCurrentPhysicsSlide] = useState(0);
  const [currentWebDevSlide, setCurrentWebDevSlide] = useState(0);
  const navigate = useNavigate();

  // Data for different sections
  const aiTopics = [
    { name: "Artificial Intelligence", description: "Learn more about AI and its impact" },
    { name: "Machine Learning", description: "Explore machine learning concepts" },
    { name: "Data Science", description: "Discover data science applications" },
    { name: "Deep Learning", description: "Master deep learning techniques" },
    { name: "Computer Vision", description: "Understand computer vision applications" },
    { name: "NLP", description: "Natural Language Processing fundamentals" },
    { name: "Robotics", description: "Explore robotics and automation" },
    { name: "Cybersecurity", description: "Learn about AI in cybersecurity" }
  ];

  const physicsTopics = [
    { name: "Quantum Mechanics", description: "Explore quantum phenomena" },
    { name: "Relativity", description: "Understanding space and time" },
    { name: "Particle Physics", description: "Study of fundamental particles" },
    { name: "Thermodynamics", description: "Laws of energy and heat" },
    { name: "Astrophysics", description: "Explore the cosmos" },
    { name: "Nuclear Physics", description: "Study of atomic nuclei" },
    { name: "Classical Mechanics", description: "Foundation of physics" },
    { name: "Electromagnetism", description: "Understanding electromagnetic forces" }
  ];

  const webDevTopics = [
    { name: "Frontend Development", description: "Master modern UI development" },
    { name: "Backend Development", description: "Build robust server applications" },
    { name: "Full Stack", description: "Complete web development" },
    { name: "DevOps", description: "Modern deployment practices" },
    { name: "Web Security", description: "Secure web applications" },
    { name: "API Development", description: "Build and consume APIs" },
    { name: "Database Design", description: "Modern database architecture" },
    { name: "Cloud Computing", description: "Deploy to the cloud" }
  ];

  const handleButtonClick = (buttonText) => {
    if (buttonText === "Create Space") {
      setInitialTab('createSpace');
    } else if (buttonText === "Add a question") {
      setInitialTab('addQuestion');
    }
    setIsModalOpen(true);
  };

  const handleJoinThread = (topic) => {
    navigate('/community/queries', { state: { topic } });
  };

  const TopicCards = ({ topics, currentSlide, setCurrentSlide, bgColor }) => {
    const visibleTopics = topics.slice(currentSlide, currentSlide + 4);
    const hasMore = currentSlide + 4 < topics.length;
    const hasPrevious = currentSlide > 0;

    return (
      <div className="relative max-w-[1320px] mx-auto px-16">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out gap-6"
            style={{ transform: `translateX(-${currentSlide * (300)}px)` }}
          >
            {topics.map((topic, index) => (
              <div key={index} className="flex-shrink-0 w-[280px]">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full">
                  <div className="relative">
                    <img src={comImage} alt={`${topic.name} Banner`} className="w-full h-32 object-cover" />
                    <div className="absolute -bottom-6 left-4 w-14 h-14 bg-white rounded-full overflow-hidden border-2 border-white shadow-md">
                      <img src={aiImage} alt={`${topic.name} Icon`} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className={`${bgColor} text-white text-center p-6 pt-8 rounded-b-2xl min-h-[220px] flex flex-col justify-between`}>
                    <div>
                      <h3 className="text-xl font-bold line-clamp-1">{topic.name}</h3>
                      <p className="text-lg mt-2 line-clamp-2">{topic.description}</p>
                    </div>
                    <button
                      onClick={() => handleJoinThread(topic.name)}
                      className="bg-white text-black font-bold py-2 px-4 rounded-xl mt-4 shadow hover:bg-gray-100 transition-colors cursor-pointer w-full"
                    >
                      Join the thread
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        {hasPrevious && (
          <button
            onClick={() => setCurrentSlide(prev => prev - 1)}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-gray-100 transition-colors z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        {hasMore && (
          <button
            onClick={() => setCurrentSlide(prev => prev + 1)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-gray-100 transition-colors z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>
    );
  };

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
                onClick={() => handleButtonClick(button.text)}
                style={{
                  backgroundColor: button.bgColor,
                  borderColor: button.borderColor,
                  color: 'black',
                  padding: '0.75rem 1.25rem',
                  fontWeight: 'bold',
                  borderRadius: '1rem',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
                className="hover:opacity-80"
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
              className="pl-10 pr-4 py-2 text-white bg-[#7209B7] rounded-lg border-none outline-none w-200  "
            />
          </div>
          <Button
            style={{
              backgroundColor: '#7209B7',
              color: 'white',
              padding: '0.75rem 1.25rem',
              fontWeight: 'bold',
              borderRadius: '0.5rem',
              cursor: 'pointer',
            }}
            className="hover:bg-opacity-80 w-32 h-10"
          >
            Search
          </Button>
        </div>
      </div>

      {/* Artificial Intelligence Section */}
      <div className="w-full py-10 bg-gray-00">
        <h2 className="text-gray-910 text-3xl font-bold mb-16 text-center tracking-wide">Artificial Intelligence</h2>
        <div className="mt-4">
          <TopicCards
            topics={aiTopics}
            currentSlide={currentAISlide}
            setCurrentSlide={setCurrentAISlide}
            bgColor="bg-blue-600"
          />
        </div>
      </div>

      {/* Physics and Mathematics Section */}
      <div className="w-full py-10 bg-gray-00">
        <h2 className="text-gray-910 text-3xl font-bold mb-16 text-center tracking-wide">Physics and Mathematics</h2>
        <div className="mt-4">
          <TopicCards
            topics={physicsTopics}
            currentSlide={currentPhysicsSlide}
            setCurrentSlide={setCurrentPhysicsSlide}
            bgColor="bg-purple-600"
          />
        </div>
      </div>

      {/* Web Development Section */}
      <div className="w-full py-10 pb-20 bg-gray-00">
        <h2 className="text-gray-910 text-3xl font-bold mb-16 text-center tracking-wide">Web Development</h2>
        <div className="mt-4">
          <TopicCards
            topics={webDevTopics}
            currentSlide={currentWebDevSlide}
            setCurrentSlide={setCurrentWebDevSlide}
            bgColor="bg-indigo-600"
          />
        </div>
      </div>

      <CreateSpaceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialTab={initialTab}
      />
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