import { memo, useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  ExternalLink,
  Facebook,
  Twitter,
  Linkedin,
  Github,
  Instagram,
  Mail,
  ArrowUp,
} from 'lucide-react';

/**
 * Navigation configuration object containing all footer links
 * Organized into different sections: resources, support, tools, and social
 */
const navigation = {
  resources: [
    { name: 'Notes', href: '/notes' },
    { name: 'Question Papers', href: '/question-papers' },
    { name: 'Syllabus', href: '/syllabus' },
    { name: 'Resource Radar', href: '/resource-radar' },
  ],
  support: [
    { name: 'Colleges', href: '/colleges' },
    { name: 'Career', href: '/career' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' },
  ],
  tools: [
    { name: 'GPA Calculator', href: '/tools/gpa-calculator' },
    { name: 'Pomodoro Timer', href: '/tools/pomodoro' },
    { name: 'Todo List', href: '/tools/todo' },
  ],
  social: [
    {
      name: 'Facebook',
      href: 'https://facebook.com/puportal',
      icon: Facebook,
      color: '#1877F2',
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/puportal',
      icon: Twitter,
      color: '#1DA1F2',
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/company/puportal',
      icon: Linkedin,
      color: '#0A66C2',
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com/puportal',
      icon: Instagram,
      color: '#E4405F',
    },
    {
      name: 'GitHub',
      href: 'https://github.com/FarhanAlam-Official/bca-study-nepal',
      icon: Github,
      color: '#181717',
    },
    {
      name: 'Email',
      href: 'mailto:thefarhanalam01@gmail.com',
      icon: Mail,
      color: '#EA4335',
    },
  ],
};

/**
 * Interface defining the structure of a footer navigation item
 */
interface FooterItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string; size?: number }>;
  color?: string;
}

/**
 * FooterSection Component
 * Renders a section of footer links with a title and underline animation
 */
const FooterSection = memo(({ title, items }: { title: string; items: FooterItem[] }) => {
  return (
    <div>
      <h2 className="font-semibold text-white/90 tracking-wider text-sm mb-4 relative inline-block group">
        {title}
        <div className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 rounded-full shadow-md shadow-white/10" />
      </h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.name}>
            <Link
              to={item.href}
              className="text-white/80 hover:text-white text-sm relative inline-flex items-center group"
            >
              <span className="relative inline-block transform transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105">
                {item.name}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 group-hover:w-full transition-all duration-300 ease-out" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
});

/**
 * Animation keyframes for particle effects
 * Defines three types of animations:
 * 1. float - Particles that move up with side-to-side motion
 * 2. rise - Particles that rise straight up from bottom to top
 * 3. blink - Particles that pulse and fade in/out
 */
const styles = `
@keyframes float {
  0% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0.3;
  }
  25% {
    transform: translateY(-50px) translateX(15px) scale(1.1);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-100px) translateX(-15px) scale(1);
    opacity: 0.8;
  }
  75% {
    transform: translateY(-150px) translateX(10px) scale(0.9);
    opacity: 0.4;
  }
  100% {
    transform: translateY(-200px) translateX(0) scale(1);
    opacity: 0;
  }
}

@keyframes rise {
  0% {
    transform: translateY(0) scale(0.5);
    opacity: 0;
  }
  20% {
    transform: translateY(-20vh) scale(1);
    opacity: 0.8;
  }
  40% {
    transform: translateY(-40vh) scale(1.1);
    opacity: 0.9;
  }
  60% {
    transform: translateY(-60vh) scale(1);
    opacity: 0.7;
  }
  80% {
    transform: translateY(-80vh) scale(0.9);
    opacity: 0.3;
  }
  100% {
    transform: translateY(-100vh) scale(0.8);
    opacity: 0;
  }
}

@keyframes blink {
  0% {
    opacity: 0.1;
    transform: scale(0.8) translateY(0);
  }
  25% {
    opacity: 0.8;
    transform: scale(1.2) translateY(-5px);
  }
  50% {
    opacity: 1;
    transform: scale(1.4) translateY(-10px);
  }
  75% {
    opacity: 0.8;
    transform: scale(1.2) translateY(-5px);
  }
  100% {
    opacity: 0.1;
    transform: scale(0.8) translateY(0);
  }
}

.animate-float {
  animation: float linear infinite;
}

.animate-rise {
  animation: rise linear infinite;
}

.animate-blink {
  animation: blink ease-in-out infinite;
}
`;

// Add animation styles to document head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

/**
 * Generates an array of particle objects with randomized properties
 * @param count Number of particles to generate
 * @param type Type of particle animation ("float", "rise", or "blink")
 * @returns Array of particle objects with position, size, and animation properties
 */
