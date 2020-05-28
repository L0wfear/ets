import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import * as queryString from 'query-string';
import { isNumber } from 'util';
import memoizeOne from 'memoize-one';

import { useSearchMergeNewState } from 'components/new/utils/hooks/useSearchMergeNewState';

export type WithSearchProps<Params extends Record<string, string> = any, Search extends Record<string, string> = any> = {
  setParams: (obj: Partial<Params>, typeAction?: 'replace' | 'push') => void;
  searchState: Search;
  setDataInSearch: (obj: Record<string, any>, type?: 'push' | 'replace') => void;
  setParamsAndSearch: (any: { params: Partial<Params>; search: Record<keyof Search, string | number>;}) => void;
} & RouteComponentProps<Params>;

const makeObjFromMemoise = memoizeOne(
  (search: string): any => {
    return queryString.parse(search);
  },
);

const withSearch = <OwnProps extends object, Params extends Record<string, string> = any, Search extends Record<string, string> = any>(Component: React.ComponentType<WithSearchProps<Params, Search> & OwnProps>) => {
  const rawWithSearch: React.FC<RouteComponentProps<Params> & OwnProps> = React.memo(
    (props) => {
      const {
        history,
        match,
        location,
      } = props;

      const setDataInSearch: WithSearchProps<Params, Search>['setDataInSearch'] = React.useCallback(
        async (data, type) => {
          await Promise.resolve(true);
          props.history[type ? type : 'replace'](
            `${
              props.match.url
            }?${
              queryString.stringify(
                useSearchMergeNewState(
                  makeObjFromMemoise(location.search),
                  data,
                ),
              )
            }`,
          );
        },
        [
          history,
          location.search,
          match.url,
        ],
      );

      const setParams: WithSearchProps<Params, Search>['setParams'] = React.useCallback(
        (objParams, typeAction = 'push') => {
          let urlAsArray = match.path.split('/').map((partOfUrl) => {
            let ans = partOfUrl;

            Object.entries(objParams).forEach(([key, value]) => {
              ans = ans.replace(`:${key}?`, value || isNumber(value) ? value.toString() : '');
            });

            Object.entries(match.params).forEach(([key, value]: [string, string]) => {
              ans = ans.replace(`:${key}?`, value ? value : '');
            });

            return ans;
          });

          const emptyIndex = urlAsArray.findIndex((value, index) => index && !value);
          if (emptyIndex > 0) {
            urlAsArray = urlAsArray.slice(0, emptyIndex);
          }

          history[typeAction](
            `${
              urlAsArray.join('/')
            }${
              location.search
            }`,
          );
        },
        [
          match.path,
          match.params,
          history,
          location.search,
        ],
      );

      const setParamsAndSearch: WithSearchProps<Params, Search>['setParamsAndSearch'] = React.useCallback(
        ({ params, search }) => {
          let urlAsArray = match.path.split('/').map((partOfUrl) => {
            let ans = partOfUrl.replace('?', '');

            Object.entries(params).forEach(([key, value]) => {
              ans = ans.replace(`:${key}`, value || isNumber(value) ? value.toString() : '');
            });

            Object.entries(match.params).forEach(([key, value]: [string, string]) => {
              ans = ans.replace(`:${key}`, value ? value : '');
            });

            return ans;
          });

          const emptyIndex = urlAsArray.findIndex((value, index) => index && !value);
          if (emptyIndex > 0) {
            urlAsArray = urlAsArray.slice(0, emptyIndex);
          }

          history.push(
            `${
              urlAsArray.join('/')
            }?${
              queryString.stringify(
                useSearchMergeNewState(
                  makeObjFromMemoise(location.search),
                  search,
                ),
              )
            }`,
          );
        },
        [
          match.path,
          history,
          history.push,
          location.search,
          match.params,
        ],
      );

      return (
        <Component
          searchState={makeObjFromMemoise(location.search)}
          setParamsAndSearch={setParamsAndSearch}
          setDataInSearch={setDataInSearch}
          setParams={setParams}
          {...props}
        />
      );
    },
  );
  return withRouter<RouteComponentProps<Params> & OwnProps, React.ComponentType<RouteComponentProps<Params> & OwnProps>>(
    rawWithSearch,
  );
};

export default withSearch;
