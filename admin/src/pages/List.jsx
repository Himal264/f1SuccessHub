import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const List = () => {
  const token = localStorage.getItem('token');
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/question/list", {
        headers: {
          Authorization: `Bearer ${token}`,
         
        },
      });
      if (response.data.success) {
        const questions = response.data.questions;
        setQuestions(questions);
        setFilteredQuestions(questions);

        // Extract unique categories from the questions
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

  const removeQuestion = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/question/remove",
        { id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchQuestions();
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
      <p className="mb-4 text-lg font-bold">All Questions List</p>

      {/* Category Filter */}
      <div className="flex items-center gap-4 mb-4">
        <label className="font-semibold">Filter by Category:</label>
        <select
          className="px-3 py-2 border rounded-md"
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
                <p className="text-sm font-semibold text-gray-600">Question:</p>
                <p className="text-sm text-gray-800">{item.question}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Answer:</p>
                <p className="text-sm text-gray-800">{item.answer}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Reasoning:</p>
                <p className="text-sm text-gray-800">{item.reasoning}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Type:</p>
                <p className="text-sm text-gray-800">{item.type}</p>
              </div>
              <button
                onClick={() => removeQuestion(item._id)}
                className="mt-2 self-start px-3 py-1 text-white bg-red-500 rounded-md hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default List;
