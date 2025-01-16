// src/context/FormContext.js
import React, { createContext, useContext, useState } from "react";

const FormContext = createContext();

export const FormContextProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    studyLevel: "",
    fieldOfStudy: "",
    gpa: "",
    englishTest: {
      type: "",
      score: ""
    },
    preferences: [],
    budget: ""
  });

  const updateFormData = (newData) => {
    setFormData((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  return (
    <FormContext.Provider value={{ formData, updateFormData }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => useContext(FormContext);
