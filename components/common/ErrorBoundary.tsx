import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // Explicitly defining props for TS compatibility in strict mode environments
  public readonly props: Readonly<ErrorBoundaryProps>;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.props = props;
    this.state = {
      hasError: false
    };
  }

  public state: ErrorBoundaryState = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-4 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Something went wrong.</h1>
          <p className="text-gray-600 mb-4">Please refresh the page or try logging in again.</p>
          <button 
            onClick={() => { sessionStorage.clear(); window.location.reload(); }}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Reset Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}