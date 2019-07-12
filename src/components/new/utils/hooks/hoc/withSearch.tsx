import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import * as queryString from 'query-string';
import { useSearchMergeNewState } from 'components/new/utils/hooks/useSearchMergeNewState';
import { isNumber } from 'util';
import memoizeOne from 'memoize-one';

export type WithSearchProps = {
  setParams: (obj: { [key: string]: string | number }, typeAction?: 'replace' | 'push') => void;
  searchState: any;
  setDataInSearch: (obj: any, type?: 'push' | 'replace') => void;
  setParamsAndSearch: (any) => void;
} & RouteComponentProps<any>;

const makeObjFromMemoise = memoizeOne(
  (search: string): any => {
    return queryString.parse(search);
  },
);

const withSearch = <OwnProps extends any>(Component: React.ComponentType<any>) => (
  withRouter<any, any>(
    class extends React.PureComponent<RouteComponentProps<{}>, {}> {
      setDataInSearch: WithSearchProps['setDataInSearch'] = async (data, type) => {
        await Promise.resolve(true);

        this.props.history[type ? type : 'replace'](
          `${
            this.props.match.url
          }?${
            queryString.stringify(
              useSearchMergeNewState(
                makeObjFromMemoise(this.props.location.search),
                data,
              ),
            )
          }`,
        );
      }

      setParams: WithSearchProps['setParams'] = (objParams, typeAction = 'push') => {
        let urlAsArray = this.props.match.path.split('/').map((partOfUrl) => {
          let ans = partOfUrl;

          Object.entries(objParams).forEach(([key, value]) => {
            ans = ans.replace(`:${key}?`, value || isNumber(value) ? value.toString() : '');
          });

          Object.entries(this.props.match.params).forEach(([key, value]: [string, string]) => {
            ans = ans.replace(`:${key}?`, value ? value : '');
          });

          return ans;
        });

        const emptyIndex = urlAsArray.findIndex((value, index) => index && !value);
        if (emptyIndex > 0) {
          urlAsArray = urlAsArray.slice(0, emptyIndex);
        }

        this.props.history[typeAction](
          `${
            urlAsArray.join('/')
          }${
            this.props.location.search
          }`,
        );
      }

      setParamsAndSearch = ({ params, search }) => {
        let urlAsArray = this.props.match.path.split('/').map((partOfUrl) => {
          let ans = partOfUrl.replace('?', '');

          Object.entries(params).forEach(([key, value]) => {
            ans = ans.replace(`:${key}`, value || isNumber(value) ? value.toString() : '');
          });

          Object.entries(this.props.match.params).forEach(([key, value]: [string, string]) => {
            ans = ans.replace(`:${key}`, value ? value : '');
          });

          return ans;
        });

        const emptyIndex = urlAsArray.findIndex((value, index) => index && !value);
        if (emptyIndex > 0) {
          urlAsArray = urlAsArray.slice(0, emptyIndex);
        }

        this.props.history.push(
          `${
            urlAsArray.join('/')
          }?${
            queryString.stringify(
              useSearchMergeNewState(
                makeObjFromMemoise(this.props.location.search),
                search,
              ),
            )
          }`,
        );
      }

      render() {
        return (
          <Component
            setParams={this.setParams}
            searchState={makeObjFromMemoise(this.props.location.search)}
            setParamsAndSearch={this.setParamsAndSearch}
            setDataInSearch={this.setDataInSearch}
            {...this.props}
          />
        );
      }
    },
  )
);

export default withSearch;
