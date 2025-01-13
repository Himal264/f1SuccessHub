import React from "react";
import { MapPin } from "lucide-react";

const LocationSection = ({ university }) => {
  const defaultLocation = {
    locationPhoto: "/api/placeholder/600/400",
    totalPopulation: 0,
    weather: { summer: "Unknown", winter: "Unknown" },
    keyIndustries: [],
    travelTime: [],
  };

  const location = university?.location || defaultLocation;
  console.log("University prop:", university);
console.log("Location Photo:", university?.location?.locationPhoto);


  return (
    <section id="location" className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-6">
          <MapPin className="w-6 h-6 text-blue-900" />
          <h2 className="text-2xl font-bold text-blue-900">Location</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <img
              src={location.locationPhoto || "/path-to-your-default-image.jpg"}
              alt="City View"
              className="w-full h-64 object-cover rounded-lg mb-6"
            />

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-medium mb-2">Population</h3>
                <p className="text-2xl font-bold text-blue-900">
                  {location.totalPopulation.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-4">Weather</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600">Summer</p>
                  <p className="font-medium">{location.weather.summer}</p>
                </div>
                <div>
                  <p className="text-gray-600">Winter</p>
                  <p className="font-medium">{location.weather.winter}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-4">Key Industries</h3>
              <div className="flex flex-wrap gap-2">
                {location.keyIndustries.map((industry) => (
                  <span
                    key={industry}
                    className="bg-blue-100 text-blue-900 px-3 py-1 rounded-full"
                  >
                    {industry}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-4">Nearby Cities</h3>
              <div className="space-y-3">
                {location.travelTime.map((city) => (
                  <div key={city.city} className="flex justify-between">
                    <span>{city.city}</span>
                    <span className="text-gray-600">{city.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
