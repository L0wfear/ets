import * as React from 'react';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { compose } from 'recompose';
import { isNullOrUndefined } from 'util';
import { DivNone } from 'global-styled/global-styled';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';

import { getListData, getRootRegistry } from '../../../module/selectors-registry';
import { ReduxState } from 'redux-main/@types/state';
import { registryChangeDataPaginatorCurrentPage } from '../../../module/actions-registy';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';

type EtsPaginatorCheckSearchStateProps = {
  currentPage: OneRegistryData['list']['paginator']['currentPage'];
  isLoading: OneRegistryData['isLoading'];
};
type EtsPaginatorCheckSearchDispatchProps = {
  registryChangeDataPaginatorCurrentPage: HandleThunkActionCreator<typeof registryChangeDataPaginatorCurrentPage>;
};
type EtsPaginatorCheckSearchOwnProps = {
  registryKey: string;
  countPages: number;
};
type EtsPaginatorCheckSearchProps = (
  EtsPaginatorCheckSearchStateProps
  & EtsPaginatorCheckSearchDispatchProps
  & EtsPaginatorCheckSearchOwnProps
) & WithSearchProps;

class EtsPaginatorCheckSearch extends React.PureComponent<EtsPaginatorCheckSearchProps, {}> {
  componentDidMount() {
    const pageKey = `${this.props.registryKey}_page`;
    const currentPageSearch = this.props.searchState[pageKey];

    if (!isNullOrUndefined(currentPageSearch)) {                                    // применение текущей страницы из queryString
      const currentPageSearchNumber = Math.ceil(getNumberValueFromSerch(currentPageSearch));
      if (currentPageSearchNumber !== this.props.currentPage) {
        this.props.registryChangeDataPaginatorCurrentPage(
          this.props.registryKey,
          currentPageSearchNumber,
        );
      }
    } else if (this.props.currentPage > 0) {                                                                        // применение текущей страницы из стора
      this.props.setDataInSearch({
        [pageKey]: this.props.currentPage,
      });
    }
  }

  componentDidUpdate(prevProp: EtsPaginatorCheckSearchProps) {
    const pageKey = `${this.props.registryKey}_page`;
    const newCurrentPageSearch = this.props.searchState[pageKey];
    const prevCurrentSearchPage = prevProp.searchState[pageKey];

    const newCurrentPageStore = this.props.currentPage;
    const prevCurrentPageStore = prevProp.currentPage;

    if (newCurrentPageSearch !== prevCurrentSearchPage) {                                             // применение текущей страницы из queryString
      const currentPageSearchNumber = Math.ceil(getNumberValueFromSerch(newCurrentPageSearch || 0));
      if (currentPageSearchNumber !== this.props.currentPage) {
        this.props.registryChangeDataPaginatorCurrentPage(
          this.props.registryKey,
          currentPageSearchNumber,
        );
      }
    }

    if (!isNullOrUndefined(newCurrentPageStore) && newCurrentPageStore !== prevCurrentPageStore) {    // применение текущей страницы из стора
      const currentPageSearchNumber = Math.ceil(getNumberValueFromSerch(newCurrentPageSearch));
      if (newCurrentPageStore !== currentPageSearchNumber) {
        this.props.setDataInSearch({
          [pageKey]: newCurrentPageStore === 0 ? null : newCurrentPageStore,
        });
      }
    }

    if (!isNullOrUndefined(newCurrentPageSearch) && !this.props.isLoading) {                          // Если текущая страница больше максимальной
      const currentPageSearchNumber = Math.ceil(getNumberValueFromSerch(newCurrentPageSearch));
      if (currentPageSearchNumber >= this.props.countPages) {
        this.props.setDataInSearch({
          [pageKey]: this.props.countPages <= 1 ? null : this.props.countPages - 1,
        });
      }
    }
  }

  render() {
    return (
      <DivNone />
    );
  }
}

export default compose<EtsPaginatorCheckSearchProps, EtsPaginatorCheckSearchOwnProps>(
  connect<EtsPaginatorCheckSearchStateProps, EtsPaginatorCheckSearchDispatchProps, EtsPaginatorCheckSearchOwnProps, ReduxState>(
    (state, { registryKey }) => ({
      currentPage: getListData(state.registry, registryKey).paginator.currentPage,
      isLoading: getRootRegistry(state.registry, registryKey).isLoading,
    }),
    (dispatch: any) => ({
      registryChangeDataPaginatorCurrentPage: (...arg) => (
        dispatch(
          registryChangeDataPaginatorCurrentPage(...arg),
        )
      ),
    }),
  ),
  withSearch,
)(EtsPaginatorCheckSearch);
