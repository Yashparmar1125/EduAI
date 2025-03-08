import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';

const CreateSpaceModal = ({ isOpen, onClose, initialTab = 'createSpace' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState('Artificial Intelligence');

  // Update active tab when initialTab changes
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const domains = [
    'Artificial Intelligence',
    'Machine Learning',
    'Data Science',
    'Web Development',
    'Mobile Development',
    'Cloud Computing',
    'Cybersecurity',
    'Blockchain'
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleDomainSelect = (domain) => {
    setSelectedDomain(domain);
    setIsDropdownOpen(false);
  };

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
            <div
              className={`relative cursor-pointer ${activeTab === 'addQuestion' ? '' : 'opacity-60'}`}
              onClick={() => handleTabClick('addQuestion')}
            >
              <span className="text-white font-urbanist text-[22px] font-bold">Add Question</span>
              {activeTab === 'addQuestion' && (
                <div className="absolute -bottom-[33px] left-0 right-0 h-[3px] bg-[#24bdff]" />
              )}
            </div>
            <div
              className={`relative cursor-pointer ${activeTab === 'createSpace' ? '' : 'opacity-60'}`}
              onClick={() => handleTabClick('createSpace')}
            >
              <span className="text-white font-urbanist text-[22px] font-bold">Create Space</span>
              {activeTab === 'createSpace' && (
                <div className="absolute -bottom-[33px] left-0 right-0 h-[3px] bg-[#24bdff]" />
              )}
            </div>
          </div>

          {/* Divider line */}
          <div className="mt-[33px] h-[1px] bg-[#e0baba]" />

          {/* Form content */}
          {activeTab === 'createSpace' ? (
            <div className="px-[115px] mt-[44px]">
              {/* Domain selection */}
              <div className="mb-[44px] relative">
                <label className="text-white font-roboto text-[19.6px] block mb-[11px]">
                  Choose Space/Domain
                </label>
                <div
                  className="bg-white rounded-[9px] py-[8.98px] px-[14.54px] flex justify-between items-center cursor-pointer hover:bg-gray-50"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span className="text-black font-roboto text-[17.45px]">{selectedDomain}</span>
                  <img
                    src="https://dashboard.codeparrot.ai/api/image/Z8nZBbwkNXOiaWCr/chevron.png"
                    alt="chevron"
                    className={`w-[14.7px] h-[14.7px] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </div>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute w-full mt-2 bg-white rounded-[9px] shadow-lg z-50 max-h-[200px] overflow-y-auto">
                    {domains.map((domain, index) => (
                      <div
                        key={index}
                        className="px-[14.54px] py-[8.98px] hover:bg-gray-100 cursor-pointer text-black font-roboto text-[17.45px] transition-colors"
                        onClick={() => handleDomainSelect(domain)}
                      >
                        {domain}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="text-white font-roboto text-[19.6px] block mb-[11px]">
                  Add Description
                </label>
                <textarea
                  className="w-full h-[117px] bg-white rounded-[8.98px] p-[16.13px] text-black font-roboto text-[17.45px] resize-none"
                  placeholder="Enter space description here"
                />
              </div>
            </div>
          ) : (
            <div className="px-[115px] mt-[44px]">
              {/* Domain selection */}
              <div className="mb-[44px] relative">
                <label className="text-white font-roboto text-[19.6px] block mb-[11px]">
                  Choose Space/Domain of question
                </label>
                <div
                  className="bg-white rounded-[9px] py-[8.98px] px-[14.54px] flex justify-between items-center cursor-pointer hover:bg-gray-50"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span className="text-black font-roboto text-[17.45px]">{selectedDomain}</span>
                  <img
                    src="https://dashboard.codeparrot.ai/api/image/Z8nZBbwkNXOiaWCr/chevron.png"
                    alt="chevron"
                    className={`w-[14.7px] h-[14.7px] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </div>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute w-full mt-2 bg-white rounded-[9px] shadow-lg z-50 max-h-[200px] overflow-y-auto">
                    {domains.map((domain, index) => (
                      <div
                        key={index}
                        className="px-[14.54px] py-[8.98px] hover:bg-gray-100 cursor-pointer text-black font-roboto text-[17.45px] transition-colors"
                        onClick={() => handleDomainSelect(domain)}
                      >
                        {domain}
                      </div>
                    ))}
                  </div>
                )}
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
          )}

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
                {activeTab === 'createSpace' ? 'Add Space' : 'Add Question'}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CreateSpaceModal;
