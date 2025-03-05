import React from 'react';

const InternshipCard = ({
  title = "Machine Learning Intern",
  company = "Samsun Pvt Ltd.",
  location = "Mysuru, Shimoga, Gargoti, Colva, Chikmagalur",
  salary = "10,000 /month",
  duration = "6 Months",
  skills = "Skills : Python, Open CV, Django, docker, kubernetes",
  companyLogo = "https://dashboard.codeparrot.ai/api/image/Z8WX91j1kitRpYXf/rectangl.png",
  locationIcon = "https://dashboard.codeparrot.ai/api/image/Z8WX91j1kitRpYXf/location.png",
  skillsIcon = "https://dashboard.codeparrot.ai/api/image/Z8WX91j1kitRpYXf/xmlid-16.png"
}) => {
  return (
    <div style={styles.card}>
      <div style={styles.companyDetails}>
        <div style={styles.companyInfo}>
          <h3 style={styles.title}>{title}</h3>
          <p style={styles.companyName}>{company}</p>
        </div>
        <img src={companyLogo} alt="Company Logo" style={styles.logo} />
      </div>

      <hr style={styles.divider} />

      <div style={styles.details}>
        <div style={styles.detailRow}>
          <img src={locationIcon} alt="Location" style={styles.icon} />
          <p style={styles.text}>{location}</p>
        </div>

        <div style={styles.moneySection}>
          <div style={styles.detailRow}>
            <span style={styles.rupeeIcon}>₹</span>
            <p style={styles.text}>{salary}</p>
          </div>
        </div>

        <div style={styles.detailRow}>
          <span style={styles.durationIcon}>⏱</span>
          <p style={styles.text}>{duration}</p>
        </div>

        <div style={styles.detailRow}>
          <img src={skillsIcon} alt="Skills" style={styles.icon} />
          <p style={styles.text}>{skills}</p>
        </div>
      </div>

      <div style={styles.buttons}>
        <div style={styles.internshipBadge}>
          <span style={styles.badgeText}>Internship</span>
        </div>
        <button style={styles.applyButton}>Apply Now</button>
      </div>
    </div>
  );
};

const styles = {
  card: {
    width: '100%',
    maxWidth: '256px',
    height: 'auto',
    backgroundColor: '#ffffff',
    borderRadius: '9px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  companyDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  companyInfo: {
    flex: 1,
  },
  title: {
    fontFamily: 'Urbanist',
    fontSize: '12.71px',
    fontWeight: 600,
    color: '#000000',
    margin: 0,
    marginBottom: '5px',
  },
  companyName: {
    fontFamily: 'Urbanist',
    fontSize: '11.8px',
    fontWeight: 600,
    color: '#5a5a5a',
    margin: 0,
  },
  logo: {
    width: '41.76px',
    height: '41.76px',
    objectFit: 'cover',
  },
  divider: {
    border: 'none',
    borderTop: '0.91px solid #c8c4c4',
    margin: '0 0 20px 0',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: '17.25px',
    flex: 1,
    marginBottom: 15,
  },
  detailRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10.89px',
  },
  icon: {
    width: '18.16px',
    height: '18.16px',
  },
  text: {
    fontFamily: 'Urbanist',
    fontSize: '10.89px',
    fontWeight: 600,
    color: '#6f5f5f',
    margin: 0,
  },
  moneySection: {
    width: '100%',
  },
  rupeeIcon: {
    color: '#b5abab',
    fontSize: '10px',
  },
  durationIcon: {
    color: '#838383',
    fontSize: '16.34px',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  internshipBadge: {
    backgroundColor: '#d9d9d9',
    borderRadius: '1.82px',
    padding: '0.91px 8.37px',
  },
  badgeText: {
    fontFamily: 'Urbanist',
    fontSize: '9.99px',
    fontWeight: 700,
    color: '#7d7676',
  },
  applyButton: {
    backgroundColor: '#24bdff',
    borderRadius: '6.35px',
    padding: '3.63px 15.43px',
    border: 'none',
    fontFamily: 'Urbanist',
    fontSize: '10.89px',
    fontWeight: 600,
    color: '#000000',
    cursor: 'pointer',
  },
};

export default InternshipCard;