const generateParticles = (count: number, type: string) => {
  return Array.from({ length: count }).map((_, i) => {
    const isRising = type === "rise";
    const isFloating = type === "float";
    const size = isRising 
      ? Math.random() * 6 + 2 
      : isFloating 
        ? Math.random() * 8 + 2 
        : Math.random() * 4 + 1;
    
    const delay = isRising 
      ? Math.random() * 5 
      : isFloating 
        ? Math.random() * 8 
        : Math.random() * 4;
    
    const duration = isRising 
      ? Math.random() * 8 + 12
      : isFloating 
        ? Math.random() * 15 + 10 
        : Math.random() * 3 + 2;
    
    const startingPoint = isRising 
      ? 100 + (Math.random() * 20) // Start below the viewport
      : Math.random() * 100;

    return {
      id: `${type}-${i}`,
      left: `${Math.random() * 100}%`,
      top: `${startingPoint}%`,
      size: `${size}px`,
      opacity: isRising 
        ? 0 // Start invisible for rising particles
        : isFloating 
          ? Math.random() * 0.7 + 0.3 
          : Math.random() * 0.5 + 0.5,
      delay: `${delay}s`,
      duration: `${duration}s`,
      blur: isRising 
        ? '2px'
        : isFloating 
          ? '1.5px' 
          : '0.75px',
      brightness: isRising 
        ? 1.4
        : isFloating 
          ? 1.3 
          : 1.6,
      shadow: isRising
        ? '0 0 15px 5px rgba(255, 255, 255, 0.5)'
        : isFloating
          ? '0 0 10px 3px rgba(255, 255, 255, 0.4)'
          : '0 0 12px 4px rgba(255, 255, 255, 0.5)',
      animation: type
    };
  });
};

/**
 * ParticleBackground Component
 * Creates an animated background effect with multiple types of particles
 * Uses memoization to prevent unnecessary recalculations
 */
const ParticleBackground = memo(() => {
  // Generate different types of particles with specific counts
  const floatingParticles = useMemo(() => generateParticles(15, "float"), []);
  const blinkingParticles = useMemo(() => generateParticles(20, "blink"), []);
  const risingParticles = useMemo(() => generateParticles(10, "rise"), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-800/20 via-purple-800/20 to-indigo-800/20" />
      {[...floatingParticles, ...blinkingParticles, ...risingParticles].map((p) => (
        <div
          key={p.id}
          className={`particle absolute bg-white rounded-full animate-${p.animation}`}
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animationDelay: p.delay,
            animationDuration: p.duration,
            filter: `blur(${p.blur}) brightness(${p.brightness})`,
            boxShadow: p.shadow,
          }}
        />
      ))}
    </div>
  );
});

FooterSection.displayName = 'FooterSection';
ParticleBackground.displayName = 'ParticleBackground';

export default function Footer() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="relative" role="contentinfo" aria-label="Site footer">
      <div className="relative bg-gradient-to-r from-indigo-600/95 via-purple-700/95 to-indigo-600/95 py-12">
        <ParticleBackground />
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
            <div className="space-y-6 lg:pr-4">
              <div className="flex items-center group cursor-pointer" role="img" aria-label="BCA Study Nepal Logo">
                <div className="relative">
                  <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 opacity-75 group-hover:opacity-100 blur-lg transition-all duration-500 group-hover:duration-200 animate-tilt" />
                  <div className="relative flex items-center justify-center w-14 h-14 bg-white rounded-full ring-1 ring-white/30 group-hover:ring-2 group-hover:ring-white/50 transition-all duration-300">
                    <GraduationCap className="h-7 w-7 text-indigo-600 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                  </div>
                </div>
                <span className="ml-4 text-2xl font-bold text-white/90 group-hover:text-white transition-all duration-300">
                  BCA Study Nepal
                </span>
              </div>
              <p className="text-sm text-white/80 leading-relaxed max-w-sm">
                Your comprehensive resource for BCA studies at Pokhara University. Excellence in education, guidance for the future.
              </p>
            </div>
            <div className="lg:px-8"><FooterSection title="RESOURCES" items={navigation.resources} /></div>
            <div className="lg:px-8"><FooterSection title="SUPPORT" items={navigation.support} /></div>
            <div className="lg:px-8"><FooterSection title="TOOLS" items={navigation.tools} /></div>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

          <div className="pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex justify-center gap-6">
                {navigation.social.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className="group relative p-3 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-300 ring-1 ring-white/10 hover:ring-white/20 hover:scale-110 hover:-translate-y-1"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ '--hover-color': item.color } as React.CSSProperties}
                      aria-label={`Visit our ${item.name} page`}
                    >
                      <span className="sr-only">{item.name}</span>
                      <IconComponent
                        size={22}
                        className="text-white/80 transition-all duration-300 group-hover:text-white group-hover:[color:var(--hover-color)]"
                      />
                    </a>
                  );
                })}
              </div>
              <div className="text-sm text-white/80 text-center md:text-right">
                <p>&copy; {new Date().getFullYear()} BCA Study Nepal. All rights reserved.</p>
                <p className="text-white/70 flex items-center gap-2 justify-center md:justify-end mt-3">
                  Made with <span className="inline-block text-red-400/90 animate-pulse">❤️</span> by
                  <a
                    href="https://github.com/FarhanAlam-Official"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-white transition-colors duration-300 flex items-center gap-1 group"
                    aria-label="Visit Farhan Alam's GitHub profile"
                  >
                    Farhan Alam
                    <ExternalLink className="w-3.5 h-3.5 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300" />
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showBackToTop && (
        <button
          className="fixed bottom-6 right-6 z-50 bg-indigo-700 hover:bg-indigo-800 text-white p-2 rounded-full shadow-lg ring-1 ring-white/10 transition-all duration-300 animate-fade-in"
          onClick={scrollToTop}
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </footer>
  );
}
