import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import * as queryString from 'query-string';
import { useSearchMergeNewState } from 'components/new/utils/hooks/useSearchMergeNewState';
import { isNumber } from 'util';

export type WithSearchProps = {
  params: any;
  setParams: (obj: { [key: string]: string | number }, typeAction?: 'replace' | 'push') => void;
  searchState: any;
  setDataInSearch: (obj: any) => void;
} & RouteComponentProps<any>;

const withSearch = <OwnProps extends any>(Component: React.ElementType<any>) => (
  withRouter(
    class extends React.Component<RouteComponentProps<{}>, { params: any, search: string; searchState: WithSearchProps['searchState'] }> {
      constructor(props) {
        super(props);

        const {
          location: { search },
          match: { params },
        } = props;

        this.state = {
          search,
          params,
          searchState: queryString.parse(search),
        };
      }

      componentDidUpdate(prevProps) {
        const {
          location: { search },
          match: { params },
        } = this.props;

        const changeObj: any = {};
        let hasChanges = false;

        if (search !== prevProps.location.search) {
          hasChanges = true;

          changeObj.search = search;
          changeObj.searchState = queryString.parse(search);
        }

        if (params !== prevProps.match.params) {
          hasChanges = true;

          changeObj.params = params;
        }

        if (hasChanges) {
          this.setState(changeObj);
        }
      }

      setDataInSearch: WithSearchProps['setDataInSearch'] = async (data) => {
        await Promise.resolve(true);
        this.props.history.replace(
          `${
            this.props.match.url
          }?${
            queryString.stringify(
              useSearchMergeNewState(
                this.state.searchState,
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

      render() {
        return (
          <Component
            params={this.state.params}
            setParams={this.setParams}
            searchState={this.state.searchState}
            setDataInSearch={this.setDataInSearch}
            {...this.props}
          />
        );
      }
    },
  )
);

export default withSearch;
