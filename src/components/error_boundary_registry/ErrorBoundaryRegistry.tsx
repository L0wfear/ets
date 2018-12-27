import * as React from 'react';
import * as Raven from 'raven-js';
import { ErrorBoundaryRegistryContainer, ErorText, ErorTextTimeOut, ButtonRefreshRegistry } from './styled/index';

class ErrorBoundaryRegistry extends React.Component<any, { hasError: boolean, countLeft: number, intervalId: any }> {
  state = {
    hasError: false,
    countLeft: 5,
    intervalId: null,
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
    this.setState({
      intervalId: setInterval(this.updateCountLeft, 1000),
    });
  }

  refreshNow = () => {
    const { intervalId } = this.state;
    clearInterval(intervalId);

    this.setState({
      hasError: false,
      intervalId: null,
      countLeft: 5,
    });
  }

  updateCountLeft = () => {
    this.setState((state) => {
      const countLeft = state.countLeft - 1;

      if (countLeft === 0) {
        clearInterval(state.intervalId);
        return {
          hasError: false,
          intervalId: null,
          countLeft: 5,
        };
      }
      return {
        ...state,
        countLeft,
      };
    });
  }

  render() {
    const { countLeft } = this.state;

    return this.state.hasError
      ? (
        <ErrorBoundaryRegistryContainer>
          <ErorText font_size={0} />
          <ErorText font_size={40}>
            Произошла непредвиденная ошибка
          </ErorText>
          <ErorTextTimeOut font_size={30}>
            {`Обновление через ${countLeft}`}
            <ButtonRefreshRegistry onClick={this.refreshNow}>Обновить сейчас</ButtonRefreshRegistry>
          </ErorTextTimeOut>
        </ErrorBoundaryRegistryContainer>
      )
      : (
        this.props.children
      );
  }
}

export default ErrorBoundaryRegistry;
