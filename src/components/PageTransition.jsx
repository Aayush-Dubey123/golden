import React from 'react';
import { useLocation } from 'react-router-dom';

/**
 * PageTransition Component
 * Wraps page contents to trigger a smooth fade-in and slide-up transition
 * whenever the location (URL route) changes.
 */
const PageTransition = ({ children }) => {
  const location = useLocation();

  return (
    <div key={location.pathname} className="animate-page-entry w-full">
      {children}
    </div>
  );
};

export default PageTransition;
