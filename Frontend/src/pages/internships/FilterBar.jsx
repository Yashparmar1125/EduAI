import React, { useState } from 'react';

const FilterBar = ({ defaultFilters = { sector: '', industry: '', companyType: '', modeOfInternship: '' } }) => {
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
    setDropdownOpen((prev) => ({
      ...prev,
      [filterId]: !prev[filterId],
    }));
  };

  const handleOptionSelect = (filterId, option) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterId]: option,
    }));
    setDropdownOpen((prev) => ({ ...prev, [filterId]: false }));
  };

  return (
    <div style={styles.container}>
      <div style={styles.filterIcon}>
        <img src="https://dashboard.codeparrot.ai/api/image/Z8WX91j1kitRpYXf/filter.png" alt="filter" style={styles.icon} />
      </div>
      {Object.keys(filterOptions).map((filterId) => (
        <div key={filterId} style={styles.dropdownContainer}>
          <button
            onClick={() => handleFilterClick(filterId)}
            style={{
              ...styles.filterButton,
              backgroundColor: selectedFilters[filterId] ? '#2a2c3d' : '#1a1c2d',
            }}
          >
            <span style={styles.buttonText}>{selectedFilters[filterId] || filterLabels[filterId]}</span>
            <img
              src="https://dashboard.codeparrot.ai/api/image/Z8WX91j1kitRpYXf/vector.png"
              alt="dropdown"
              style={styles.dropdownIcon}
            />
          </button>
          {dropdownOpen[filterId] && (
            <div style={styles.dropdownMenu}>
              {filterOptions[filterId].map((option) => (
                <div
                  key={option}
                  style={styles.dropdownItem}
                  onClick={() => handleOptionSelect(filterId, option)}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
    padding: '20px',
    width: '100%',
    backgroundColor: 'transparent',
    flexWrap: 'wrap',
  },
  filterIcon: {
    width: '44px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  filterButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    height: '40px',
    padding: '0 20px',
    borderRadius: '17px',
    border: 'none',
    backgroundColor: '#1a1c2d',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    position: 'relative',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    fontFamily: 'Roboto, sans-serif',
    whiteSpace: 'nowrap',
  },
  dropdownIcon: {
    width: '11px',
    height: '7px',
  },
  dropdownContainer: {
    position: 'relative',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '45px',
    left: '0',
    width: 'max-content',
    minWidth: '150px',
    backgroundColor: '#2a2c3d',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
    zIndex: 10,
  },
  dropdownItem: {
    padding: '10px',
    color: '#ffffff',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'background 0.2s ease',
    whiteSpace: 'nowrap',
  },
  '@media (max-width: 768px)': {
    container: {
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: '10px',
    },
    filterButton: {
      width: '100%',
    },
    dropdownMenu: {
      width: '100%',
    },
  },
};

export default FilterBar;
