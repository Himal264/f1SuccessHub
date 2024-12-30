import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Add = ({ token }) => {
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    reasoning: "",
    type: "course and university selection",
  });

  const questionTypes = [
    "personal background",
    "academic background",
    "course and university selection",
    "financial capability",
    "career goals",
    "ties to home country",
    "knowledge of the U.S. and visa process",
  ];

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        backendUrl + "/api/question/add",
        formData,
        {headers:{token}}
      );
      console.log(response.data);

      if (response.data.success) {
        toast.success(response.data.message)
        // Reset form
        setFormData({
          question: "",
          answer: "",
          reasoning: "",
          type: "course and university selection",
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3">
      <div className="w-full">
        <p className="mb-2">Question</p>
        <textarea
          name="question"
          value={formData.question}
          onChange={handleChange}
          className="w-full max-w-[500px] px-3 py-2 min-h-[100px]"
          placeholder="Enter your question"
          required
        />
        <p className="mt-1 text-sm text-gray-500">
          {formData.question.length}/300 characters
        </p>
      </div>

      <div className="w-full">
        <p className="mb-2">Answer</p>
        <textarea
          name="answer"
          value={formData.answer}
          onChange={handleChange}
          className="w-full max-w-[500px] px-3 py-2 min-h-[100px]"
          placeholder="Enter the answer"
          required
        />
        <p className="mt-1 text-sm text-gray-500">
          {formData.answer.length}/1000 characters
        </p>
      </div>

      <div className="w-full">
        <p className="mb-2">Reasoning</p>
        <textarea
          name="reasoning"
          value={formData.reasoning}
          onChange={handleChange}
          className="w-full max-w-[500px] px-3 py-2 min-h-[100px]"
          placeholder="Enter the reasoning"
          required
        />
        <p className="mt-1 text-sm text-gray-500">
          {formData.reasoning.length}/1000 characters
        </p>
      </div>

      <div className="w-full">
        <p className="mb-2">Question Type</p>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full px-3 py-2"
        >
          {questionTypes.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="w-28 py-2 mt-4 bg-black text-white">
        ADD
      </button>
    </form>
  );
};

export default Add;
