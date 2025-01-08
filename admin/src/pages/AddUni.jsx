import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const AddUniversity = () => {

  const token = localStorage.getItem('token');
  const [logoFile, setLogoFile] = useState(null);
  const [mediaFiles, setMediaFiles] = useState([null, null, null, null, null]);
  const [locationPhoto, setlocationPhoto] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    logoUrl: "",
    media: ["", "", "", "", ""],
    applicationFee: "",
    graduationrate: "",
    acceptancerate: "",
    intake: [],
    undergraduatePrograms: {
      description: "",
      programs: {
        Engineering: [],
        Humanities: [],
        MedicalandHealthScience: [],
        NaturalScience: [],
        Business: [],
        ComputerScience: [],
        SocialScience: [],
        Education: [],
      },
    },
    graduatePrograms: {
      description: "",
      programs: {
        Engineering: [],
        Humanities: [],
        MedicalandHealthScience: [],
        NaturalScience: [],
        Business: [],
        ComputerScience: [],
        SocialScience: [],
        Education: [],
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
      otherFees: "",
    },
    location: {
      name: "",
      totalPopulation: "",
      citysize:"",
      nearbyCities: [],
      keyIndustries: [],
      landmarks: [],
      locationPhoto: "",
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

  // Generic handler for simple field changes
  const handleChange = (e, section = null) => {
    const { name, value } = e.target;
    if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
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

  // Handler for array fields
  const handleArrayChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value.split(",").map((item) => item.trim()),
    }));
  };

  // Handler for programs
  const handleProgramsChange = (level, program, value) => {
    setFormData((prev) => ({
      ...prev,
      [level]: {
        ...prev[level],
        programs: {
          ...prev[level].programs,
          [program]: value.split(",").map((item) => item.trim()),
        },
      },
    }));
  };

  // Handler for scholarships
  const handleScholarshipChange = (index, field, value) => {
    setFormData((prev) => {
      const newScholarships = [...prev.scholarships];
      newScholarships[index] = {
        ...newScholarships[index],
        [field]: value,
      };
      return {
        ...prev,
        scholarships: newScholarships,
      };
    });
  };

  // Add new scholarship
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

  // Handler for travel time
  const handleTravelTimeChange = (index, field, value) => {
    setFormData((prev) => {
      const newTravelTime = [...prev.location.travelTime];
      newTravelTime[index] = {
        ...newTravelTime[index],
        [field]: value,
      };
      return {
        ...prev,
        location: {
          ...prev.location,
          travelTime: newTravelTime,
        },
      };
    });
  };

  // Add new travel time entry
  const addTravelTimeEntry = () => {
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        travelTime: [...prev.location.travelTime, { city: "", time: "" }],
      },
    }));
  };

  // Handler for scores
  const handleScoreChange = (score, value) => {
    setFormData((prev) => ({
      ...prev,
      scores: {
        ...prev.scores,
        [score]: value,
      },
    }));
  };

  // Handler for admission requirements
  const handleAdmissionRequirementChange = (level, requirement, value) => {
    setFormData((prev) => ({
      ...prev,
      admissionRequirements: {
        ...prev.admissionRequirements,
        [level]: {
          ...prev.admissionRequirements[level],
          [requirement]: value,
        },
      },
    }));
  };

  // File handlers remain the same
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setFormData((prev) => ({
        ...prev,
        logoUrl: URL.createObjectURL(file),
      }));
    }
  };
  const handlelocationPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setlocationPhoto(file); // Store the file for FormData submission
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          locationPhoto: URL.createObjectURL(file), // Preview URL for the photo
        },
      }));
    }
  };
  

  const handleMediaChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newMediaFiles = [...mediaFiles];
      newMediaFiles[index] = file;
      setMediaFiles(newMediaFiles);

      const newMedia = [...formData.media];
      newMedia[index] = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        media: newMedia,
      }));
    }
  };

  console.log('Sending token:', token);


  // Submit handler remains the same
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();

   
      // Append all the regular form data
      Object.keys(formData).forEach((key) => {
        if (key !== "logoUrl" && key !== "media") {
          if (typeof formData[key] === "object") {
            formDataToSend.append(key, JSON.stringify(formData[key]));
          } else {
            formDataToSend.append(key, formData[key]);
          }
        }
      });

      if (logoFile) {
        formDataToSend.append("logo", logoFile);
      }

      mediaFiles.forEach((file, index) => {
        if (file) {
          formDataToSend.append(`media${index + 1}`, file);
        }
      });

      if (locationPhoto) {
        formDataToSend.append("locationPhoto", locationPhoto);
      }
    

      const response = await axios.post(
        `${backendUrl}/api/university/add`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        toast.success("University added successfully!");
        setLogoFile(null);
        setMediaFiles([null, null, null, null, null]);
        setlocationPhoto(null);
        setFormData({
          name: "",
          logoUrl: "",
          media: ["", "", "", "", ""],
          applicationFee: "",
          graduationrate: "",
          acceptancerate: "",
          intake: [],
          undergraduatePrograms: {
            description: "",
            programs: {
              Engineering: [],
              Humanities: [],
              MedicalandHealthSciences: [],
              NaturalSciences: [],
              Business: [],
              ComputerScience: [],
              SocialScience: [],
              Education: [],
            },
          },
          graduatePrograms: {
            description: "",
            programs: {
              Engineering: [],
              Humanities: [],
              MedicalandHealthSciences: [],
              NaturalSciences: [],
              Business: [],
              ComputerScience: [],
              SocialScience: [],
              Education: [],
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
            otherFees: "",
          },
          location: {
            name: "",
            totalPopulation: "",
            citysize:"",
            nearbyCities: [],
            keyIndustries: [],
            landmarks: [],
            locationPhoto: "",
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

          <div className="space-y-2">
            <label className="block text-sm font-medium">Logo Upload</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="w-full p-2 border rounded"
            />
            {formData.logoUrl && (
              <img
                src={formData.logoUrl}
                alt="Logo preview"
                className="h-20 w-20 object-contain"
              />
            )}
          </div>

          <div className="space-y-2 col-span-2">
            <label className="block text-sm font-medium">
              Media Upload (Up to 5 images)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[0, 1, 2, 3, 4].map((index) => (
                <div key={index} className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleMediaChange(e, index)}
                    className="w-full p-2 border rounded"
                  />
                  {formData.media[index] && (
                    <img
                      src={formData.media[index]}
                      alt={`Media ${index + 1} preview`}
                      className="h-20 w-20 object-contain"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

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
            placeholder="Graduation Rate"
            type="number"
            name="graduationrate"
            value={formData.graduationrate}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            placeholder="Acceptance Rate"
            type="number"
            name="acceptancerate"
            value={formData.acceptancerate}
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
            placeholder="City Size"
            name="citysize"
            type="number"
            value={formData.location.citysize}
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

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            LocationPhoto Upload
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handlelocationPhotoChange}
            className="w-full p-2 border rounded"
          />
          {formData.locationPhoto && (
            <img
              src={formData.locationPhoto}
              alt="locationPhoto preview"
              className="h-20 w-20 object-contain"
            />
          )}
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
      </section>

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

      {/* Description Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Description</h2>
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Description</label>
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
                {score.charAt(0).toUpperCase() +
                  score.slice(1).replace(/([A-Z])/g, " $1")}
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

        {["undergraduate", "graduate"].map((level) => (
          <div key={level} className="border p-4 rounded space-y-4">
            <h3 className="text-lg font-semibold capitalize">
              {level} Requirements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.keys(formData.admissionRequirements[level]).map(
                (requirement) => (
                  <div key={requirement}>
                    <label className="block text-sm font-medium mb-1">
                      {requirement}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.admissionRequirements[level][requirement]}
                      onChange={(e) =>
                        handleAdmissionRequirementChange(
                          level,
                          requirement,
                          e.target.value
                        )
                      }
                      className="w-full p-2 border rounded"
                      placeholder={`Enter ${requirement} score`}
                      required={requirement === "GPA"}
                    />
                  </div>
                )
              )}
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
