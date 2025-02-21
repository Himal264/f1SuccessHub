import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import Footer from './Footer';
import SuccessMatters from './SuccessMatters';
import StickyAdvisorNote from './StickyAdvisorNote';
import Hero from './Hero';

const F1QuestionAndPerAnswer = ({ token }) => {
  const { type } = useParams(); // Get the question type from URL
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Decode and format the type for display
  const formattedType = type ? type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'All';

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/api/question/list`, {
          headers: { token },
        });

        if (response.data.success) {
          let filteredQuestions = response.data.questions;
          
          // Filter questions if a specific type is selected
          if (type && type !== 'all') {
            filteredQuestions = response.data.questions.filter(
              question => question.type.toLowerCase() === formattedType.toLowerCase()
            );
          }

          setQuestions(filteredQuestions);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [type, token]);

  return (
    <>
      <Hero />
      <div className="relative flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto px-4 pb-20 lg:pb-4">
        <div className="flex-1">
          {/* Type Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {formattedType} Questions
            </h1>
            <p className="text-gray-600">
              Find answers to your {formattedType.toLowerCase()} related questions
            </p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F37021]"></div>
            </div>
          ) : (
            /* Questions List */
            <div className="flex flex-col gap-6">
              {questions.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-600">No questions found for this category.</p>
                </div>
              ) : (
                questions.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
                  >
                    {/* Question Number Badge */}
                    <div className="bg-[#F37021] text-white px-4 py-2 inline-block rounded-br-lg">
                      Question {index + 1}
                    </div>

                    {/* Question Content */}
                    <div className="p-6">
                      <div className="mb-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Question:</h3>
                        <p className="text-gray-700">{item.question}</p>
                      </div>

                      <div className="mb-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Answer:</h3>
                        <p className="text-gray-700">{item.answer}</p>
                      </div>

                      <div className="mb-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Reasoning:</h3>
                        <p className="text-gray-700">{item.reasoning}</p>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                          {item.type}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/3">
          <StickyAdvisorNote />
        </div>
      </div>

      {/* Footer Components */}
      <div className="mt-6">
        <SuccessMatters />
        <Footer />
      </div>
    </>
  );
};

export default F1QuestionAndPerAnswer;