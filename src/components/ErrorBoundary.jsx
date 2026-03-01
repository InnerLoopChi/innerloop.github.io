import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#e8e6e6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          fontFamily: "'DM Sans', sans-serif",
          color: '#0a3200',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 24,
            padding: 48,
            maxWidth: 420,
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
          }}>
            <div style={{
              width: 64, height: 64, margin: '0 auto 24px',
              borderRadius: 16, background: '#f189891a',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28,
            }}>
              ⚠️
            </div>
            <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
              Something went wrong
            </h1>
            <p style={{ fontSize: 14, opacity: 0.5, lineHeight: 1.7, marginBottom: 24 }}>
              InnerLoop hit an unexpected error. Try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '12px 32px',
                borderRadius: 50,
                background: '#0a3200',
                color: '#fff',
                fontWeight: 600,
                fontSize: 14,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
