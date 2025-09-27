import React from "react";

type Props = { children: React.ReactNode };
type State = { hasError: boolean; error?: Error | null };

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    console.error("Uncaught error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-sky-700 text-white p-6">
          <div className="max-w-xl text-center">
            <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
            <p className="mb-4 text-slate-200">We caught an error while rendering the app. Check DevTools for details.</p>
            <pre className="text-xs text-left bg-black/20 p-3 rounded">{String(this.state.error)}</pre>
            <div className="mt-4">
              <button onClick={() => window.location.reload()} className="px-4 py-2 rounded bg-white/10">Reload</button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
