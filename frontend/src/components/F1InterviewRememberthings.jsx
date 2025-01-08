import React from 'react';

const F1InterviewRememberthings = () => {
  const tips = [
    {
      id: 1,
      question: "What documents should you carry?",
    },
    {
      id: 2,
      question: "Why is it important to practice your answers?",
    },
    {
      id: 3,
      question: "What should you focus on during the interview?",
    },
    {
      id: 4,
      question: "How should you prepare on the interview day?",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-lg font-semibold mb-6">Things to Remember for Your F1 Visa Interview</h2>
      <ul className="space-y-4">
        {tips.map((tip) => (
          <li
            key={tip.id}
            className="p-4 border rounded-md shadow-md bg-white flex items-start"
          >
            <span className="mr-4 font-bold text-blue-600">{tip.id}.</span>
            <p className="text-sm text-gray-800">{tip.question}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default F1InterviewRememberthings;
