'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Music, Youtube, Disc, AlertTriangle, LogOut, Loader2, CheckCircle2, ExternalLink } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

// --- Link Validation Logic ---
const YOUTUBE_REGEX = /^(https?:\/\/(?:www\.|m\.)?youtube\.com\/watch\?v=|youtu\.be\/|music\.youtube\.com\/).*$/i;

/**
 * Checks if a URL is a valid YouTube link.
 */
const isValidYouTubeUrl = (url: string): boolean => {
  if (!url || url.length < 5) return false;
  return YOUTUBE_REGEX.test(url.trim());
};

interface ComparisonResult {
  matched_song: string;
  matched_url: string;
  similarity: number;
  uploaded_bpm?: number;
  uploaded_key?: string;
}

export default function MusicSearchHomePage() {
  const [linkInput, setLinkInput] = useState('');
  const [user, setUser] = useState<{ id: string; email?: string; name?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Get user from Supabase
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user: authUser }, error }) => {
      if (error || !authUser) {
        router.push('/login');
        return;
      }
      setUser({
        id: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User'
      });
    });
  }, [router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('Please log in to continue');
      return;
    }

    const trimmedUrl = linkInput.trim();
    if (!trimmedUrl) {
      setError('Please enter a YouTube URL');
      return;
    }

    if (!isValidYouTubeUrl(trimmedUrl)) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Get Python backend URL from environment variable or use default
      const backendUrl = process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL || 'http://localhost:8000';
      
      const response = await fetch(`${backendUrl}/music/compare`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_uid: user.id,
          youtube_url: trimmedUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: `Server error: ${response.status} ${response.statusText}` }));
        throw new Error(errorData.detail || `Error: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('Cannot connect to the server. Please make sure the Python backend is running on ' + (process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL || 'http://localhost:8000'));
      } else {
        setError(err instanceof Error ? err.message : 'Failed to process song. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderResult = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4 p-6">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-gray-600 font-medium">Processing your song... This may take a moment.</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-300 text-red-700 rounded-lg">
            <AlertTriangle className="w-6 h-6 shrink-0" />
          <p className="font-semibold">{error}</p>
        </div>
      );
    }

    if (result) {
      const similarityPercent = (result.similarity * 100).toFixed(1);
      return (
        <div className="p-6 bg-green-50 border border-green-300 rounded-lg space-y-4">
          <div className="flex items-center space-x-2 text-green-700">
            <CheckCircle2 className="w-6 h-6" />
            <h3 className="font-bold text-lg">Match Found!</h3>
          </div>
          <div className="space-y-2 text-left">
            <div>
              <p className="text-sm text-gray-600">Matched Song:</p>
              <p className="font-semibold text-gray-900">{result.matched_song}</p>
            </div>
            <div className="flex items-center space-x-2">
              <a
                href={result.matched_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-medium"
              >
                <span>Listen on YouTube</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <div className="pt-2 border-t border-green-200">
              <p className="text-sm text-gray-600">
                Similarity: <span className="font-semibold text-gray-900">{similarityPercent}%</span>
              </p>
              {result.uploaded_bpm && (
                <p className="text-sm text-gray-600">
                  Detected BPM: <span className="font-semibold text-gray-900">{result.uploaded_bpm}</span>
                </p>
              )}
              {result.uploaded_key && (
                <p className="text-sm text-gray-600">
                  Detected Key: <span className="font-semibold text-gray-900">{result.uploaded_key}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (linkInput.trim() === '') {
      return (
        <p className="text-gray-500 text-lg">
          Paste a YouTube URL above to find similar songs.
        </p>
      );
    }

    if (!isValidYouTubeUrl(linkInput.trim())) {
      return (
        <div className="flex items-center space-x-2 p-4 bg-yellow-50 border border-yellow-300 text-yellow-700 rounded-lg">
          <AlertTriangle className="w-6 h-6" />
          <p className="font-semibold">
            Please enter a valid YouTube URL (youtube.com/watch?v=... or youtu.be/...)
          </p>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-2 p-4 bg-blue-50 border border-blue-300 text-blue-700 rounded-lg">
        <Youtube className="w-6 h-6" />
        <p className="font-semibold">
          Valid YouTube URL. Click "Find Similar Song" to process.
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="w-full bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          
          {/* Logo/Name */}
          <div className="flex items-center space-x-2 text-2xl font-bold text-blue-600">
            <Music className="w-7 h-7" />
            <span>MusicSearch</span>
          </div>

          {/* User Profile and Logout Button */}
          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex flex-col text-right leading-tight">
                <span className="text-sm font-semibold text-gray-800">{user.name}</span>
                {user.email && (
                  <span className="text-xs text-gray-500">{user.email}</span>
                )}
              </div>
            )}
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="grow flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-2xl text-center">
          <Search className="w-12 h-12 mx-auto mb-4 text-blue-600" />
          <h2 className="text-3xl font-extrabold mb-2 text-gray-900">
            Find Similar Songs
          </h2>
          <p className="text-gray-600 mb-8">
            Paste a YouTube URL below to find the most similar song in our database.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="mb-4 relative">
              <input
                type="url"
                placeholder="Paste YouTube URL here (e.g., youtube.com/watch?v=... or youtu.be/...)"
                value={linkInput}
                onChange={(e) => {
                  setLinkInput(e.target.value);
                  setError(null);
                  setResult(null);
                }}
                disabled={loading}
                className="w-full p-4 pl-12 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <Music className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <button
              type="submit"
              disabled={loading || !isValidYouTubeUrl(linkInput.trim()) || !user}
              className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Find Similar Song</span>
                </>
              )}
            </button>
          </form>

          {/* Result Display */}
          <div className="min-h-[100px] flex items-center justify-center">
            {renderResult()}
          </div>
          
        </div>
      </main>
    </div>
  );
}