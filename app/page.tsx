// pages/index.tsx
import React from 'react';
import Link from 'next/link';
import { NextPage } from 'next';

const HomePage: NextPage = () => {
  return (
    <div style={styles.container}>
      <h1>👋 Welcome to the App!</h1>
      <p>Please choose an option to continue your journey.</p>

      <div style={styles.buttonGroup}>
        {/* Button 1: Sign In (Routes to /login-form) */}
        <Link href="/login" passHref legacyBehavior>
          <button style={styles.signInButton}>
            Sign In
          </button>
        </Link>

        {/* Button 2: Sign Up (Routes to /signup-form) */}
        <Link href="/signup" passHref legacyBehavior>
          <button style={styles.signUpButton}>
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  );
};

// --- Basic Inline Styling ---
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    backgroundColor: '#f4f4f9',
    color: '#333',
    textAlign: 'center',
    padding: '20px',
  },
  buttonGroup: {
    marginTop: '20px',
  },
  signInButton: {
    padding: '12px 25px',
    margin: '10px',
    fontSize: '17px',
    cursor: 'pointer',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#0070f3', // Next.js Blue
    color: 'white',
    boxShadow: '0 4px 6px rgba(0, 112, 243, 0.3)',
    transition: 'background-color 0.2s, transform 0.2s',
  },
  signUpButton: {
    padding: '12px 25px',
    margin: '10px',
    fontSize: '17px',
    cursor: 'pointer',
    borderRadius: '8px',
    border: '1px solid #0070f3',
    backgroundColor: 'white',
    color: '#0070f3',
    transition: 'background-color 0.2s, color 0.2s',
  },
};

export default HomePage;