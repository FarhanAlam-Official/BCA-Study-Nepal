import { memo } from 'react';
import { Link } from 'react-router-dom';
import { SiFacebook, SiX as SiTwitter, SiLinkedin, SiMinutemailer, SiGithub, SiInstagram } from 'react-icons/si';
import { GraduationCap } from 'lucide-react';

// Expanded navigation with categories
const navigation = {
  solutions: [
    { name: 'Notes', href: '/notes' },
    { name: 'Past Papers', href: '/papers' },
    { name: 'Study Materials', href: '/materials' },
    { name: 'Tutorials', href: '/tutorials' },
  ],
  support: [
    { name: 'Colleges', href: '/colleges' },
    { name: 'Career', href: '/career' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Team', href: '/team' },
    { name: 'Privacy Policy', href: '/privacy' },
  ],
  social: [
    { name: 'Facebook', href: '#', icon: SiFacebook },
    { name: 'Twitter', href: '#', icon: SiTwitter },
    { name: 'LinkedIn', href: '#', icon: SiLinkedin },
    { name: 'Instagram', href: '#', icon: SiInstagram },
    { name: 'GitHub', href: '#', icon: SiGithub },
    { name: 'Email', href: '#', icon: SiMinutemailer },
  ],
};

interface FooterItem {
  name: string;
  href: string;
  icon?: React.ComponentType;
}

const FooterSection = memo(({ title, items }: { title: string; items: FooterItem[] }) => (
  <div className="lg:w-1/4 md:w-1/2 w-full px-4 mb-8 lg:mb-0">
    <h2 className="font-semibold text-gray-900 tracking-wider text-sm mb-3">
      {title}
    </h2>
    <ul className="list-none mb-4">
      {items.map((item) => (
        <li key={item.name} className="mb-2">
          <Link
            to={item.href}
            className="text-gray-600 hover:text-indigo-600 transition-colors duration-200 text-sm"
          >
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  </div>
));

export default function Footer() {
  return (
    <footer className="bg-gray-50">
      {/* Newsletter Section */}
      <div className="bg-indigo-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="px-6 py-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Stay Updated with PU Portal
              </h2>
              <p className="mt-4 text-lg text-indigo-100">
                Subscribe to our newsletter for the latest updates, study materials, and opportunities.
              </p>
              <div className="mt-6 flex max-w-md mx-auto gap-x-4">
                <input
                  type="email"
                  required
                  className="min-w-0 flex-auto rounded-md border-0 bg-white/10 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-white/75 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6"
                  placeholder="Enter your email"
                />
                <button
                  type="submit"
                  className="flex-none rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="flex flex-wrap -mx-4">
          {/* Logo Section */}
          <div className="lg:w-1/4 md:w-1/2 w-full px-4 mb-8 lg:mb-0">
            <div className="flex items-center">
              <GraduationCap className="h-10 w-10 text-indigo-600" />
              <span className="ml-3 text-xl font-bold text-gray-900">PU Portal</span>
            </div>
            <p className="mt-4 text-sm text-gray-600 pr-4">
              Your comprehensive resource for BCA studies at Pokhara University. Excellence in education, guidance for the future.
            </p>
          </div>

          {/* Navigation Sections */}
          <FooterSection title="RESOURCES" items={navigation.solutions} />
          <FooterSection title="SUPPORT" items={navigation.support} />
          <FooterSection title="COMPANY" items={navigation.company} />
        </div>

        {/* Social Links & Copyright */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-4 md:mb-0">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-indigo-600 transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))}
            </div>
            <p className="text-base text-gray-400">
              &copy; {new Date().getFullYear()} PU Portal. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
