import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Update = () => {
  const token = localStorage.getItem('token');
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [type, setType] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const questionId = new URLSearchParams(location.search).get("questionId");

  const fetchQuestionDetails = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/question/details`, {
        params: { questionId },
        headers: {
          Authorization: `Bearer ${token}`,
         },
      });
      if (response.data.success) {
        const { question, answer, reasoning, type } = response.data.question;
        setQuestion(question);
        setAnswer(answer);
        setReasoning(reasoning);
        setType(type);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/question/update`,
        { questionId, updates: { question, answer, reasoning, type } },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Question updated successfully!");
        navigate("/list");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchQuestionDetails();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Update Question</h2>
      <div className="mb-4">
        <label className="block font-semibold">Question:</label>
        <textarea
          className="w-full px-3 py-2 border rounded-md"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        ></textarea>
      </div>
      <div className="mb-4">
        <label className="block font-semibold">Answer:</label>
        <textarea
          className="w-full px-3 py-2 border rounded-md"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        ></textarea>
      </div>
      <div className="mb-4">
        <label className="block font-semibold">Reasoning:</label>
        <textarea
          className="w-full px-3 py-2 border rounded-md"
          value={reasoning}
          onChange={(e) => setReasoning(e.target.value)}
        ></textarea>
      </div>
      <div className="mb-4">
        <label className="block font-semibold">Type:</label>
        <select
          className="w-full px-3 py-2 border rounded-md"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">Select Type</option>
          <option value="personal background">Personal Background</option>
          <option value="academic background">Academic Background</option>
          <option value="course and university selection">
            Course and University Selection
          </option>
          <option value="financial capability">Financial Capability</option>
          <option value="career goals">Career Goals</option>
          <option value="ties to home country">Ties to Home Country</option>
          <option value="knowledge of the U.S. and visa process">
            Knowledge of the U.S. and Visa Process
          </option>
        </select>
      </div>
      <button
        onClick={handleUpdate}
        className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
      >
        Update
      </button>
    </div>
  );
};

export default Update;
