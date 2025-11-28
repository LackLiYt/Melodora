"use client"
import { useEffect, useRef, useState } from 'react';
import { Music, Search, Download, Sparkles, Menu, X } from 'lucide-react';

function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollRef = useRef(0);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const now = Date.now();
      if (now - lastScrollRef.current < 800) return;

      if (e.deltaY > 0) {
        setCurrentSlide(prev => Math.min(prev + 1, 4));
      } else {
        setCurrentSlide(prev => Math.max(prev - 1, 0));
      }

      lastScrollRef.current = now;
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: currentSlide * window.innerHeight,
        behavior: 'smooth'
      });
    }
  }, [currentSlide]);

  return (
    <div className="relative bg-slate-950 text-white" ref={containerRef} style={{ height: '100vh', overflowY: 'hidden' }}>
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music className="w-6 h-6 text-sky-400" strokeWidth={1.5} />
            <span className="text-xl font-bold">NCS Finder</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => setCurrentSlide(0)} className="text-slate-300 hover:text-white transition-colors">
              Home
            </button>
            <button onClick={() => setCurrentSlide(1)} className="text-slate-300 hover:text-white transition-colors">
              How It Works
            </button>
            <button onClick={() => setCurrentSlide(2)} className="text-slate-300 hover:text-white transition-colors">
              Features
            </button>
            <button onClick={() => setCurrentSlide(3)} className="text-slate-300 hover:text-white transition-colors">
              About
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="hidden md:block px-4 py-2 text-sky-400 hover:text-sky-300 transition-colors font-medium"
            >
              Sign In
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-900/50">
            <div className="px-6 py-4 space-y-3">
              <button onClick={() => { setCurrentSlide(0); setMobileMenuOpen(false); }} className="block w-full text-left py-2 hover:text-sky-400 transition-colors">
                Home
              </button>
              <button onClick={() => { setCurrentSlide(1); setMobileMenuOpen(false); }} className="block w-full text-left py-2 hover:text-sky-400 transition-colors">
                How It Works
              </button>
              <button onClick={() => { setCurrentSlide(2); setMobileMenuOpen(false); }} className="block w-full text-left py-2 hover:text-sky-400 transition-colors">
                Features
              </button>
              <button onClick={() => { setCurrentSlide(3); setMobileMenuOpen(false); }} className="block w-full text-left py-2 hover:text-sky-400 transition-colors">
                About
              </button>

              <a
                href="/login"
                className="block w-full text-left py-2 text-sky-400 hover:text-sky-300 transition-colors"
              >
                Sign In
              </a>
            </div>
          </div>
        )}
      </header>

      <div className="relative w-full" style={{ height: '500vh' }}>
        {/* SLIDE 0 */}
        <section className="fixed inset-0 flex flex-col justify-center items-center overflow-hidden px-6 pt-20"
          style={{ transform: `translateY(${-currentSlide * 100}%)`, transition: 'transform 0.8s ease-out' }}>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              background: 'radial-gradient(circle at 50% 50%, #0ea5e9 0%, transparent 50%)',
            }} />
          </div>

          <div className="relative z-10 text-center max-w-4xl">
            <div className="flex justify-center mb-6 animate-in fade-in duration-700">
              <Music className="w-16 h-16 text-sky-400" strokeWidth={1.5} />
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent animate-in fade-in duration-700 delay-100">
              NCS Song Finder
            </h1>

            <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed max-w-2xl animate-in fade-in duration-700 delay-200">
              Instantly identify and discover copyright-free NCS music from any link. Whether you found it on YouTube, SoundCloud, or anywhere else, we'll help you find the perfect track details in seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in duration-700 delay-300">
              <a
                href="/signup"
                className="px-8 py-4 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-sky-500/50"
              >
                Try it Now
              </a>
            </div>

            <div className="mt-16 pt-16 space-y-4 text-slate-400 text-sm max-w-2xl">
              <p>✓ Fast and accurate song identification</p>
              <p>✓ Support for all major platforms</p>
              <p>✓ Complete track information at your fingertips</p>
            </div>
          </div>
        </section>

        {/* SLIDE 1 */}
        <section className="fixed inset-0 flex items-center justify-center overflow-hidden px-6 pt-20"
          style={{ transform: `translateY(${(1 - currentSlide) * 100}%)`, transition: 'transform 0.8s ease-out' }}>
          <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500/10 border border-sky-500/20 rounded-full text-sky-400 text-sm">
                <Search className="w-4 h-4" />
                <span>Smart Detection</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold leading-tight">How It Works</h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-sky-500/20 text-sky-400 font-semibold">
                      1
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Paste Your Link</h3>
                    <p className="text-slate-400">Share any link containing NCS music - YouTube, SoundCloud, TikTok, or anywhere else</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-sky-500/20 text-sky-400 font-semibold">
                      2
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Instant Analysis</h3>
                    <p className="text-slate-400">Our AI-powered system analyzes the audio and searches through our extensive NCS database</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-sky-500/20 text-sky-400 font-semibold">
                      3
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Get Full Details</h3>
                    <p className="text-slate-400">Receive complete information: artist, title, release date, genre, and direct download links</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative hidden md:block">
              <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-8 shadow-2xl">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-slate-800/50 rounded-lg p-4">
                    <Search className="w-5 h-5 text-slate-500" />
                    <input
                      type="text"
                      placeholder="https://youtube.com/watch?v=..."
                      className="bg-transparent flex-1 outline-none text-slate-300 text-sm"
                      disabled
                    />
                  </div>

                  <div className="bg-gradient-to-br from-sky-500/20 to-blue-500/20 border border-sky-500/30 rounded-lg p-6 space-y-3">
                    <div className="flex items-center gap-3">
                      <Music className="w-10 h-10 text-sky-400" />
                      <div className="flex-1">
                        <div className="h-4 bg-slate-700/50 rounded w-3/4 mb-2" />
                        <div className="h-3 bg-slate-700/30 rounded w-1/2" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 2 */}
        <section className="fixed inset-0 flex items-center justify-center overflow-hidden px-6 pt-20 bg-gradient-to-b from-slate-950 to-slate-900"
          style={{ transform: `translateY(${(2 - currentSlide) * 100}%)`, transition: 'transform 0.8s ease-out' }}>
          <div className="max-w-6xl w-full">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
              <p className="text-xl text-slate-400">Everything you need to manage and discover NCS music</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Search,
                  title: 'Universal Search',
                  description: 'Support for all major platforms including YouTube, SoundCloud, Spotify, TikTok, Instagram, and more. Works with any audio source.'
                },
                {
                  icon: Download,
                  title: 'Complete Information',
                  description: 'Get artist name, track title, release date, genre classification, mood tags, and direct download links for each song.'
                },
                {
                  icon: Sparkles,
                  title: 'Smart Matching',
                  description: 'Our advanced algorithm ensures accurate results with 99% accuracy, even with poor audio quality or partial songs.'
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-8 hover:border-sky-500/50 transition-all hover:shadow-lg hover:shadow-sky-500/10"
                >
                  <div className="w-14 h-14 rounded-lg bg-sky-500/10 flex items-center justify-center mb-6">
                    <feature.icon className="w-7 h-7 text-sky-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-16 bg-sky-500/5 border border-sky-500/20 rounded-xl p-8">
              <div className="flex items-center gap-4">
                <Sparkles className="w-8 h-8 text-sky-400 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Save Your Searches</h3>
                  <p className="text-slate-400">Keep a history of all your song discoveries and create playlists of your favorite NCS tracks</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 3 */}
        <section className="fixed inset-0 flex items-center justify-center overflow-hidden px-6 pt-20"
          style={{ transform: `translateY(${(3 - currentSlide) * 100}%)`, transition: 'transform 0.8s ease-out' }}>
          <div className="max-w-4xl w-full">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              About NCS Song Finder
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold mb-3 text-sky-400">Our Mission</h3>
                <p className="text-lg text-slate-300 leading-relaxed">
                  We're dedicated to making it easy for content creators, producers, and music enthusiasts to discover and identify NCS (No Copyright Sounds) music.
                  Our platform eliminates the frustration of finding that perfect copyright-free track you
                  heard somewhere.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-3 text-sky-400">Why NCS?</h3>
                <p className="text-lg text-slate-300 leading-relaxed">
                  NCS is the world's largest collection of free, copyright-free music. With over 1,000 tracks spanning multiple genres and moods,
                  it's the go-to resource for creators who need quality music without licensing concerns. Our tool makes accessing this incredible library even easier.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-3 text-sky-400">Completely Free</h3>
                <p className="text-lg text-slate-300 leading-relaxed">
                  No subscriptions. No hidden fees. No credit card required. Our service is completely free and will always remain free.
                  We believe everyone should have easy access to identifying the music they love.
                </p>
              </div>

              <div className="pt-8">
                <a
                  href="/signup"
                  className="px-12 py-5 bg-sky-500 hover:bg-sky-600 text-white text-lg font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-sky-500/50"
                >
                  Start Your Journey
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 4 */}
        <section className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden px-6 pt-20"
          style={{ transform: `translateY(${(4 - currentSlide) * 100}%)`, transition: 'transform 0.8s ease-out' }}>
          <div className="max-w-3xl text-center space-y-8 w-full">
            <h2 className="text-4xl md:text-6xl font-bold">
              Ready to Find Your Next Track?
            </h2>

            <p className="text-xl text-slate-400 leading-relaxed">
              Join thousands of creators who are discovering their favorite NCS music with just a single link.
              Whether you're a YouTuber, streamer, producer, or just a music lover, we've got you covered.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/signup"
                className="px-12 py-5 bg-sky-500 hover:bg-sky-600 text-white text-lg font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-sky-500/50"
              >
                Get Started Free
              </a>

              <a
                href="/login"
                className="px-12 py-5 bg-slate-800 hover:bg-slate-700 text-white text-lg font-semibold rounded-lg transition-all transform hover:scale-105 border border-slate-700"
              >
                Sign In
              </a>
            </div>

            <p className="text-slate-500">
              No credit card required • 100% free forever
            </p>

            <div className="pt-12 mt-12 border-t border-slate-800">
              <p className="text-sm text-slate-500">
                © 2025 NCS Song Finder. All rights reserved.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom slide selector */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 flex gap-2">
        {[0, 1, 2, 3, 4].map((slide) => (
          <button
            key={slide}
            onClick={() => setCurrentSlide(slide)}
            className={`w-3 h-3 rounded-full transition-all ${currentSlide === slide ? 'bg-sky-400 w-8' : 'bg-slate-600 hover:bg-slate-500'}`}
          />
        ))}
      </div>
    </div>
  );
}

export default LandingPage;
