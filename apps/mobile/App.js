import React from 'react';
import Navigation from './src/navigation/Navigation';
import './global.css';
import LoadingScreen from './src/components/LoadingScreen';
import { useState, useEffect } from 'react';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingScreen />;
  return <Navigation />;
}