import React from 'react';
import InternshipCard from './InternshipCard';
import FilterBar from './FilterBar';

const InternshipBody = () => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Explore Exciting Internship Opportunities</h1>
      </div>

      <FilterBar />

      <div style={styles.cardSection}>
        <h2 style={styles.sectionTitle}>Internshala</h2>
        <div style={styles.cardRow}>
          <InternshipCard title="Machine Learning Intern" />
          <InternshipCard title="Deep Learning Intern" />
          <InternshipCard title="AI Tools Intern" />
          <InternshipCard title="Robotics Intern" />
        </div>

        <h2 style={styles.sectionTitle}>Indeed</h2>
        <div style={styles.cardRow}>
          <InternshipCard title="Artificial Intelligence Intern" />
          <InternshipCard title="Electronics Intern" />
          <InternshipCard title="Frontend Developer Intern" />
          <InternshipCard title="Backend Developer Intern" />
        </div>

        <h2 style={styles.sectionTitle}>LinkedIn</h2>
        <div style={styles.cardRow}>
          <InternshipCard title="Full Stack Developer Intern" />
          <InternshipCard title="Robotics Intern" />
          <InternshipCard title="Neural Networks Intern" />
          <InternshipCard title="Machine Learning Intern" />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    padding: '0 20px',
    boxSizing: 'border-box',
  },
  header: {
    width: '100%',
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3a0ca3',
    boxSizing: 'border-box',
    textAlign: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontFamily: 'Urbanist, sans-serif',
    fontSize: '48px',
    fontWeight: 700,
    lineHeight: '1.2',
    margin: 0,
    textAlign: 'center',
    '@media (max-width: 768px)': {
      fontSize: '36px',
    },
    '@media (max-width: 480px)': {
      fontSize: '28px',
    }
  },
  cardSection: {
    padding: '20px 0',
    justifyContent: 'center',
  },
  sectionTitle: {
    marginBottom: 26,
    marginTop: 40,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cardRow: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px',
  },
};

export default InternshipBody;
