import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';

const AddQuestion = ({ isOpen, onClose }) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#2b2b2b] w-[738px] rounded-lg">
          {/* Close button */}
          <Dialog.Close className="absolute top-[18px] left-[20px]">
            <img src="https://dashboard.codeparrot.ai/api/image/Z8nZBbwkNXOiaWCr/cross-sv.png" alt="close" className="w-[21px] h-[21px]" />
          </Dialog.Close>

          {/* Header tabs */}
          <div className="flex mt-[64px] mx-[115px] justify-between">
            <div className="relative">
              <span className="text-white font-urbanist text-[22px] font-bold">Add Question</span>
              <div className="absolute -bottom-[33px] left-0 right-0 h-[3px] bg-[#24bdff]" />
            </div>
            <span className="text-white font-urbanist text-[22px] font-bold opacity-60">Create Space</span>
          </div>

          {/* Divider line */}
          <div className="mt-[33px] h-[1px] bg-[#e0baba]" />

          {/* Form content */}
          <div className="px-[115px] mt-[44px]">
            {/* Domain selection */}
            <div className="mb-[44px]">
              <label className="text-white font-roboto text-[19.6px] block mb-[11px]">
                Choose Space/Domain of question
              </label>
              <div className="bg-white rounded-[9px] py-[8.98px] px-[14.54px] flex justify-between items-center">
                <span className="text-black font-roboto text-[17.45px]">Artificial Intelligence</span>
                <img src="https://dashboard.codeparrot.ai/api/image/Z8nZBbwkNXOiaWCr/chevron.png" alt="chevron" className="w-[14.7px] h-[14.7px]" />
              </div>
            </div>

            {/* Question input */}
            <div>
              <label className="text-white font-roboto text-[19.6px] block mb-[11px]">
                Enter your question
              </label>
              <textarea
                className="w-full h-[117px] bg-white rounded-[8.98px] p-[16.13px] text-black font-roboto text-[17.45px] resize-none"
                placeholder="Enter your question here"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-[44px]">
            <div className="h-[3px] bg-[#24bdff]" />
            <div className="flex justify-between items-center px-[115px] py-[15px]">
              <button
                className="text-white font-urbanist text-[17.14px] font-bold"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="bg-[#3a0ca3] text-[#f5f5f5] font-urbanist text-[17.14px] font-bold px-[15.38px] py-[5px] rounded-[9.41px] w-[115.76px] h-[56px] cursor-pointer"
              >
                Add Question
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AddQuestion;

