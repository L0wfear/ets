import * as React from 'react';
import { useDispatch } from 'react-redux';
import LoadingContext, { getLoadingContextDefaultValue } from './LoadingContext';

type OwnProps = {};
type Props = OwnProps & {};

const LoadingProvider: React.FC<Props> = React.memo(
  (props) => {
    const dispatch = useDispatch();
    const value = React.useMemo<ReturnType<typeof getLoadingContextDefaultValue>>(
      () => {
        return getLoadingContextDefaultValue(dispatch);
      },
      [],
    );

    return (
      <LoadingContext.Provider value={value}>
        { props.children }
      </LoadingContext.Provider>
    );
  },
);

export default LoadingProvider;
