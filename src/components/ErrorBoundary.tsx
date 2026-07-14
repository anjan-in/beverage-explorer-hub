import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  // 1. This updates the state so the next render shows the fallback UI
  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  // 2. This logs the error details to your monitoring console
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an active runtime error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false });
    window.location.href = '/explore'; // Redirect back to a safe route
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[80vh] flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-300">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-8 max-w-md w-full text-center shadow-lg transform transition-all">
            <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950/30 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-200 dark:border-amber-900/50">
              <AlertTriangle className="w-8 h-8 text-amber-500 dark:text-amber-400 animate-bounce" />
            </div>
            
            <h1 className="text-2xl font-black tracking-tight text-gray-800 dark:text-slate-100 mb-3">
              System Connectivity Notice
            </h1>
            
            <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed mb-6">
              The external database provider is currently undergoing maintenance or experiencing heavy load request volumes. Please stand by.
            </p>

            <button
              onClick={this.handleReset}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-medium rounded-xl text-sm transition shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Re-establish Connection
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}