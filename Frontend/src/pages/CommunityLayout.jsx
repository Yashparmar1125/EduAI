import { useState } from 'react';
import QueryCard from './QueryCard';
// import Header from '../components/Header';
import CommunityChat from './CommunityChat';

const CommunityLayout = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});

  const handleOpenModal = (cardData) => {
    setModalContent(cardData);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalContent({});
  };

  const cards = [
    {
      userImage: "https://dashboard.codeparrot.ai/api/image/Z8nnurwkNXOiaWCz/img.png",
      title: "How can we ensure ethical use of AI in decision-making systems?",
      description: "Looking for advanced tips on ethical use of AI...",
      replies: "15 replies",
      timeAgo: "2h ago"
    },
    {
      userImage: "https://dashboard.codeparrot.ai/api/image/Z8nnurwkNXOiaWCz/img-2.png",
      title: "Which algorithm is best for image classification: CNN or SVM?",
      description: "Looking for advanced tips on using React Hooks effectively...",
      replies: "15 replies",
      timeAgo: "2h ago"
    },
    {
      userImage: "https://dashboard.codeparrot.ai/api/image/Z8nnurwkNXOiaWCz/img-3.png",
      title: "How do I handle overfitting in my ML model?",
      description: "Looking for advanced tips on using ML Models",
      replies: "15 replies",
      timeAgo: "2h ago"
    },
    {
      userImage: "https://dashboard.codeparrot.ai/api/image/Z8nnurwkNXOiaWCz/img-4.png",
      title: "What is the significance of the learning rate in neural networks?",
      description: "Looking for advanced tips on using neural networks",
      replies: "15 replies",
      timeAgo: "2h ago"
    },
    {
      userImage: "https://dashboard.codeparrot.ai/api/image/Z8nnurwkNXOiaWCz/img.png",
      title: "How can we ensure ethical use of AI in decision-making systems?",
      description: "Looking for advanced tips on ethical use of AI...",
      replies: "15 replies",
      timeAgo: "2h ago"
    },
    {
      userImage: "https://dashboard.codeparrot.ai/api/image/Z8nnurwkNXOiaWCz/img-2.png",
      title: "Which algorithm is best for image classification: CNN or SVM?",
      description: "Looking for advanced tips on using React Hooks effectively...",
      replies: "15 replies",
      timeAgo: "2h ago"
    },
    {
      userImage: "https://dashboard.codeparrot.ai/api/image/Z8nnurwkNXOiaWCz/img-3.png",
      title: "How do I handle overfitting in my ML model?",
      description: "Looking for advanced tips on using ML Models",
      replies: "15 replies",
      timeAgo: "2h ago"
    },
    {
      userImage: "https://dashboard.codeparrot.ai/api/image/Z8nnurwkNXOiaWCz/img-4.png",
      title: "What is the significance of the learning rate in neural networks?",
      description: "Looking for advanced tips on using neural networks",
      replies: "15 replies",
      timeAgo: "2h ago"
    }
  ];

  const Header = () => {
    return (
      <header className="w-full min-w-[320px] py-8 flex flex-col items-center justify-center bg-[#3a0ca3]">
        <h1 className="text-[50px] font-bold font-['Urbanist'] text-white mb-4 text-center">
          Join Our Vibrant Learning Community!
        </h1>
        <p className="text-[30px] font-medium font-['Inter'] text-white text-center leading-7">
          Connect, Learn, and Grow
        </p>
      </header>
    );
  };

  return (
    <div className="flex flex-col items-center bg-[#3a0ca3] min-h-screen w-full overflow-x-hidden p-6">
      <Header />
      <div className="flex flex-col items-center w-full">
        {cards.map((card, index) => (
          <QueryCard
            key={index}
            userImage={card.userImage}
            title={card.title}
            description={card.description}
            replies={card.replies}
            timeAgo={card.timeAgo}
            onOpenModal={() => handleOpenModal(card)}
          />
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="mt-4 p-6 rounded-lg shadow-lg w-120 max-h-[80vh] overflow-y-auto">
            <CommunityChat />
            <button
              onClick={handleCloseModal}
              className="mt-4 bg-[#24bdff] text-black font-bold py-2 px-4 rounded-lg hover:bg-[#1da7e6]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityLayout;

