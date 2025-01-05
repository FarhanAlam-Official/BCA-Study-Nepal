import GlowingBackground from './GlowingBackground';
import HeroContent from './HeroContent';

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-white">
      <GlowingBackground />
      
      {/* Animated dots */}
      <div className="absolute inset-0">
        <div className="absolute h-2 w-2 bg-indigo-400 rounded-full animate-ping" style={{ top: '20%', left: '10%' }} />
        <div className="absolute h-2 w-2 bg-purple-400 rounded-full animate-ping" style={{ top: '60%', right: '10%' }} />
        <div className="absolute h-2 w-2 bg-pink-400 rounded-full animate-ping" style={{ top: '80%', left: '50%' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <HeroContent />
      </div>
    </div>
  );
}