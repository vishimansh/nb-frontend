import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full bg-[#F7F7F4] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xl font-bold mb-3">
            ⚠️
          </div>
          <h2 className="text-[16px] font-bold text-[#1E213D]">कुछ गलत हो गया</h2>
          <p className="text-xs text-gray-500 mt-1 max-w-xs">
            {this.state.error?.message || 'अज्ञात त्रुटि'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.href = '/feed';
            }}
            className="mt-4 px-4 py-2 bg-[#1E213D] text-white text-xs font-semibold rounded-xl active:scale-95"
          >
            होम स्क्रीन पर जाएं
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
