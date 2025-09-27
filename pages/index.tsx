// pages/index.tsx
import dynamic from 'next/dynamic';

// Dynamically import HomePage with SSR disabled to prevent R3F hooks issues
const HomePage = dynamic(() => import('./HomePage'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white text-xl">Loading...</div>
    </div>
  )
});

export default function Index() {
  return <HomePage />;
}
