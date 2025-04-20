
import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
          <div className="bg-white shadow-xl rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Oops, something went wrong</h2>
            <p className="mb-4 text-gray-700">The application encountered an unexpected error.</p>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm mb-4">
              {this.state.error && this.state.error.message}
            </pre>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              onClick={() => window.location.reload()}
            >
              Reload the page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
