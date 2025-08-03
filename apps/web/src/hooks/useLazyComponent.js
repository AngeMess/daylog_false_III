import { useState, useEffect } from 'react';

const useLazyComponent = (importFn, retries = 3, delay = 1000) => {
  const [Component, setComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;

    const loadComponent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const module = await importFn();
        
        if (isMounted) {
          setComponent(() => module.default || module);
          setLoading(false);
        }
      } catch (err) {
        console.warn(`Failed to load component (attempt ${retryCount + 1}):`, err);
        
        if (retryCount < retries - 1) {
          retryCount++;
          setTimeout(loadComponent, delay * retryCount);
        } else {
          if (isMounted) {
            setError(err);
            setLoading(false);
          }
        }
      }
    };

    loadComponent();

    return () => {
      isMounted = false;
    };
  }, [importFn, retries, delay]);

  return { Component, loading, error };
};

export default useLazyComponent; 