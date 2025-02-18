import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import { FormProvider } from './context/FormContext';
import { AgoraProvider } from './context/AgoraContext';
import { ChatProvider } from './context/ChatContext';

import Home from "./pages/Home";
import F1QestionsandAnswer from "./pages/F1QestionsandAnswer.jsx";
import About from "./pages/About";

import LoginForm from "./components/LoginForm";
import Navbar from "./components/Navbar";
import TermsConditions from "./pages/TermsConditions";
import Policy from "./pages/Policy";
import SignupForm from "./components/SignupForm";
import FAQpage from "./pages/FAQpage";
import SuccessMatterspage from "./pages/SuccessMatterspage";
import Academics from "./subpages/Academics";
import Admission from "./subpages/Admission";
import AssignmentWritingSupport from "./subpages/AssignmentWritingSupport";
import CareerGuidance from "./subpages/CareerGuidance";
import Connectalmuni from "./subpages/Connectalmuni";
import ConvenentAirport from "./subpages/ConvenentAirport";
import Detailapplication from "./subpages/Detailapplication";
import Enrollement from "./subpages/Enrollement";
import Entryrequirementlocal from "./subpages/Entryrequirementlocal";
import Eventscalender from "./subpages/Eventscalender";
import Expertguidance from "./subpages/Expertguidance";
import F1VisaInterviewPreparation from "./subpages/F1VisaInterviewPreparation";
import Fastadmission from "./subpages/Fastadmission";
import Institutionsupport from "./subpages/Institutionsupport";
import OnCampus from "./subpages/OnCampus";
import Organizedtimelines from "./subpages/Organizedtimelines";
import PersonalizedAcademicGuidance from "./subpages/PersonalizedAcademicGuidance";
import PrearrivalChecklist from "./subpages/PrearrivalChecklist";
import Referral from "./subpages/Referral";
import Research from "./subpages/Research";
import SkillDevelopment from "./subpages/SkillDevelopment";
import StudentfriendlyServices from "./subpages/StudentfriendlyServices";
import SupportiveStudyEnviroments from "./subpages/SupportiveStudyEnviroments";
import TransferingAcademicCredits from "./subpages/TransferingAcademicCredits";
import TransferPlacements from "./subpages/TransferPlacements";

