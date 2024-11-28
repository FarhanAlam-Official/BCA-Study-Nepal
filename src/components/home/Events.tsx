import React from 'react';
import { Calendar, MapPin, Clock, ExternalLink } from 'lucide-react';
import { events } from '../../data/events';

export default function Events() {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
            Upcoming
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Events & Workshops
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Join our upcoming events to enhance your skills and network with professionals.
          </p>
        </div>

        <div className="mt-10">
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-indigo-600" />
                        <h3 className="ml-2 text-lg font-semibold text-gray-900">
                          {event.title}
                        </h3>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{event.description}</p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {event.type}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <span>{formatDate(event.date)} • {event.time}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  {event.speaker && (
                    <p className="mt-2 text-sm text-gray-500">
                      Speaker: {event.speaker}
                    </p>
                  )}

                  <div className="mt-4">
                    <button
                      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                        event.registration
                          ? 'bg-indigo-600 hover:bg-indigo-700'
                          : 'bg-gray-400 cursor-not-allowed'
                      }`}
                      disabled={!event.registration}
                    >
                      {event.registration ? (
                        <>
                          Register Now
                          <ExternalLink className="ml-2 -mr-1 h-4 w-4" />
                        </>
                      ) : (
                        'Registration Closed'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}