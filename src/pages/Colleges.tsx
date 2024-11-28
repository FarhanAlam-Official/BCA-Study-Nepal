import React, { useState } from 'react';
import { Search, MapPin, Phone, Star } from 'lucide-react';
import { colleges } from '../data/colleges';

export default function Colleges() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredColleges = colleges.filter(college =>
    college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    college.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            BCA Colleges
          </h2>
        </div>
      </div>

      <div className="mt-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search colleges..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {filteredColleges.map((college) => (
          <div key={college.id} className="bg-white overflow-hidden shadow rounded-lg flex">
            <div className="flex-shrink-0 w-48">
              <img
                className="h-full w-full object-cover"
                src={college.image}
                alt={college.name}
              />
            </div>
            <div className="flex-1 px-6 py-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">{college.name}</h3>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm text-gray-600">{college.rating}</span>
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                {college.location}
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <Phone className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                {college.contact}
              </div>
              <div className="mt-4">
                <a
                  href="#"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                >
                  View Details
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}