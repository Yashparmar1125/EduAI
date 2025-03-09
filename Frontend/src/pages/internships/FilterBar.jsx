import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";
import { useTheme } from "../../components/theme-provider";
import { Filter, ChevronDown, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";

const FilterBar = ({ defaultFilters = { sector: '', industry: '', companyType: '', modeOfInternship: '' } }) => {
  const { theme } = useTheme();
  const [selectedFilters, setSelectedFilters] = useState(defaultFilters);
  const [dropdownOpen, setDropdownOpen] = useState({ sector: false, industry: false, companyType: false, modeOfInternship: false });

  const filterOptions = {
    sector: ['IT', 'Finance', 'Healthcare', 'Education'],
    industry: ['Software', 'Banking', 'Pharma', 'E-learning'],
    companyType: ['Startup', 'MNC', 'Government', 'NGO'],
    modeOfInternship: ['Remote', 'In-office', 'Hybrid'],
  };

  const filterLabels = {
    sector: 'Sector',
    industry: 'Industry',
    companyType: 'Company Type',
    modeOfInternship: 'Mode of Internship',
  };

  const handleFilterClick = (filterId) => {
    setDropdownOpen((prev) => {
      const newState = { ...prev };
      // Close all other dropdowns
      Object.keys(newState).forEach(key => {
        newState[key] = key === filterId ? !prev[key] : false;
      });
      return newState;
    });
  };

  const handleOptionSelect = (filterId, option) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterId]: option,
    }));
    setDropdownOpen((prev) => ({ ...prev, [filterId]: false }));
  };

  return (
    <div className="w-full">
      {/* Search and Filter Header */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex items-center justify-between">
          <h2 className={cn(
            "text-2xl font-semibold",
            theme === 'dark' ? 'text-white' : 'text-foreground'
          )}>
            Find Your Perfect Internship
          </h2>
          <div className={cn(
            "px-4 py-2 rounded-full flex items-center gap-2",
            theme === 'dark' ? 'bg-white/5' : 'bg-[#6938EF]/5'
          )}>
            <Filter className="w-4 h-4 text-[#6938EF]" />
            <span className="text-sm font-medium text-[#6938EF]">Filters</span>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3">
          {Object.keys(filterOptions).map((filterId) => (
            <div key={filterId} className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFilterClick(filterId)}
                className={cn(
                  "flex items-center gap-2 transition-all duration-300",
                  selectedFilters[filterId] 
                    ? "border-[#6938EF] text-[#6938EF] bg-[#6938EF]/10"
                    : "border-[#6938EF]/20",
                  dropdownOpen[filterId] && "ring-2 ring-[#6938EF]/20"
                )}
              >
                <span className="text-sm">
                  {selectedFilters[filterId] || filterLabels[filterId]}
                </span>
                <ChevronDown 
                  className={cn(
                    "w-4 h-4 transition-transform duration-300",
                    dropdownOpen[filterId] && "transform rotate-180"
                  )} 
                />
              </Button>

              <AnimatePresence>
                {dropdownOpen[filterId] && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "absolute z-50 w-48 mt-2 py-2 rounded-xl border shadow-lg",
                      theme === 'dark' 
                        ? 'bg-[#110C1D] border-[#6938EF]/20' 
                        : 'bg-white border-border'
                    )}
                  >
                    {filterOptions[filterId].map((option) => (
                      <motion.button
                        key={option}
                        whileHover={{ x: 4 }}
                        onClick={() => handleOptionSelect(filterId, option)}
                        className={cn(
                          "flex items-center w-full px-4 py-2 text-sm transition-colors duration-300",
                          selectedFilters[filterId] === option
                            ? "text-[#6938EF] bg-[#6938EF]/10"
                            : theme === 'dark' ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900",
                        )}
                      >
                        <span className="flex-1 text-left">{option}</span>
                        {selectedFilters[filterId] === option && (
                          <Check className="w-4 h-4 text-[#6938EF]" />
                        )}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Active Filters */}
      {Object.values(selectedFilters).some(value => value) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center gap-3 mb-6"
        >
          <span className="text-sm text-muted-foreground">Active Filters:</span>
          {Object.entries(selectedFilters).map(([key, value]) => value && (
            <motion.button
              key={key}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => handleOptionSelect(key, '')}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-full flex items-center gap-2 transition-colors duration-300",
                theme === 'dark' 
                  ? 'bg-[#6938EF] text-white hover:bg-[#5B2FD1]' 
                  : 'bg-[#6938EF] text-white hover:bg-[#5B2FD1]'
              )}
            >
              {value}
              <span className="text-white/80">×</span>
            </motion.button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedFilters(defaultFilters)}
            className="text-sm text-muted-foreground hover:text-[#6938EF]"
          >
            Clear All
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default FilterBar;
