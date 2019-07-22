import * as React from 'react';
import * as Raven from 'raven-js';
import {
  ErrorBoundaryRegistryContainer,
  ErorText,
  ErorTextTimeOut,
  ButtonRefreshRegistry,
  DivCat,
  TextRefreshRegistry,
} from './styled/index';
import { DivNone } from 'global-styled/global-styled';

const STAND = process.env.STAND;

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
    console.log(error); // tslint:disable-line:no-console
    console.log(info); // tslint:disable-line:no-console

    Raven.captureException(new Error(error));

    if (!this.state.intervalId) {
      this.setState({
        intervalId: setInterval(this.updateCountLeft, 1000),
      });
    }
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
            <div>
              Произошла непредвиденная ошибка
            </div>
            {
              STAND === 'dev'
                ? <DivCat />
                : <DivNone />
            }
          </ErorText>
          <ErorTextTimeOut font_size={30}>
            <TextRefreshRegistry>{`Обновление через ${countLeft}`}</TextRefreshRegistry>
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