import Universitymatch from "./subpages/Universitymatch";
import UniversitySpecificOnboarding from "./subpages/UniversitySpecificOnboarding";
import Visaguidancestep from "./subpages/Visaguidancestep";
import Helpdormandessentailas from "./subpages/Helpdormandessentailas";
import OritentationCampus from "./subpages/OritentationCampus";
import OpportunitesOfculuratlex from "./subpages/OpportunitesOfculuratlex";
import Studentsupport from "./subpages/Studentsupport";
import Career from "./subpages/Career";
import Resumeletterpre from "./subpages/Resumeletterpre";
import AluminiConnection from "./subpages/AluminiConnection";
import FindUniversity from "./pages/FindUniversity";
import WeArePatnerWith from "./pages/WeArePatnerWith";
import F1InterviewRememberthings from "./components/F1InterviewRememberthings";
import UniversityHero from "./components/UniversityHero";
import OurServices from "./pages/OurServices";
import Ourpatner from "./pages/Ourpatner";
import UniversityDetail from "./pages/UniversityDetail";
import ScrollToTop from "./subcomponents/ScrollToTop";
import ProgramSearchResults from "./components/ProgramSearchResults";
import SubjectProgramPage from "./pages/SubjectProgramPage";
import AdvisorInquiryForm from "./pages/AdvisorInquiryForm";
import ScholarshipSection from "./components/ScholarshipSection";
import UniversityForm from "./components/UniversityForm";
import ContactInformationForm from "./components/ContactInformationForm";
import SuccessPage from "./pages/SuccessPage";
import RelatedUniversities from "./components/RelatedUniversities";
import EventAdd from "./pages/EventAdd";
import Event from "./pages/Event";
import Results from "./components/Results";
import ApplyNow from "./components/ApplyNow";
import EventDetails from './pages/EventDetails';
import WebinarRoom from './pages/WebinarRoom';
import Stories from './pages/Stories';

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  return (
    <FormProvider>
      <AuthProvider>
        <AgoraProvider>
          <ChatProvider>
            <Router>
              <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
                <Navbar />
               
               
                <ScrollToTop />

                <Routes>
                  <Route path="/stories" element={<Stories />} />
                  <Route path="/applynow/:id" element={<ApplyNow />} />
                  <Route path="/results" element={<Results />} />
                  <Route path="/" element={<Home />} />
                  <Route path="/event" element={<Event />} />
                  <Route path="/event/add" element={<EventAdd />} />
                  <Route path="/related-universities" element={<RelatedUniversities />} />

                  <Route path="/universityform" element={<UniversityForm />} />
                  <Route path="/contactform" element={<ContactInformationForm/>}/>
                  <Route path="/success" element={<SuccessPage />} />

                  <Route
                    path="/programs/:level/:subject"
                    element={<ProgramSearchResults />}
                  />
                  <Route
                    path="/scholarships"
                    element={<ScholarshipSection />}
                  />

                  <Route
                    path="/subject/:level/:subject"
                    element={<SubjectProgramPage />}
                  />

                  <Route path="/f1questionsandanswers" element={<F1QestionsandAnswer />} />
                  <Route path="/university/:id" element={<UniversityDetail />} />
                  <Route path="/aboutus" element={<About />} />
                  <Route
                    path="/f1questionsandanswers/:f1questionsandanswersId"
                    element={<F1QestionsandAnswer />}
                  />
                  <Route
                    path="/findbestuniversity-for-you"
                    element={<FindUniversity />}
                  />
                  <Route
                    path="/programs/:level/:subject"
                    element={<ProgramSearchResults />}
                  />
                  <Route path="/loginform" element={<LoginForm />} />
                  <Route path="/termsandconditions" element={<TermsConditions />} />
                  <Route path="/policy" element={<Policy />} />
                  <Route path="/advisor-inquiriesform" element={<AdvisorInquiryForm />} />
                  <Route path="/signupform" element={<SignupForm />} />
                  <Route path="/forf1success" element={<SuccessMatterspage />} />


                  <Route path="/f1successhubfaqs?" element={<FAQpage />} />
                  <Route path="/wearepatner-with" element={<WeArePatnerWith />} />
                  <Route
                    path="/f1interview-remember-things"
                    element={<F1InterviewRememberthings />}
                  />
                  <Route path="/universityhero" element={<UniversityHero />} />
                  <Route path="/f1successhub-ourservices" element={<OurServices />} />
                  <Route path="/f1successhub-ourpatners" element={<Ourpatner />} />
                  <Route path="/f1successfor/academics" element={<Academics />} />
                  <Route path="/f1successfor/admission" element={<Admission />} />
                  <Route
                    path="/f1successfor/academics/assignment-writing-and-support"
                    element={<AssignmentWritingSupport />}
                  />
                  <Route
                    path="/f1successfor/career/career-guidance-and-preparation"
                    element={<CareerGuidance />}
                  />
                  <Route
                    path="/f1successfor/research/connect-with-current-and-past-students-alumni"
                    element={<Connectalmuni />}
                  />
                  <Route
                    path="/f1successfor/on-campus/convenient-airport-transfer-arrangements"
                    element={<ConvenentAirport />}
                  />
                  <Route
                    path="/f1successfor/admission/detailed-applications-review/"
                    element={<Detailapplication />}
                  />
                  <Route path="/f1successfor/enrollment" element={<Enrollement />} />
                  <Route
                    path="/f1successfor/admission/entry-requirements-for-your-region"
                    element={<Entryrequirementlocal />}
                  />
                  <Route
                    path="/f1successfor/research/events-and-workshops-calendar"
                    element={<Eventscalender />}
                  />
                  <Route
                    path="/f1successfor/research/expert-guidance-and-advice"
                    element={<Expertguidance />}
                  />
                  <Route
                    path="/f1successfor/enrollment/f1-visa-interview-preparation"
                    element={<F1VisaInterviewPreparation />}
                  />
                  <Route
                    path="/f1successfor/admission/fast-and-efficient-admissions-processing"
                    element={<Fastadmission />}
                  />
                  <Route
                    path="/f1successfor/admission/support-for-transferring-institutions"
                    element={<Institutionsupport />}
                  />
                  <Route path="/f1successfor/on-campus" element={<OnCampus />} />
                  <Route
                    path="/f1successfor/admission/organized-timelines-to-keep-you-on-track"
                    element={<Organizedtimelines />}
                  />
                  <Route
                    path="/f1successfor/academics/personalized-academic-guidance"
                    element={<PersonalizedAcademicGuidance />}
                  />
                  <Route
                    path="/f1successfor/enrollment/pre-arrival-checklist"
                    element={<PrearrivalChecklist />}
                  />
                  <Route
                    path="/f1successfor/career/referral-for-internship-and-work"
                    element={<Referral />}
                  />
                  <Route path="/f1successfor/research" element={<Research />} />
                  <Route
                    path="/f1successfor/career/skill-development-to-meet-industry-demands"
                    element={<SkillDevelopment />}
                  />
                  <Route
                    path="/f1successfor/enrollment/student-friendly-resources-and-services"
                    element={<StudentfriendlyServices />}
                  />
                  <Route
                    path="/f1successfor/academics/supportive-study-environments"
                    element={<SupportiveStudyEnviroments />}
                  />
                  <Route
                    path="/f1successfor/academics/transferring-academic-credits"
                    element={<TransferingAcademicCredits />}
                  />
                  <Route
                    path="/f1successfor/academics/transfer-placements"
                    element={<TransferPlacements />}
                  />
                 
                  <Route
                    path="/f1successfor/research/university-match-and-compare"
                    element={<Universitymatch />}
                  />
                  <Route
                    path="/f1successfor/enrollment/university-specific-onboarding"
                    element={<UniversitySpecificOnboarding />}
                  />
                  <Route
                    path="/f1successfor/enrollment/step-by-step-visa-guidance"
                    element={<Visaguidancestep />}
                  />
                  <Route
                    path="/f1successfor/on-campus/help-with-dorm-setup-and-essentials"
                    element={<Helpdormandessentailas />}
                  />
                  <Route
                    path="/f1successfor/on-campus/orientation-to-campus-life"
                    element={<OritentationCampus />}
                  />
                  <Route
                    path="/f1successfor/on-campus/opportunities-for-cultural-exploration"
                    element={<OpportunitesOfculuratlex />}
                  />
                  <Route
                    path="/f1successfor/on-campus/student-support"
                    element={<Studentsupport />}
                  />
                  <Route path="/f1successfor/career" element={<Career />} />
                  <Route
                    path="/f1successfor/career/personalized-resume-and-cover-letter-preparation"
                    element={<Resumeletterpre />}
                  />
                  <Route
                    path="/f1successfor/career/professionals-and-alumni-networking"
                    element={<AluminiConnection />}
                  />
                  <Route path="/events" element={<Event />} />
                  <Route path="/event/:id" element={<EventDetails />} />
                  <Route path="/webinar/:id" element={<WebinarRoom />} />
                </Routes>
                <ScrollToTop />
              </div>
            </Router>
          </ChatProvider>
        </AgoraProvider>
      </AuthProvider>
    </FormProvider>
  );
};

export default App;