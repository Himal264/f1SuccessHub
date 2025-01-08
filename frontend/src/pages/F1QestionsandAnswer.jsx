import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import Footer from "../components/Footer";
import SuccessMatters from "../components/SuccessMatters";
import StickyAdvisorNote from "../components/StickyAdvisorNote";
import Hero from "../components/Hero";

const F1QestionsandAnswer = ({ token }) => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/question/list", {
        headers: { token },
      });
      if (response.data.success) {
        const questions = response.data.questions;
        setQuestions(questions);
        setFilteredQuestions(questions);

        const uniqueCategories = [
          "All",
          ...new Set(questions.map((item) => item.type)),
        ];
        setCategories(uniqueCategories);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);

    if (category === "All") {
      setFilteredQuestions(questions);
    } else {
      const filtered = questions.filter((item) => item.type === category);
      setFilteredQuestions(filtered);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <>
    
    <Hero />
      <div className="relative flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto px-4 pb-20 lg:pb-4">
        
        <div className="flex-1">
          {/* Category Filter */}
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <label className="font-semibold text-sm sm:text-base">
              Filter by Category:
            </label>
            <select
              className="w-full px-3 py-2 border rounded-md text-sm sm:text-base"
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Questions List */}
          <div className="flex flex-col gap-6">
            {filteredQuestions.map((item, index) => (
              <div
                className="relative p-4 border rounded-md shadow-lg bg-white"
                key={index}
              >
                {/* Question Number in the background */}
                <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-200 font-bold text-8xl">
                  {index + 1}
                </p>

                {/* Question Details */}
                <div className="relative z-10 flex flex-col gap-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-600">
                      Question:
                    </p>
                    <p className="text-sm text-gray-800">{item.question}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">
                      Answer:
                    </p>
                    <p className="text-sm text-gray-800">{item.answer}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">
                      Reasoning:
                    </p>
                    <p className="text-sm text-gray-800">{item.reasoning}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Type:</p>
                    <p className="text-sm text-gray-800">{item.type}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Importing StickyAdvisorNote */}
        <StickyAdvisorNote />
      </div>

      {/* Separate Success Matters and Footer */}
      <div className="mt-6">
        <SuccessMatters />
        <Footer />
      </div>
    </>
  );
};

export default F1QestionsandAnswer;
