import React, { Component, ErrorInfo, ReactNode } from 'react';
import ErrorPage from './ErrorPage';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[UNCAUGHT EXCEPTION IN REACT TREE]', error, errorInfo);
  }

  public resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return <ErrorPage error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}
