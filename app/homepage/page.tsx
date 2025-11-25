'use client';

import React, { useState, useMemo } from 'react';
import { Search, Music, Youtube, Disc, AlertTriangle, LogOut } from 'lucide-react'; // Added LogOut

// --- Link Validation Logic ---
// Regular expressions to check the link types
// Includes various formats like open.spotify.com, spotify: URI scheme, etc.
const SPOTIFY_REGEX = /^(https?:\/\/(?:open\.spotify\.com\/|spotify:)).*$/i;

// Includes youtube.com/watch?v=, youtu.be/, and music.youtube.com/
const YOUTUBE_REGEX = /^(https?:\/\/(?:www\.|m\.)?youtube\.com\/watch\?v=|youtu\.be\/|music\.youtube\.com\/).*$/i;

/**
 * Checks a URL string to determine if it is a supported music platform link.
 * @param url The link string from the user input.
 * @returns The platform name or 'Unknown'.
 */
const checkLinkType = (url: string): 'Spotify' | 'YouTube/YouTube Music' | 'Unknown' | null => {
  if (!url || url.length < 5) return null; // Ignore short or empty strings

  if (SPOTIFY_REGEX.test(url)) {
    return 'Spotify';
  }

  if (YOUTUBE_REGEX.test(url)) {
    return 'YouTube/YouTube Music';
  }

  return 'Unknown';
};

// --- Main Component ---

// Mock user data since this is a client component and cannot fetch user session easily
const mockUser = {
  name: "Music Lover",
  email: "user@musicsearch.com",
};

export default function MusicSearchHomePage() {
  const [linkInput, setLinkInput] = useState('');

  // Use useMemo to re-run the check only when linkInput changes
  const linkType = useMemo(() => checkLinkType(linkInput.trim()), [linkInput]);

  const renderResult = () => {
    if (linkInput.trim() === '') {
      return (
        <p className="text-gray-500 text-lg">
          Paste a link above to check if it is supported.
        </p>
      );
    }

    if (linkType === 'Spotify') {
      return (
        <div className="flex items-center space-x-2 p-4 bg-green-50 border border-green-300 text-green-700 rounded-lg">
          <Disc className="w-6 h-6" />
          <p className="font-semibold">
            Success! This is a **Spotify** link.
          </p>
        </div>
      );
    }

    if (linkType === 'YouTube/YouTube Music') {
      return (
        <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-300 text-red-700 rounded-lg">
          <Youtube className="w-6 h-6" />
          <p className="font-semibold">
            Success! This is a **YouTube / YouTube Music** link.
          </p>
        </div>
      );
    }

    if (linkType === 'Unknown') {
      return (
        <div className="flex items-center space-x-2 p-4 bg-yellow-50 border border-yellow-300 text-yellow-700 rounded-lg">
          <AlertTriangle className="w-6 h-6" />
          <p className="font-semibold">
            Unknown Link. Please use a link from Spotify, YouTube, or YouTube Music.
          </p>
        </div>
      );
    }

    return null;
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
            <div className="flex flex-col text-right leading-tight">
                <span className="text-sm font-semibold text-gray-800">{mockUser.name}</span>
                <span className="text-xs text-gray-500">{mockUser.email}</span>
            </div>
            <a href="/login" title="Logout">
              <button 
                className="flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition shadow-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-2xl text-center">
          <Search className="w-12 h-12 mx-auto mb-4 text-blue-600" />
          <h2 className="text-3xl font-extrabold mb-2 text-gray-900">
            Link Validator
          </h2>
          <p className="text-gray-600 mb-8">
            Enter a Spotify, YouTube, or YouTube Music link below to validate.
          </p>

          {/* Text Input Box */}
          <div className="mb-6 relative">
            <input
              type="url"
              placeholder="Paste your link here (e.g., spotify.com/... or youtube.com/...)"
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              className="w-full p-4 pl-12 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-lg transition"
            />
            <Music className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          {/* Validation Result Display */}
          <div className="min-h-[60px] flex items-center justify-center">
            {renderResult()}
          </div>
          
        </div>
      </main>
    </div>
  );
}