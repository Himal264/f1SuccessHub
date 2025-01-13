import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Play, ChevronRight } from "lucide-react";

const subjectData = {
  Engineering: {
    jobGrowth: "12%",
    salary: "94,500",
    governmentJobs: "18%",
    description:
      "Pursue a degree in Engineering to develop innovative solutions for real-world problems. Focus on mechanical, electrical, civil, or chemical engineering principles.",
    videoTitle: "Engineering Career Paths",
  },
  Humanities: {
    jobGrowth: "8%",
    salary: "65,800",
    governmentJobs: "22%",
    description:
      "Study literature, philosophy, history, and languages to develop critical thinking and communication skills essential for various careers.",
    videoTitle: "Careers in Humanities",
  },
  MedicalandHealthSciences: {
    jobGrowth: "15%",
    salary: "86,700",
    governmentJobs: "24%",
    description:
      "Explore healthcare, medicine, and research to prepare for careers in hospitals, research facilities, or private practice.",
    videoTitle: "Healthcare Career Options",
  },
  NaturalSciences: {
    jobGrowth: "9%",
    salary: "78,900",
    governmentJobs: "28%",
    description:
      "Study physics, chemistry, biology, and environmental science to understand natural phenomena and conduct groundbreaking research.",
    videoTitle: "Natural Sciences Research",
  },
  Business: {
    jobGrowth: "10%",
    salary: "88,600",
    governmentJobs: "15%",
    description:
      "Master business principles, management strategies, and financial analysis to lead organizations and drive economic growth.",
    videoTitle: "Business Leadership Paths",
  },
  ComputerScience: {
    jobGrowth: "16%",
    salary: "118,370",
    governmentJobs: "26%",
    description:
      "Gain expertise in programming, algorithms, artificial intelligence, and software development for cutting-edge technology careers.",
    videoTitle: "Tech Career Opportunities",
  },
  SocialScience: {
    jobGrowth: "7%",
    salary: "68,400",
    governmentJobs: "32%",
    description:
      "Analyze human behavior, society, and culture through psychology, sociology, and anthropology studies.",
    videoTitle: "Social Science Impact",
  },
  Education: {
    jobGrowth: "11%",
    salary: "58,900",
    governmentJobs: "85%",
    description:
      "Develop teaching skills and educational theory to shape future generations in schools, universities, and learning centers.",
    videoTitle: "Education Career Guide",
  },
};

