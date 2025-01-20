import React from "react";
import { MapPin } from "lucide-react";

const LocationSection = ({ university }) => {
  const defaultLocation = {
    name: "Unknown",
    state: "Unknown",
    region: "Unknown",
    totalPopulation: 0,
    citysize: "Unknown",
    nearbyCities: [],
    keyIndustries: [],
    landmarks: [],
    locationPhoto: "/api/placeholder/600/400",
    weather: { summer: "Unknown", winter: "Unknown" },
    travelTime: [],
  };

  const location = university?.location || defaultLocation;

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
              src={location.locationPhoto}
              alt={`${location.name} View`}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-medium mb-2">Population</h3>
                <p className="text-2xl font-bold text-blue-900">
                  {location.totalPopulation.toLocaleString()}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-medium mb-2">City Size</h3>
                <p className="text-blue-900 font-medium">{location.citysize}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg mb-6">
              <h3 className="font-medium mb-2">Region</h3>
              <p className="text-blue-900">{location.region}</p>
            </div>

            <div className="bg-white p-4 rounded-lg mb-6">
              <h3 className="font-medium mb-2">State</h3>
              <p className="text-blue-900">{location.state}</p>
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
                {location.keyIndustries.map((industry, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-900 px-3 py-1 rounded-full"
                  >
                    {industry}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-4">Nearby Cities</h3>
              <ul className="list-disc pl-5">
                {location.nearbyCities.map((city, index) => (
                  <li key={index} className="text-gray-600">{city}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-4">Landmarks</h3>
              <ul className="list-disc pl-5">
                {location.landmarks.map((landmark, index) => (
                  <li key={index} className="text-gray-600">{landmark}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-4">Travel Time to Nearby Cities</h3>
              <div className="space-y-3">
                {location.travelTime.map((cityInfo, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{cityInfo.city}</span>
                    <span className="text-gray-600">{cityInfo.time}</span>
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