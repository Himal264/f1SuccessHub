import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import StickyAdvisorNote from "./StickyAdvisorNote";

const QuestionsCollection = ({ token }) => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/question/list", {
        headers: { token },
      });
      if (response.data.success) {
        setQuestions(response.data.questions);
        setFilteredQuestions(response.data.questions);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div className="relative flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto px-4 pb-20 lg:pb-4">
      {/* Questions List */}
      <div className="flex-1 flex flex-col gap-6">
        {filteredQuestions.map((item, index) => (
          <div
            className="relative p-4 border rounded-md shadow-lg bg-white"
            key={index}
          >
            <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-200 font-bold text-8xl">
              {index + 1}
            </p>
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
            </div>
          </div>
        ))}
      </div>

      {/* Sticky Advisor Note */}
      <StickyAdvisorNote />
    </div>
  );
};

export default QuestionsCollection;
