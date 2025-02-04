import React, { useState, useMemo } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const UniPageHero = ({ university }) => {
  const [level, setLevel] = useState("Graduate");
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  // Add debug log for initial university data
  console.log("University data:", university);
  console.log("Raw intake data:", university?.intake);

  // Determine which description to display based on the selected level
  const levelDescription =
    level === "Graduate"
      ? university?.graduatePrograms?.description
      : university?.undergraduatePrograms?.description;

  // Get available intakes that haven't passed their deadline
  const availableIntakes = useMemo(() => {
    if (!university?.intake || !Array.isArray(university.intake)) {
      console.log("No intake data available or invalid format");
      return [];
    }

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Log each intake for debugging
    university.intake.forEach((intake, index) => {
      console.log(`Intake ${index}:`, intake);
      console.log(`Deadline for intake ${index}:`, intake.deadline);
    });

    const filtered = university.intake
      .filter((intake) => {
        if (!intake?.deadline) {
          console.log("Missing deadline for intake:", intake);
          return false;
        }
        const deadlineDate = new Date(intake.deadline);
        const isValid = deadlineDate > currentDate;
        console.log("Deadline validation:", {
          intake: intake,
          deadlineDate: deadlineDate,
          currentDate: currentDate,
          isValid: isValid,
        });
        return isValid;
      })
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    console.log("Filtered intakes:", filtered);
    return filtered;
  }, [university?.intake]);

  const [selectedIntake, setSelectedIntake] = useState(null);

  // Set initial selected intake when availableIntakes changes
  React.useEffect(() => {
    console.log("Setting initial intake. Available intakes:", availableIntakes);
    if (availableIntakes.length > 0 && !selectedIntake) {
      console.log("Setting selected intake to:", availableIntakes[0]);
      setSelectedIntake(availableIntakes[0]);
    }
  }, [availableIntakes, selectedIntake]);

  // Calculate months left until deadline for selected intake
  const { monthsLeft, deadlineStr } = useMemo(() => {
    if (!selectedIntake?.deadline) {
      console.log("No deadline for selected intake:", selectedIntake);
      return { monthsLeft: 0, deadlineStr: "" };
    }

    const deadline = new Date(selectedIntake.deadline);
    const currentDate = new Date();

    // Calculate months difference
    let months =
      (deadline.getFullYear() - currentDate.getFullYear()) * 12 +
      (deadline.getMonth() - currentDate.getMonth());

    // Adjust for day of month
    if (currentDate.getDate() > deadline.getDate()) {
      months--;
    }

    // Format deadline date
    const deadlineStr = deadline.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    console.log("Deadline calculations:", {
      deadline,
      currentDate,
      months,
      deadlineStr,
    });

    return {
      monthsLeft: Math.max(0, months),
      deadlineStr,
    };
  }, [selectedIntake]);

  // Debug logs
  console.log("Available intakes:", availableIntakes);
  console.log("Selected intake:", selectedIntake);
  console.log("Months left:", monthsLeft);
  console.log("Deadline string:", deadlineStr);

  const nextMedia = () => {
    setCurrentMediaIndex((prev) =>
      prev === (university?.media?.length || 1) - 1 ? 0 : prev + 1
    );
  };

  const prevMedia = () => {
    setCurrentMediaIndex((prev) =>
      prev === 0 ? (university?.media?.length || 1) - 1 : prev - 1
    );
  };

  return (
    <div className="w-full bg-white">
      <div className="max-w-full mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Section - 40% width */}
          <div className="w-full lg:w-[40%] flex flex-col h-full">
            {/* University Info */}
            <div className="flex items-center gap-4 mb-4">
              <img
                src={university?.logoUrl || "/api/placeholder/48/48"}
                alt="University Logo"
                className="w-12 h-12 object-contain"
              />
              <h1 className="text-2xl font-bold text-blue-900">
                {university?.name}
              </h1>
            </div>

            {/* Level Selection */}
            <div className="relative inline-block mb-4">
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="appearance-none bg-white border rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Graduate</option>
                <option>Undergraduate</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-500" />
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-4 line-clamp-3">
              {levelDescription}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-blue-50 p-2 rounded-lg">
                <p className="text-sm text-blue-900">
                  <span className="font-bold">
                    {university?.totalEnrollment?.toLocaleString()}
                  </span>
                  <br />
                  Total Students
                </p>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg">
                <p className="text-sm text-blue-900">
                  <span className="font-bold">
                    {university?.internationalStudentPercentage}%
                  </span>
                  <br />
                  International students
                </p>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg">
                <p className="text-sm text-blue-900">
                  <span className="font-bold">
                    {university?.graduationrate}%
                  </span>
                  <br />
                  Graduation Rate
                </p>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg">
                <p className="text-sm text-blue-900">
                  <span className="font-bold">
                    {university?.acceptancerate}%
                  </span>
                  <br />
                  Acceptance Rate
                </p>
              </div>
            </div>

            {/* Rankings */}
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-blue-900">
                  #{university?.rankings?.usa} National Universities
                </span>
                <span className="text-xs text-gray-500">
                  U.S. News & World Report, 2024
                </span>
              </div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-blue-900">
                  #{university?.rankings?.world} World Universities
                </span>
                <span className="text-xs text-gray-500">QS World Rankings</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">
                  #{university?.rankings?.state} {university?.location?.state}
                </span>
                <span className="text-xs text-gray-500">State Ranking</span>
              </div>
            </div>
          </div>

          {/* Right Section - 60% width */}
          <div className="w-full lg:w-[60%] flex flex-col">
            {/* Media Carousel */}
            <div className="relative w-full h-72 mb-4 rounded-lg overflow-hidden">
              <img
                src={
                  university?.media?.[currentMediaIndex] ||
                  "/api/placeholder/800/600"
                }
                alt={`University view ${currentMediaIndex + 1}`}
                className="w-full h-full object-cover object-center"
              />
              {(university?.media?.length || 0) > 1 && (
                <>
                  <button
                    onClick={prevMedia}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextMedia}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Intake and Actions Container */}
            <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-24 mt-7">
              {/* Left Side - Intake and Deadline */}
              <div className="flex-1">
                {availableIntakes.length > 0 ? (
                  <>
                    <div className="relative mb-2">
                      <select
                        value={
                          selectedIntake
                            ? `${selectedIntake.month}-${selectedIntake.year}`
                            : ""
                        }
                        onChange={(e) => {
                          const [month, year] = e.target.value.split("-");
                          const intake = availableIntakes.find(
                            (i) =>
                              i.month === month &&
                              parseInt(i.year) === parseInt(year)
                          );
                          console.log("Selected new intake:", intake);
                          setSelectedIntake(intake || null);
                        }}
                        className="w-full appearance-none bg-white border rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        {availableIntakes.map((intake) => (
                          <option
                            key={`${intake.month}-${intake.year}`}
                            value={`${intake.month}-${intake.year}`}
                          >
                            {`${intake.month} ${intake.year}`}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-500" />
                    </div>

                    {selectedIntake && (
                      <div className="bg-blue-900 p-2 rounded-lg text-white h-14">
                        <p className="text-sm leading-tight">
                          There are{" "}
                          <span className="font-bold">{monthsLeft} months</span>{" "}
                          left to apply
                        </p>
                        <p className="text-xs text-blue-100">
                          Deadline {deadlineStr}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-gray-100 p-2 rounded-lg text-gray-600">
                    <p className="text-sm">No upcoming intakes available</p>
                  </div>
                )}
              </div>

              {/* Right Side - Action Buttons */}
              <div className="flex-1 flex flex-col justify-between h-auto lg:h-full">
                <Link 
                  to={`/applynow/${university?._id}`}
                  state={{ 
                    university: university,
                    level: level
                  }}
                  className="w-full"
                >
                  <button className="w-full bg-blue-900 text-white py-2 px-3 rounded-md hover:bg-blue-800 transition-colors font-medium text-sm mb-2 lg:mb-0">
                    Apply Now
                  </button>
                </Link>
                <Link to="/advisor-inquiriesform" className="w-full">
                  <button className="w-full bg-white border-2 border-blue-900 text-blue-900 py-2 px-3 rounded-md hover:bg-blue-50 transition-colors font-medium text-sm">
                    Ask an Advisor
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniPageHero;
