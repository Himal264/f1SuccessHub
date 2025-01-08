import React, { useState } from 'react';
import Footer from './Footer';

const FAQLink = ({ text, href }) => (
  <a 
    href={href}
    className="text-gray-700 underline transition-colors duration-200"
    target="_blank"
    rel="noopener noreferrer"
  >
    {text}
  </a>
);

const FAQItem = ({ question, answerContent, isOpen, onToggle }) => {
  return (
    <div className="border rounded-lg mb-4 bg-white shadow-sm">
      <button
        className="w-full py-4 px-6 text-left flex justify-between items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-lg"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="text-lg font-medium text-gray-900">{question}</span>
        <span className="ml-6 flex-shrink-0 bg-black rounded-full w-6 h-6 flex items-center justify-center">
          <span className="text-white text-xl">
            {isOpen ? '−' : '+'}
          </span>
        </span>
      </button>
      {isOpen && (
        <div className="px-6 pb-4">
          <div className="pt-4 text-gray-600 space-y-4">
            {answerContent}
          </div>
        </div>
      )}
    </div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do international students choose a US college?",
      answerContent: (
        <div>
          <p className="mb-2">There are several important factors to consider when choosing a US college:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Browse <FAQLink text="college rankings and programs" href="#/rankings" /> to find the best fit</li>
            <li>Check <FAQLink  text="admission requirements" href="#/requirements" /> for international students</li>
            <li>Review <FAQLink text="tuition and financial aid options" href="#/financial-aid" /></li>
            <li>Explore <FAQLink text="campus life and location details" href="#/campus-life" /></li>
          </ul>
        </div>
      )
    },
    {
      question: "How does F1SuccessHub support international students?",
      answerContent: (
        <div>
          <p className="mb-2">We offer comprehensive support services including:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><FAQLink text="Academic advising" href="#/academic-support" /> for course selection and study plans</li>
            <li><FAQLink text="Cultural integration programs" href="#/cultural-programs" /> to help you adjust</li>
            <li><FAQLink text="English language support" href="#/english-support" /> throughout your studies</li>
            <li><FAQLink text="Student community events" href="#/events" /> to connect with peers</li>
          </ul>
        </div>
      )
    },
    {
      question: "How does F1SuccessHub help with college applications?",
      answerContent: (
        <div>
          <p className="mb-2">Our application assistance includes:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><FAQLink text="Document preparation guide" href="#/documents" /></li>
            <li><FAQLink text="Essay writing support" href="#/essay-help" /></li>
            <li><FAQLink text="Application timeline planner" href="#/timeline" /></li>
            <li><FAQLink text="Visa application assistance" href="#/visa-help" /></li>
          </ul>
        </div>
      )
    },
    {
      question: "How does F1SuccessHub help international students with their career development?",
      answerContent: (
        <div>
          <p className="mb-2">Access our career development resources:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><FAQLink text="Career counseling sessions" href="#/career-counseling" /></li>
            <li><FAQLink text="Internship opportunities" href="#/internships" /></li>
            <li><FAQLink text="Resume workshop registration" href="#/resume-workshop" /></li>
            <li><FAQLink text="Networking events calendar" href="#/networking" /></li>
          </ul>
        </div>
      )
    },
    {
      question: "What other services does F1SuccessHub offer?",
      answerContent: (
        <div>
          <p className="mb-2">Discover our additional services:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><FAQLink text="Housing assistance" href="#/housing" /></li>
            <li><FAQLink text="Airport pickup service" href="#/airport-pickup" /></li>
            <li><FAQLink text="Health insurance guidance" href="#/health-insurance" /></li>
            <li><FAQLink text="Banking setup help" href="#/banking" /></li>
          </ul>
        </div>
      )
    }
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-center mb-8 text-gray-900">F1SuccessHub FAQs ?</h1>
      <div className="space-y-2">
        {faqs.map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.question}
            answerContent={faq.answerContent}
            isOpen={openIndex === index}
            onToggle={() => toggleFaq(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default FAQ;