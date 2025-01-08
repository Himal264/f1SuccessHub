import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const AddUniversity = ({ token }) => {
  const [formData, setFormData] = useState({
    name: "",
    logoUrl: "",
    media: ["", "", "", "", ""],
    applicationFee: "",
    intake: [],
    undergraduatePrograms: {
      description: "",
      programs: {
        Engineering: [],
        Economics: [],
        Finance: [],
        ComputerScience: [],
        Business: [],
      },
    },
    graduatePrograms: {
      description: "",
      programs: {
        Engineering: [],
        Economics: [],
        Finance: [],
        ComputerScience: [],
        Business: [],
      },
    },
    scholarships: [
      {
        name: "",
        type: "",
        eligibility: "",
        amount: "",
        duration: "",
      },
    ],
    rankings: { world: "", usa: "", state: "" },
    totalEnrollment: "",
    internationalStudentPercentage: "",
    feeStructure: {
      tuitionFee: "",
      livingFee: "",
      housingFee: "",
      diningFee: "",
      otherFees: "",
    },
    location: {
      name: "",
      totalPopulation: "",
      nearbyCities: [],
      keyIndustries: [],
      landmarks: [],
      weather: { summer: "", winter: "" },
      travelTime: [{ city: "", time: "" }],
    },
    contact: {
      email: "",
      phone: "",
      address: "",
      website: "",
    },
    description: "",
    // New fields added
    scores: {
      safety: "",
      employment: "",
      diversity: "",
      qualityOfTeaching: "",
    },
    admissionRequirements: {
      undergraduate: {
        SAT: "",
        GPA: "",
        Duolingo: "",
        IELTS: "",
        PTE: "",
        ACT: "",
      },
      graduate: {
        SAT: "",
        GPA: "",
        Duolingo: "",
        IELTS: "",
        PTE: "",
        ACT: "",
        GRE: "",
      },
    },
  });

  // Existing handlers remain the same...
  const handleChange = (e, nestedKey = null, deepNestedKey = null) => {
    const { name, value } = e.target;
    if (deepNestedKey) {
      setFormData((prev) => ({
        ...prev,
        [nestedKey]: {
          ...prev[nestedKey],
          [deepNestedKey]: {
            ...prev[nestedKey][deepNestedKey],
            [name]: value,
          },
        },
      }));
    } else if (nestedKey) {
      setFormData((prev) => ({
        ...prev,
        [nestedKey]: {
          ...prev[nestedKey],
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };



  // ... (keep all existing handlers)

  const handleArrayChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value.split(",").map((item) => item.trim()),
    }));
  };

  const handleProgramsChange = (level, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [level]: {
        ...prev[level],
        programs: {
          ...prev[level].programs,
          [field]: value.split(",").map((item) => item.trim()),
        },
      },
    }));
  };

  const handleScholarshipChange = (index, field, value) => {
    const newScholarships = [...formData.scholarships];
    newScholarships[index] = {
      ...newScholarships[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      scholarships: newScholarships,
    }));
  };

  const addScholarship = () => {
    setFormData((prev) => ({
      ...prev,
      scholarships: [
        ...prev.scholarships,
        {
          name: "",
          type: "",
          eligibility: "",
          amount: "",
          duration: "",
        },
      ],
    }));
  };

  const handleTravelTimeChange = (index, field, value) => {
    const newTravelTime = [...formData.location.travelTime];
    newTravelTime[index] = {
      ...newTravelTime[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        travelTime: newTravelTime,
      },
    }));
  };

  const addTravelTimeEntry = () => {
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        travelTime: [...prev.location.travelTime, { city: "", time: "" }],
      },
    }));
  };



  const handleAdmissionRequirementChange = (level, field, value) => {
    setFormData((prev) => ({
      ...prev,
      admissionRequirements: {
        ...prev.admissionRequirements,
        [level]: {
          ...prev.admissionRequirements[level],
          [field]: value,
        },
      },
    }));
  };
  
    const handleScoreChange = (field, value) => {
      setFormData((prev) => ({
        ...prev,
        scores: {
          ...prev.scores,
          [field]: value,
        },
      }));
    };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${backendUrl}/api/university/add`,
        formData,
        { headers: { token } }
      );
      if (response.status === 201) {
        toast.success("University added successfully!");
        setFormData({
          name: "",
          logoUrl: "",
          media: ["", "", "", "", ""],
          applicationFee: "",
          intake: [],
          undergraduatePrograms: {
            description: "",
            programs: {
              Engineering: [],
              Economics: [],
              Finance: [],
              ComputerScience: [],
              Business: [],
            },
          },
          graduatePrograms: {
            description: "",
            programs: {
              Engineering: [],
              Economics: [],
              Finance: [],
              ComputerScience: [],
              Business: [],
            },
          },
          scholarships: [
            {
              name: "",
              type: "",
              eligibility: "",
              amount: "",
              duration: "",
            },
          ],
          rankings: { world: "", usa: "", state: "" },
          totalEnrollment: "",
          internationalStudentPercentage: "",
          feeStructure: {
            tuitionFee: "",
            livingFee: "",
            housingFee: "",
            diningFee: "",
            otherFees: "",
          },
          location: {
            name: "",
            totalPopulation: "",
            nearbyCities: [],
            keyIndustries: [],
            landmarks: [],
            weather: { summer: "", winter: "" },
            travelTime: [{ city: "", time: "" }],
          },
          contact: {
            email: "",
            phone: "",
            address: "",
            website: "",
          },
          description: "",
          // Add the new fields to reset
          scores: {
            safety: "",
            employment: "",
            diversity: "",
            qualityOfTeaching: "",
          },
          admissionRequirements: {
            undergraduate: {
              SAT: "",
              GPA: "",
              Duolingo: "",
              IELTS: "",
              PTE: "",
              ACT: "",
            },
            graduate: {
              SAT: "",
              GPA: "",
              Duolingo: "",
              IELTS: "",
              PTE: "",
              ACT: "",
              GRE: "",
            },
          },
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding university");
    }
  };



  return (
    <form onSubmit={onSubmitHandler} className="space-y-8 p-6">
      {/* Keep all existing sections */}
      {/* Basic Information */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="University Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            placeholder="Logo URL"
            name="logoUrl"
            value={formData.logoUrl}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            placeholder="Media URLs (comma-separated)"
            value={formData.media.join(", ")}
            onChange={(e) => handleArrayChange("media", e.target.value)}
            className="p-2 border rounded"
          />
          <input
            placeholder="Application Fee"
            type="number"
            name="applicationFee"
            value={formData.applicationFee}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            placeholder="Intake (comma-separated)"
            value={formData.intake.join(", ")}
            onChange={(e) => handleArrayChange("intake", e.target.value)}
            className="p-2 border rounded"
            required
          />
        </div>
      </section>

      {/* Programs */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Programs</h2>
        {["undergraduatePrograms", "graduatePrograms"].map((level) => (
          <div key={level} className="space-y-4 border p-4 rounded">
            <h3 className="text-lg font-semibold">
              {level === "undergraduatePrograms" ? "Undergraduate" : "Graduate"}
            </h3>
            <textarea
              placeholder="Description"
              name="description"
              value={formData[level].description}
              onChange={(e) => handleChange(e, level)}
              className="w-full p-2 border rounded"
              required
            />
            {Object.keys(formData[level].programs).map((program) => (
              <div key={program}>
                <label className="block text-sm font-medium">{program}</label>
                <input
                  placeholder="Enter programs (comma-separated)"
                  value={formData[level].programs[program].join(", ")}
                  onChange={(e) =>
                    handleProgramsChange(level, program, e.target.value)
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            ))}
          </div>
        ))}
      </section>

      {/* Scholarships */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Scholarships</h2>
        {formData.scholarships.map((scholarship, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded"
          >
            {Object.keys(scholarship).map((field) => (
              <input
                key={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={scholarship[field]}
                onChange={(e) =>
                  handleScholarshipChange(index, field, e.target.value)
                }
                className="p-2 border rounded"
                type={field === "amount" ? "number" : "text"}
                required
              />
            ))}
          </div>
        ))}
        <button
          type="button"
          onClick={addScholarship}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Add Scholarship
        </button>
      </section>

      {/* Rankings */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Rankings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.keys(formData.rankings).map((rank) => (
            <input
              key={rank}
              placeholder={`${rank.toUpperCase()} Ranking`}
              name={rank}
              type="number"
              value={formData.rankings[rank]}
              onChange={(e) => handleChange(e, "rankings")}
              className="p-2 border rounded"
            />
          ))}
        </div>
      </section>

      {/* Enrollment */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Enrollment</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Total Enrollment"
            type="number"
            name="totalEnrollment"
            value={formData.totalEnrollment}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            placeholder="International Student Percentage"
            type="number"
            name="internationalStudentPercentage"
            value={formData.internationalStudentPercentage}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
        </div>
      </section>

      {/* Fee Structure */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Fee Structure</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.keys(formData.feeStructure).map((fee) => (
            <input
              key={fee}
              placeholder={fee.replace(/([A-Z])/g, " $1").trim()}
              name={fee}
              type="number"
              value={formData.feeStructure[fee]}
              onChange={(e) => handleChange(e, "feeStructure")}
              className="p-2 border rounded"
              required
            />
          ))}
        </div>
      </section>

      {/* Location */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Location</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Location Name"
            name="name"
            value={formData.location.name}
            onChange={(e) => handleChange(e, "location")}
            className="p-2 border rounded"
            required
          />
          <input
            placeholder="Total Population"
            name="totalPopulation"
            type="number"
            value={formData.location.totalPopulation}
            onChange={(e) => handleChange(e, "location")}
            className="p-2 border rounded"
            required
          />
          <input
            placeholder="Nearby Cities (comma-separated)"
            value={formData.location.nearbyCities.join(", ")}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                location: {
                  ...prev.location,
                  nearbyCities: e.target.value
                    .split(",")
                    .map((city) => city.trim()),
                },
              }));
            }}
            className="p-2 border rounded"
            required
          />
          <input
            placeholder="Key Industries (comma-separated)"
            value={formData.location.keyIndustries.join(", ")}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                location: {
                  ...prev.location,
                  keyIndustries: e.target.value
                    .split(",")
                    .map((industry) => industry.trim()),
                },
              }));
            }}
            className="p-2 border rounded"
            required
          />
          <input
            placeholder="Landmarks (comma-separated)"
            value={formData.location.landmarks.join(", ")}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                location: {
                  ...prev.location,
                  landmarks: e.target.value
                    .split(",")
                    .map((landmark) => landmark.trim()),
                },
              }));
            }}
            className="p-2 border rounded"
            required
          />
        </div>

        {/* Weather */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Summer Weather"
            name="summer"
            value={formData.location.weather.summer}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                location: {
                  ...prev.location,
                  weather: { ...prev.location.weather, summer: e.target.value },
                },
              }));
            }}
            className="p-2 border rounded"
            required
          />
          <input
            placeholder="Winter Weather"
            name="winter"
            value={formData.location.weather.winter}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                location: {
                  ...prev.location,
                  weather: { ...prev.location.weather, winter: e.target.value },
                },
              }));
            }}
            className="w-full px-3 py-2 border rounded"
            required
          />

          {/* Travel Time Entries */}
          <div className="mt-4">
            <label className="block mb-2">Travel Times</label>
            {formData.location.travelTime.map((entry, index) => (
              <div key={index} className="flex gap-4 mb-2">
                <input
                  placeholder="City"
                  value={entry.city}
                  onChange={(e) =>
                    handleTravelTimeChange(index, "city", e.target.value)
                  }
                  className="w-1/2 px-3 py-2 border rounded"
                  required
                />
                <input
                  placeholder="Travel Time"
                  value={entry.time}
                  onChange={(e) =>
                    handleTravelTimeChange(index, "time", e.target.value)
                  }
                  className="w-1/2 px-3 py-2 border rounded"
                  required
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addTravelTimeEntry}
              className="mt-2 px-4 py-2 bg-gray-200 rounded"
            >
              Add Travel Time Entry
            </button>
          </div>
        </div>
        {/* Contact Information */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Email"
              name="email"
              type="email"
              value={formData.contact.email}
              onChange={(e) => handleChange(e, "contact")}
              className="p-2 border rounded"
              required
            />
            <input
              placeholder="Phone"
              name="phone"
              type="tel"
              value={formData.contact.phone}
              onChange={(e) => handleChange(e, "contact")}
              className="p-2 border rounded"
              required
            />
            <input
              placeholder="Address"
              name="address"
              value={formData.contact.address}
              onChange={(e) => handleChange(e, "contact")}
              className="p-2 border rounded"
              required
            />
            <input
              placeholder="Website URL"
              name="website"
              type="url"
              value={formData.contact.website}
              onChange={(e) => handleChange(e, "contact")}
              className="p-2 border rounded"
              required
            />
          </div>
        </section>

        {/* Description */}
        <div className="col-span-2">
          <label className="block mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded min-h-[100px]"
            required
          />
        </div>
      </section>


      {/* New Scores Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">University Scores</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.keys(formData.scores).map((score) => (
            <div key={score}>
              <label className="block text-sm font-medium mb-1">
                {score.charAt(0).toUpperCase() + score.slice(1).replace(/([A-Z])/g, ' $1')}
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.scores[score]}
                onChange={(e) => handleScoreChange(score, e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          ))}
        </div>
      </section>

      {/* New Admission Requirements Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Admission Requirements</h2>
        
        {['undergraduate', 'graduate'].map((level) => (
          <div key={level} className="border p-4 rounded space-y-4">
            <h3 className="text-lg font-semibold capitalize">{level} Requirements</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.keys(formData.admissionRequirements[level]).map((requirement) => (
                <div key={requirement}>
                  <label className="block text-sm font-medium mb-1">{requirement}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.admissionRequirements[level][requirement]}
                    onChange={(e) => 
                      handleAdmissionRequirementChange(level, requirement, e.target.value)
                    }
                    className="w-full p-2 border rounded"
                    placeholder={`Enter ${requirement} score`}
                    required={requirement === 'GPA'}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Submit Button */}
      <button
        type="submit"
        className="mt-6 px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
      >
        Add University
      </button>
    </form>
  );
};

export default AddUniversity;