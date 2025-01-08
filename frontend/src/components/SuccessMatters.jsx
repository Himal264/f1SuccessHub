import React from 'react';
import Footer from './Footer';

const SuccessMatters = () => {
  const services = [
    {
      id: "1",
      title: "Research",
      titleLink: "/f1successfor/research",
      items: [
        { text: "Detail University details ?", link: "/f1successfor/research/detail-university-details" },
        { text: "University match and compare ?", link: "/f1successfor/research/university-match-and-compare" },
        { text: "Events and workshops calendar ?", link: "/f1successfor/research/events-and-workshops-calendar" },
        { text: "Expert guidance and advice ?", link: "/f1successfor/research/expert-guidance-and-advice" },
        { text: "Connect with current and past students alumni ?", link: "/f1successfor/research/connect-with-current-and-past-students-alumni" }
      ]
    },
    {
      id: "2",
      title: "Admission",
      titleLink: "/f1successfor/admission",
      items: [
        { text: "Detailed applications review ?", link: "/f1successfor/admission/detailed-applications-review/" },
        { text: "Entry requirements for your region ?", link: "/f1successfor/admission/entry-requirements-for-your-region" },
        { text: "Fast and efficient admissions processing ?", link: "/f1successfor/admission/fast-and-efficient-admissions-processing" },
        { text: "Support for transferring institutions ?", link: "/f1successfor/admission/support-for-transferring-institutions" },
        { text: "Organized timelines to keep you on track ?", link: "/f1successfor/admission/organized-timelines-to-keep-you-on-track" }
      ]
    },
    {
      id: "3",
      title: "Enrollment",
      titleLink: "/f1successfor/enrollment",
      items: [
        { text: "Step-by-step visa guidance ?", link: "/f1successfor/enrollment/step-by-step-visa-guidance" },
        { text: "F1 visa interview preparation ?", link: "/f1successfor/enrollment/f1-visa-interview-preparation" },
        { text: "Pre-arrival checklist ?", link: "/f1successfor/enrollment/pre-arrival-checklist" },
        { text: "University-specific onboarding ?", link: "/f1successfor/enrollment/university-specific-onboarding" },
        { text: "Student-friendly resources and services ?", link: "/f1successfor/enrollment/student-friendly-resources-and-services" }
      ]
    },
    {
      id: "4",
      title: "On Campus",
      titleLink: "/f1successfor/on-campus",
      items: [
        { text: "Convenient airport transfer arrangements ?", link: "/f1successfor/on-campus/convenient-airport-transfer-arrangements" },
        { text: "Help with dorm setup and essentials ?", link: "/f1successfor/on-campus/help-with-dorm-setup-and-essentials" },
        { text: "Orientation to campus life ?", link: "/f1successfor/on-campus/orientation-to-campus-life" },
        { text: "Opportunities for cultural exploration ?", link: "/f1successfor/on-campus/opportunities-for-cultural-exploration" },
        { text: "Student support ?", link: "/f1successfor/on-campus/student-support" }
      ]
    },
    {
      id: "5",
      title: "Academics",
      titleLink: "/f1successfor/academics",
      items: [
        { text: "Assignment Writing and Support ?", link: "/f1successfor/academics/assignment-writing-and-support" },
        { text: "Transfer placements ?", link: "/f1successfor/academics/transfer-placements" },
        { text: "Personalized academic guidance ?", link: "/f1successfor/academics/personalized-academic-guidance" },
        { text: "Transferring academic credits ?", link: "/f1successfor/academics/transferring-academic-credits" },
        { text: "Supportive study environments ?", link: "/f1successfor/academics/supportive-study-environments" }//
      ]
    },
    {
      id: "6",
      title: "Career",
      titleLink: "/f1successfor/career",//
      items: [
        { text: "Career guidance and preparation ?", link: "/f1successfor/career/career-guidance-and-preparation" },
        { text: "Skill development to meet industry demands ?", link: "/f1successfor/career/skill-development-to-meet-industry-demands" },
        { text: "Personalized Resume and cover letter prep ?", link: "/f1successfor/career/personalized-resume-and-cover-letter-preparation" },//
        { text: "Professionals and alumni networking ?", link: "/f1successfor/career/professionals-and-alumni-networking" },//
        { text: "Referral For Internship and Work?", link: "/f1successfor/career/referral-for-internship-and-work" }
      ]
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gray-50">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-semibold mb-6">Services Designed for Your Success</h1>
        <p className="text-gray-700 max-w-3xl mx-auto">
          Our tailored programs guide international students from their initial applications to enrollment and beyond. Partner universities offer enhanced support for admissions, visa processes, academics, and career opportunities, including our specialized programs for accelerated learning.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-light text-gray-400">{service.id}</span>
                <a href={service.titleLink} className="text-xl font-medium text-black hover:underline">
                  {service.title}
                </a>
              </div>
            </div>
            <ul className="space-y-3">
              {service.items.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-4 h-px bg-gray-400" />
                  <a href={item.link} className="text-gray-600 hover:underline">
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuccessMatters;
