import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';
import LoadingContext, { getLoadingContextDefaultValue } from './LoadingContext';
import { ReduxState } from 'redux-main/@types/state';

type LoadingProviderStateProps = {};
type LoadingProviderDispatchProps = DispatchProp;
type LoadingProviderOwnProps = any;
type LoadingProviderMergedProps = (
  LoadingProviderStateProps
  & LoadingProviderDispatchProps
  & LoadingProviderOwnProps
);
type LoadingProviderProps = LoadingProviderMergedProps;

const LoadingProvider: React.FC<LoadingProviderProps> = React.memo(
  (props) => {
    const value = React.useMemo<ReturnType<typeof getLoadingContextDefaultValue>>(
      () => {
        return getLoadingContextDefaultValue(props.dispatch);
      },
      [props.dispatch],
    );

    return (
      <LoadingContext.Provider value={value}>
        { props.children }
      </LoadingContext.Provider>
    );
  },
);

export default connect<LoadingProviderStateProps, LoadingProviderDispatchProps, LoadingProviderOwnProps, ReduxState>(
  null,
)(LoadingProvider);
