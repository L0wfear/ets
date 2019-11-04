import * as React from 'react';
import * as Raven from 'raven-js';
import { DivNone } from 'global-styled/global-styled';
import { getErrorNotificationFromBack } from 'utils/notifications';

class ErrorBoundaryForm extends React.Component<any, { hasError: boolean; }> {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error, info) {
    console.info(error); // eslint-disable-line
    console.info(info); // eslint-disable-line
    global.NOTIFICATION_SYSTEM.notify(getErrorNotificationFromBack('Произошла непредвиденная ошибка'));
    Raven.captureException(new Error(error));
  }

  render() {
    return this.state.hasError
      ? (
        <DivNone />
      )
      : (
        this.props.children
      );
  }
}

export default ErrorBoundaryForm;
