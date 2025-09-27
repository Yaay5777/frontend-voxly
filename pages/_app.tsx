import React from 'react';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { Toaster } from 'react-hot-toast';
import '../styles/globals.css';

// Dynamically import BrowserRouter to avoid SSR issues
const BrowserRouter = dynamic(
  () => import('react-router-dom').then((mod) => mod.BrowserRouter),
  { ssr: false }
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <BrowserRouter>
      <Component {...pageProps} />
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default MyApp;
