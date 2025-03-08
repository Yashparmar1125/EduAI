
import React from 'react';

const CommunityChat = () => {
  return (
    <div className="flex flex-col bg-[#0b0b0f] text-white p-6 rounded-lg w-full max-w-lg mx-auto shadow-lg">
      {/* Post Header */}
      <div className="flex items-center mb-4">
        <img
          src="https://dashboard.codeparrot.ai/api/image/Z8nvNawi-41-yX-a/img.png"
          alt="Profile"
          className="w-12 h-12 rounded-full border-2 border-gray-600 mr-3"
        />
        <div>
          <h2 className="text-lg font-semibold flex items-center">
            Jessica Whilliams
            <span className="bg-gradient-to-r from-blue-500 to-blue-700 text-white text-xs px-3 py-1 rounded-full ml-2">Author</span>
          </h2>
          <p className="text-sm text-gray-300">How can we ensure ethical use of AI in decision-making systems?</p>
        </div>
      </div>

      <p className="text-sm text-gray-400 mb-4">Looking for advanced tips on using AI ethically and efficiently...</p>

      {/* Comment Box */}
      <textarea
        className="w-full p-3 mb-4 bg-[#1a1a1d] text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
        placeholder="Write a comment..."
      ></textarea>

      <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg w-fit self-end cursor-pointer">Post Comment</button>

      {/* Comments Section */}
      <div className="mt-6 space-y-4">
        {[
          "I believe transparency in AI algorithms is crucial. If users understand how decisions are made, it builds trust.",
          "Agreed! But how do we ensure transparency without compromising proprietary tech?",
          "Maybe through third-party audits. Independent organizations could verify fairness without revealing trade secrets.",
          "Also, diversity in training data is essential. Bias often stems from unrepresentative datasets.",
          "That's true. But achieving complete fairness might be impossible. Shouldn't we aim for minimizing bias instead?",
          "Good point! Maybe establishing ethical guidelines and compliance standards could be a solution."
        ].map((comment, index) => (
          <div key={index} className="flex items-start bg-[#131316] p-3 rounded-lg">
            <img
              src={`https://dashboard.codeparrot.ai/api/image/Z8nvNawi-41-yX-a/img-${index + 2}.png`}
              alt="Commenter"
              className="w-10 h-10 rounded-full border border-gray-600 mr-3"
            />
            <p className="text-sm text-gray-300">{comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityChat;
