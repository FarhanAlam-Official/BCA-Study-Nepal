import { memo } from 'react';
import { Link } from 'react-router-dom';
import { SiFacebook, SiX as SiTwitter, SiLinkedin, SiMinutemailer, SiGithub, SiInstagram } from 'react-icons/si';
import { GraduationCap } from 'lucide-react';

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
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
  ],
  social: [
    {
      name: 'Facebook',
      href: 'https://facebook.com/puportal',
      icon: SiFacebook,
      color: '#1877F2'
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/puportal',
      icon: SiTwitter,
      color: '#1DA1F2'
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/company/puportal',
      icon: SiLinkedin,
      color: '#0A66C2'
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com/puportal',
      icon: SiInstagram,
      color: '#E4405F'
    },
    {
      name: 'GitHub',
      href: 'https://github.com/puportal',
      icon: SiGithub,
      color: '#181717'
    },
    {
      name: 'Email',
      href: 'mailto:contact@puportal.edu.np',
      icon: SiMinutemailer,
      color: '#EA4335'
    },
  ],
};

interface FooterItem {
  name: string;
  href: string;
  icon?: React.ComponentType;
  color?: string;
}

const FooterSection = memo(({ title, items }: { title: string; items: FooterItem[] }) => (
  <div className="lg:w-1/4 md:w-1/2 w-full px-6">
    <h2 className="font-bold text-gray-900 tracking-wider text-sm mb-5 relative inline-block">
      {title}
      <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full" />
    </h2>
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.name}>
          <Link
            to={item.href}
            className="text-gray-600 hover:text-indigo-600 transition-all duration-300 relative group text-sm font-medium"
          >
            <span className="relative inline-block">
              {item.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  </div>
));

export default function Footer() {
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Add newsletter subscription logic here
    console.log('Newsletter subscription submitted');
  };

  return (
    <footer className="relative bg-gradient-to-b from-gray-50 to-white">
      {/* Newsletter Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-90" />
        <div className="relative max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="relative rounded-2xl bg-white/10 backdrop-blur-lg shadow-xl p-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Stay Updated with PU Portal
              </h2>
              <p className="mt-4 text-lg text-white/90">
                Subscribe to our newsletter for the latest updates, study materials, and opportunities.
              </p>
              <form onSubmit={handleSubscribe} className="mt-8 flex max-w-md mx-auto gap-x-4">
                <input
                  type="email"
                  required
                  className="min-w-0 flex-auto rounded-xl border-0 bg-white/10 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/20 placeholder:text-white/60 focus:ring-2 focus:ring-white sm:text-sm sm:leading-6 transition-all duration-300"
                  placeholder="Enter your email"
                />
                <button
                  type="submit"
                  className="flex-none rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-300 hover:scale-105"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="flex flex-wrap -mx-4">
          {/* Logo Section */}
          <div className="lg:w-1/4 md:w-1/2 w-full px-6 mb-8 lg:mb-0">
            <div className="flex items-center group">
              <div className="relative">
                <GraduationCap className="h-10 w-10 text-indigo-600 transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 bg-indigo-600/20 blur-lg rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                PU Portal
              </span>
            </div>
            <p className="mt-4 text-sm text-gray-600 leading-relaxed pr-4">
              Your comprehensive resource for BCA studies at Pokhara University. Excellence in education, guidance for the future.
            </p>
          </div>

          {/* Navigation Sections */}
          <FooterSection title="RESOURCES" items={navigation.solutions} />
          <FooterSection title="SUPPORT" items={navigation.support} />
          <FooterSection title="COMPANY" items={navigation.company} />
        </div>

        {/* Social Links & Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex gap-6">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="group relative"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ '--hover-color': item.color } as React.CSSProperties}
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon 
                    className="h-6 w-6 text-gray-400 transition-all duration-300 group-hover:scale-110 group-hover:[color:var(--hover-color)]"
                  />
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-medium text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.name}
                  </span>
                </a>
              ))}
            </div>
            <div className="flex flex-col items-center gap-2 text-sm text-gray-500">
              <p>&copy; {new Date().getFullYear()} PU Portal. All rights reserved.</p>
              <p className="text-gray-600">
                Made with <span className="text-red-500">❤️</span> by{' '}
                <a
                  href="https://github.com/FarhanAlam-Official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 transition-colors duration-300"
                >
                  Farhan Alam
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
