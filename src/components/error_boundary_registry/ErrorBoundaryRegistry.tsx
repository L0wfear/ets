import * as React from 'react';
import * as Raven from 'raven-js';
import { ErrorBoundaryRegistryContainer, ErrorCenter } from './styled/index';

class ErrorBoundaryRegistry extends React.Component<any, { hasError: boolean }> {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error, info) {
    console.log(error); //tslint:disable-line
    console.log(info); //tslint:disable-line
    Raven.captureException(new Error(error));
  }

  render() {
    return this.state.hasError
      ? (
        <ErrorBoundaryRegistryContainer>
          <ErrorCenter>
            Произошла непредвиденная ошибка
          </ErrorCenter>
        </ErrorBoundaryRegistryContainer>
      )
      : (
        this.props.children
      );
  }
}

export default ErrorBoundaryRegistry;
