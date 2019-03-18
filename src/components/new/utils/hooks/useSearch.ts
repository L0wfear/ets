import * as React from 'react';
import * as queryString from 'query-string';
import { RouteComponentProps } from 'react-router-dom';
import { useSearchMergeNewState } from './useSearchMergeNewState';

type RouteProps = (
  RouteComponentProps<{}>
) & Record<any, any>;

const initState = {};

export const useSeach = (routeProps: RouteProps): [any, any] => {
  const {
    match,
    history,
    location: { search },
  } = routeProps;

  const [searchState, setSearchState] = React.useState(initState);

  React.useEffect(
    () => {
      setSearchState(queryString.parse(search));
    },
    [search],
  );

  const setDataInSearch = React.useCallback((data) => {
    history.push(
      `${match.url}?${
        queryString.stringify(
          useSearchMergeNewState(
            searchState,
            data,
          ),
        )
      }`,
    );
  }, [searchState]);

  return [searchState, setDataInSearch];
};
