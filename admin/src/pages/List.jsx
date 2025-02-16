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
  const [editingQuestion, setEditingQuestion] = useState(null);

  // Add state for edit form
  const [editForm, setEditForm] = useState({
    question: "",
    answer: "",
    reasoning: "",
    type: ""
  });

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

  // Add function to handle edit mode
  const handleEdit = (question) => {
    setEditingQuestion(question._id);
    setEditForm({
      question: question.question,
      answer: question.answer,
      reasoning: question.reasoning,
      type: question.type
    });
  };

  // Add function to handle update
  const handleUpdate = async (id) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/question/update`,
        {
          questionId: id,
          updates: editForm
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Question updated successfully");
        setEditingQuestion(null);
        await fetchQuestions();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Add function to handle cancel edit
  const handleCancelEdit = () => {
    setEditingQuestion(null);
    setEditForm({
      question: "",
      answer: "",
      reasoning: "",
      type: ""
    });
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
              {editingQuestion === item._id ? (
                // Edit Form
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Question:</p>
                    <textarea
                      className="w-full p-2 border rounded"
                      value={editForm.question}
                      onChange={(e) => setEditForm({...editForm, question: e.target.value})}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Answer:</p>
                    <textarea
                      className="w-full p-2 border rounded"
                      value={editForm.answer}
                      onChange={(e) => setEditForm({...editForm, answer: e.target.value})}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Reasoning:</p>
                    <textarea
                      className="w-full p-2 border rounded"
                      value={editForm.reasoning}
                      onChange={(e) => setEditForm({...editForm, reasoning: e.target.value})}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Type:</p>
                    <select
                      className="w-full p-2 border rounded"
                      value={editForm.type}
                      onChange={(e) => setEditForm({...editForm, type: e.target.value})}
                    >
                      {categories.filter(cat => cat !== "All").map((category, index) => (
                        <option key={index} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(item._id)}
                      className="px-3 py-1 text-white bg-green-500 rounded-md hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1 text-white bg-gray-500 rounded-md hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <>
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
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="px-3 py-1 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeQuestion(item._id)}
                      className="px-3 py-1 text-white bg-red-500 rounded-md hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default List;
