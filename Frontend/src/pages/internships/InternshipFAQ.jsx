import React, { useState } from 'react';
import './InternshipFAQ.css';

const FAQHeader = ({ title = "Explore Internship Opportunities", subtitle = "Discover Your Path to Success" }) => {
  return (
    <div className="faq-header">
      <h1 className="faq-title">{title}</h1>
      <h2 className="faq-subtitle">{subtitle}</h2>
    </div>
  );
};

const AccordionItem = ({ question = "Default Question", answer = "Default answer text goes here" }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`accordion-item ${isExpanded ? 'expanded' : ''}`}
      onClick={handleClick}
    >
      <img
        src="https://dashboard.codeparrot.ai/api/image/Z8XfYshTinWyM7Gg/icon-r.png"
        alt="expand"
        className="accordion-icon"
      />
      <div className="accordion-content">
        <h3 className="accordion-question">{question}</h3>
        <p className="accordion-answer">{answer}</p>
      </div>
    </div>
  );
};

const InternshipFAQ = () => {
  return (
    <div className="faq-layout">
      <FAQHeader />
      <div className="accordion-container">
        <AccordionItem
          question="What kind of internships are available?"
          answer="We offer a variety of internships across different fields including technology, marketing, and design."
        />
        <AccordionItem
          question="How can I apply for an internship?"
          answer="To apply for an internship, browse through the available internships, choose the one that interests you, and click on the 'Apply Now' button to begin the application process."
        />
        <AccordionItem
          question="What happens after I submit my application?"
          answer="After submitting your application, it will be reviewed by our team. If selected, you will be notified about the next steps. You can track the status of your application through your dashboard."
        />
        <AccordionItem
          question="Can I apply for multiple internships?"
          answer="Yes, you can apply for multiple internships based on your interests and qualifications. Each application will be reviewed separately."
        />
        <AccordionItem
          question="Are these internships paid?"
          answer="Some internships offer stipends or compensation, while others may be unpaid but provide valuable learning experiences. Details about compensation will be mentioned in the internship descriptions."
        />
        <AccordionItem
          question="How long do the internships last?"
          answer="The duration of internships varies depending on the program. Internships can range from a few weeks to several months. The specific duration will be specified in each internship listing."
        />
      </div>
    </div>
  );
};

export default InternshipFAQ;