const SubjectProgramPage = () => {
  const { level, subject } = useParams();
  const [activeSection, setActiveSection] = useState("introduction");
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [programDetails, setProgramDetails] = useState(null);
  const [featuredUniversities, setFeaturedUniversities] = useState([]);
  const [sortOption, setSortOption] = useState("rank-low");

  const formatSubject = (text) => {
    return text.replace(/([A-Z])/g, " $1").trim();
  };

  const currentSubject = subjectData[subject] || subjectData.ComputerScience;

  useEffect(() => {
    const fetchProgramAndUniversities = async () => {
      try {
        const response = await fetch(
          "http://localhost:9000/api/university/list"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.universities) {
          console.error("No universities array in response");
          setFeaturedUniversities([]);
          return;
        }

        // Get top 9 universities based on ranking instead of 3
        const featured = data.universities
          .sort((a, b) => (a.rankings?.usa || 999) - (b.rankings?.usa || 999))
          .slice(0, 9);
        console.log("Featured Universities:", featured);
        setFeaturedUniversities(featured);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching universities:", error);
        setFeaturedUniversities([]);
        setLoading(false);
      }
    };

    fetchProgramAndUniversities();
  }, [level, subject]);

  const getSortedUniversities = (universities, sortType) => {
    const sortedUniversities = [...universities];

    switch (sortType) {
      case "name-asc":
        return sortedUniversities.sort((a, b) =>
          (a.name || "").localeCompare(b.name || "")
        );
      case "name-desc":
        return sortedUniversities.sort((a, b) =>
          (b.name || "").localeCompare(a.name || "")
        );
      case "tuition-high":
        return sortedUniversities.sort((a, b) => {
          const aTuition =
            level === "Undergraduate"
              ? a.feeStructure?.undergraduate?.tuitionFee || 0
              : a.feeStructure?.graduate?.tuitionFee || 0;
          const bTuition =
            level === "Undergraduate"
              ? b.feeStructure?.undergraduate?.tuitionFee || 0
              : b.feeStructure?.graduate?.tuitionFee || 0;
          return bTuition - aTuition;
        });
      case "tuition-low":
        return sortedUniversities.sort((a, b) => {
          const aTuition =
            level === "Undergraduate"
              ? a.feeStructure?.undergraduate?.tuitionFee || 0
              : a.feeStructure?.graduate?.tuitionFee || 0;
          const bTuition =
            level === "Undergraduate"
              ? b.feeStructure?.undergraduate?.tuitionFee || 0
              : b.feeStructure?.graduate?.tuitionFee || 0;
          return aTuition - bTuition;
        });
      case "rank-high":
        return sortedUniversities.sort(
          (a, b) => (b.rankings?.usa || 0) - (a.rankings?.usa || 0)
        );
      case "rank-low":
        return sortedUniversities.sort(
          (a, b) => (a.rankings?.usa || 999) - (b.rankings?.usa || 999)
        );
      default:
        return sortedUniversities;
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Navigation */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-4 pt-12">
          <div className="flex flex-col lg:flex-row gap-12 mb-8">
            <div className="lg:w-2/3">
              <p className="text-gray-600 mb-2">7 UNIVERSITIES</p>
              <h1 className="text-4xl font-serif text-gray-900 mb-4">
                {level} Degrees in {formatSubject(subject)}
              </h1>
              <p className="text-gray-700 mb-6">
                Looking to earn a {level.toLowerCase()} degree in{" "}
                {formatSubject(subject).toLowerCase()}? Talk to a F1SuccessHub
                advisor about top-ranked universities &{" "}
                {formatSubject(subject).toLowerCase()} programs for
                international students.
              </p>
              <button className="bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 flex items-center">
                Ask an Advisor <ChevronRight className="ml-2 h-4 w-4" />
              </button>
            </div>
            <div className="lg:w-1/3">
              <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                <div className="absolute top-4 left-4">
                  <p className="text-sm font-medium">F1SuccessHub</p>
                </div>
                <button className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black bg-opacity-50 rounded-full p-4">
                    <Play className="h-8 w-8 text-white" />
                  </div>
                </button>
                <div className="relative bg-gray-100 rounded-lg overflow-hidden h-64">
                  <img
                    src="/api/placeholder/400/225"
                    alt={`${currentSubject.videoTitle}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <p className="text-white text-sm font-medium">
                      {currentSubject.videoTitle}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation at bottom of hero section */}
          <div className="border-b border-gray-200">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveSection("introduction")}
                className={`py-4 px-1 border-b-2 ${
                  activeSection === "introduction"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Introduction
              </button>
              <button
                onClick={() => setActiveSection("featured")}
                className={`py-4 px-1 border-b-2 ${
                  activeSection === "featured"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Featured Universities
              </button>
              <button
                onClick={() => setActiveSection("stories")}
                className={`py-4 px-1 border-b-2 ${
                  activeSection === "stories"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Relevant Stories
              </button>
              <button
                onClick={() => setActiveSection("faqs")}
                className={`py-4 px-1 border-b-2 ${
                  activeSection === "faqs"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                FAQs
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Introduction Section with Stats */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-2/3">
              <h2 className="text-3xl font-serif text-gray-900 mb-6">
                What is {formatSubject(subject)}?
              </h2>
              <p className="text-gray-700">{currentSubject.description}</p>
            </div>
            <div className="lg:w-1/3">
              <div className="space-y-8">
                <div>
                  <p className="text-4xl font-serif text-gray-900">
                    ${currentSubject.salary}
                  </p>
                  <p className="text-sm text-gray-600">
                    median salary for {formatSubject(subject).toLowerCase()} and
                    research scientists (May 2018)
                  </p>
                </div>
                <div>
                  <p className="text-4xl font-serif text-gray-900">
                    +{currentSubject.jobGrowth}
                  </p>
                  <p className="text-sm text-gray-600">
                    projected job growth by 2028
                  </p>
                </div>
                <div>
                  <p className="text-4xl font-serif text-gray-900">
                    {currentSubject.governmentJobs}
                  </p>
                  <p className="text-sm text-gray-600">
                    of {formatSubject(subject).toLowerCase()} and research
                    scientists work in government sectors
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Universities Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 bg-gray-100">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-serif">Featured Universities</h2>

          {/* Sorting dropdown */}
          <div className="relative">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="block w-64 pl-4 pr-8 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="rank-low">Ranking: Low to High</option>
              <option value="rank-high">Ranking: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
              <option value="tuition-low">Tuition: Low to High</option>
              <option value="tuition-high">Tuition: High to Low</option>
            </select>
          </div>
        </div>

        {featuredUniversities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {getSortedUniversities(featuredUniversities, sortOption)
              .slice(0, 9)
              .map((university) => (
                <Link
                  key={university?._id}
                  to={`/university/${university?._id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-medium text-gray-900 mb-1">
                          {university?.name || "University Name"}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {university?.location?.name || ""},{" "}
                          {university?.location?.state || ""}
                        </p>
                      </div>
                      <img
                        src={
                          university?.logoUrl || "/default-university-logo.png"
                        }
                        alt={`${university?.name || "University"} logo`}
                        className="w-12 h-12 object-contain"
                      />
                    </div>

                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <h4 className="text-sm font-semibold text-blue-900 mb-2">
                        Available {level} Programs in {formatSubject(subject)}
                      </h4>
                      {level === "Undergraduate" ? (
                        <div>
                          {university?.undergraduatePrograms?.programs?.[
                            subject
                          ]?.map((program, index) => (
                            <div
                              key={index}
                              className="text-sm text-blue-800 mb-1"
                            >
                              • {program}
                            </div>
                          )) || (
                            <p className="text-sm text-gray-600 italic">
                              No specific programs listed
                            </p>
                          )}
                          {university?.undergraduatePrograms?.description && (
                            <p className="text-xs text-gray-600 mt-2">
                              {university.undergraduatePrograms.description}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div>
                          {university?.graduatePrograms?.programs?.[
                            subject
                          ]?.map((program, index) => (
                            <div
                              key={index}
                              className="text-sm text-blue-800 mb-1"
                            >
                              • {program}
                            </div>
                          )) || (
                            <p className="text-sm text-gray-600 italic">
                              No specific programs listed
                            </p>
                          )}
                          {university?.graduatePrograms?.description && (
                            <p className="text-xs text-gray-600 mt-2">
                              {university.graduatePrograms.description}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 mt-4">
                      <div>
                        <span className="text-sm text-gray-600">
                          {level} Tuition
                        </span>
                        <p className="font-medium">
                          $
                          {(level === "Undergraduate"
                            ? university?.feeStructure?.undergraduate
                                ?.tuitionFee
                            : university?.feeStructure?.graduate?.tuitionFee ||
                              0
                          ).toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <span className="text-sm text-gray-600">
                          Acceptance Rate
                        </span>
                        <p className="font-medium">
                          {university?.acceptancerate || "N/A"}%
                        </p>
                      </div>

                      <div>
                        <span className="text-sm text-gray-600">
                          Graduation Rate
                        </span>
                        <p className="font-medium">
                          {university?.graduationrate || "N/A"}%
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 w-full flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors">
                      <span>View Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">
            No featured universities available.
          </p>
        )}
      </div>
    </div>
  );
};

export default SubjectProgramPage;
