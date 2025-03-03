import React from 'react';
// import Header from './Header';
// import FilterBar from './FilterBar';
import InternshipHead from './InternshipHead';
import InternshipBody from './InternshipBody';
import InternshipFAQ from './InternshipFAQ';

const Internships = () => {
  return (
    <div style={styles.container}>
      <InternshipHead />
      <InternshipBody />
      <InternshipFAQ />
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    maxWidth: '1440px',
    margin: '0 auto',
    backgroundColor: '#3a0ca3',
    // padding: '20px',
    boxSizing: 'border-box',
  },
  cardSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '64px',
  },
  cardRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: '36px',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: '20px',
  },
};

export default Internships;

