import React, { useState, useEffect } from 'react';

const CountUp = ({ end, duration = 6000, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [end, duration]);

  return (
    <span className="text-4xl font-bold">
      {count.toLocaleString()}{suffix}
    </span>
  );
};

const StatsSection = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-2">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <div className="text-xl uppercase tracking-wider text-gray-600 mb-4">
            Trusted Experts
          </div>
          
          <div className="bg-gray-500 rounded-full p-8 shadow-lg inline-block">
            <h1 className="text-3xl font-serif text-white">
              Driving Student<br />Success
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <CountUp end={500000} suffix="+" />
            <p className="text-base sm:text-xl md:text-2xl text-gray-600 mt-2">
              applications processed
            </p>
          </div>
          
          <div className="p-6">
            <div className="flex items-center justify-center gap-1">
              <CountUp end={500} suffix="+" />
            </div>
            <p className="text-base sm:text-xl md:text-2xl text-gray-600 mt-2">
              employees across <CountUp end={25} /> countries
            </p>
          </div>
          
          <div className="p-6">
            <CountUp end={31000} suffix="+" />
            <p className="text-base sm:text-xl md:text-2xl text-gray-600 mt-2">
              students enrolled
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;