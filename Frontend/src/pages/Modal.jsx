import React from "react";
import { motion } from "framer-motion";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#130b0b] rounded-lg p-6 w-[500px] text-white"
      >
        {children}
        <button onClick={onClose} className="mt-4 bg-red-500 px-4 py-2 rounded-lg">
          Close
        </button>
      </motion.div>
    </div>
  );
};

export default Modal;