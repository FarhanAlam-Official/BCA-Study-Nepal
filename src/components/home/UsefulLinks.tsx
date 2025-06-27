import { ExternalLink, BookOpen, GraduationCap, Book, Briefcase, LucideIcon } from 'lucide-react';

/**
 * Link item interface
 * @interface Link
 * @property {string} title - The title of the resource
 * @property {string} description - Brief description of the resource
 * @property {string} url - URL to the external resource
 * @property {LucideIcon} icon - Lucide icon component for the resource
 */
interface Link {
  title: string;
  description: string;
  url: string;
  icon: LucideIcon;
}

/**
 * Array of useful external resources
 * Each link includes title, description, URL, and an associated icon
 */
const links: Link[] = [
  {
    title: 'Pokhara University',
    description: 'Official website for course information and updates',
    url: 'https://pu.edu.np',
    icon: GraduationCap,
  },
  {
    title: 'Exam Results Portal',
    description: 'Check your semester results and announcements',
    url: 'https://exam.pu.edu.np',
    icon: BookOpen,
  },
  {
    title: 'Online Libraries',
    description: 'Access to JSTOR and Nepal Journals Online',
    url: 'https://njol.info',
    icon: Book,
  },
  {
    title: 'Internship Opportunities',
    description: 'Find internships on Internshala and LinkedIn',
    url: 'https://internshala.com',
    icon: Briefcase,
  },
];

/**
 * UsefulLinks Component
 * 
 * Displays a grid of external resource links relevant for BCA students.
 * Each link is presented as a card with an icon, title, description, and external link.
 * 
 * Visual Elements:
 * - Section header with accent color
 * - Resource cards with hover effects
 * - Consistent icon styling
 * - External link indicators
 * 
 * Layout Features:
 * - Responsive grid layout (1 column on mobile, 2 on tablet, 4 on desktop)
 * - Card-based design with shadows
 * - Hover interactions for better UX
 * - Proper spacing and alignment
 * 
 * Security Features:
 * - External links open in new tabs
 * - Proper rel attributes for security
 * 
 * @component
 */
export default function UsefulLinks() {
  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
            Resources
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Useful Links
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Quick access to important resources and platforms for BCA students.
          </p>
        </div>

        {/* Resource Cards Grid */}
        <div className="mt-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {links.map((link, index) => (
              <div
                key={index}
                className="relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                {/* Card Header with Icon */}
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <link.icon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {link.title}
                    </h3>
                  </div>
                </div>

                {/* Resource Description */}
                <p className="mt-2 text-base text-gray-500">
                  {link.description}
                </p>

                {/* External Link */}
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Visit Website
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
