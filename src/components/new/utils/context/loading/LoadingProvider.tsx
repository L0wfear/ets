import * as React from 'react';
import LoadingContext, { getLoadingContextDefaultValue } from './LoadingContext';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

type OwnProps = {};
type Props = OwnProps & {};

const LoadingProvider: React.FC<Props> = React.memo(
  (props) => {
    const dispatch = etsUseDispatch();
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
