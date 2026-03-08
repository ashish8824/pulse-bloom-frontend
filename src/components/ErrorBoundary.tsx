import { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
              <AlertTriangle size={32} className="text-red-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-gray-400">
              An unexpected error occurred. Try refreshing — if the problem
              persists, please contact support.
            </p>
            {this.state.message && (
              <p className="mt-3 text-xs text-gray-600 font-mono bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-left break-all">
                {this.state.message}
              </p>
            )}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-xl transition-colors"
          >
            <RefreshCw size={15} />
            Refresh Page
          </button>
        </div>
      </div>
    );
  }
}
