import React from 'react';
import { Briefcase, GraduationCap, Award, MapPin, Clock, Code } from 'lucide-react';
import { careerData } from '../data/career';

export default function Career() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Career Options for BCA Graduates
        </h1>
        <p className="mt-4 text-xl text-gray-500">
          Explore various career paths and opportunities available after BCA
        </p>
      </div>

      {/* Higher Education Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
          <GraduationCap className="h-6 w-6 mr-2 text-indigo-600" />
          Higher Education Opportunities
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Nepal Education */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-indigo-600" />
              Study in Nepal
            </h3>
            <div className="space-y-4">
              {careerData.higherEducation.nepal.map((course, index) => (
                <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                  <h4 className="font-medium text-gray-900">{course.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {course.duration}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Abroad Education */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-indigo-600" />
              Study Abroad
            </h3>
            <div className="space-y-4">
              {careerData.higherEducation.abroad.map((course, index) => (
                <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                  <h4 className="font-medium text-gray-900">{course.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {course.duration}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Job Roles Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
          <Briefcase className="h-6 w-6 mr-2 text-indigo-600" />
          Job Opportunities
        </h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {careerData.jobRoles.map((role, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900">{role.title}</h3>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-1" />
                {role.location}
              </div>
              <p className="mt-2 text-sm text-gray-600">{role.description}</p>
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Required Skills:</h4>
                <div className="flex flex-wrap gap-2">
                  {role.skills.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      <Code className="h-3 w-3 mr-1" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
          <Award className="h-6 w-6 mr-2 text-indigo-600" />
          Professional Certifications
        </h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {careerData.certifications.map((cert, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900">{cert.name}</h3>
              <div className="mt-2 space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Award className="h-4 w-4 mr-1" />
                  {cert.provider}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  {cert.duration}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}