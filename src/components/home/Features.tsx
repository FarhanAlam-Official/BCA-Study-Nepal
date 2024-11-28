import React from 'react';
import { BookOpen, GraduationCap, School, BriefcaseIcon } from 'lucide-react';

const features = [
  {
    name: 'Comprehensive Notes',
    description: 'Access detailed notes for all BCA subjects, organized semester-wise.',
    icon: BookOpen,
  },
  {
    name: 'Updated Syllabus',
    description: 'Stay current with the latest Pokhara University BCA curriculum.',
    icon: GraduationCap,
  },
  {
    name: 'College Directory',
    description: 'Explore affiliated colleges with detailed information and reviews.',
    icon: School,
  },
  {
    name: 'Career Guidance',
    description: 'Discover career opportunities and guidance for BCA graduates.',
    icon: BriefcaseIcon,
  },
];

export default function Features() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need for your BCA journey
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Access all the resources you need to excel in your BCA program at Pokhara University.
          </p>
        </div>

        <div className="mt-10">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                <p className="mt-2 ml-16 text-base text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}