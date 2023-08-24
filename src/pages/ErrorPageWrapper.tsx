import React from 'react';
import { useLocation } from 'react-router-dom';
import ErrorPage from './ErrorPage';

const ErrorPageWrapper: React.FC = () => {
  const { state } = useLocation();
  const errorCode = state?.errorCode || 404; // Default to 404 if state is not provided

  return <ErrorPage errorCode={errorCode} />;
};

export default ErrorPageWrapper;
