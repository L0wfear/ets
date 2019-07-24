import * as React from 'react';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { compose } from 'recompose';

import { ReduxState } from 'redux-main/@types/state';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { DivNone } from 'global-styled/global-styled';
import { applyFilterValues } from '../../../module/actions-registy';

type EtsFilterCheckSearchStateProps = {
};
type EtsFilterCheckSearchDispatchProps = {
  applyFilterValues: HandleThunkActionCreator<typeof applyFilterValues>;
};
type EtsFilterCheckSearchOwnProps = {
  registryKey: string;
};
type EtsFilterCheckSearchProps = (
  EtsFilterCheckSearchStateProps
  & EtsFilterCheckSearchDispatchProps
  & EtsFilterCheckSearchOwnProps
) & WithSearchProps;

class EtsFilterCheckSearch extends React.PureComponent<EtsFilterCheckSearchProps, {}> {
  componentDidMount() {
    const filterKey = `${this.props.registryKey}_filters`;
    const filters = this.props.searchState[filterKey];

    let filterValue = this.props.searchState[filterKey];

    try {
      filterValue = decodeURIComponent(filterValue);
    } catch (e) {
      //
    }

    if (filters) {
      const filtersValues = JSON.parse(filterValue || '{}');
      this.props.applyFilterValues(
        this.props.registryKey,
        filtersValues,
      );
    }
  }

  componentDidUpdate(prevProps) {
    const filterKey = `${this.props.registryKey}_filters`;
    const filters = this.props.searchState[filterKey];
    const filtersPrev = prevProps.searchState[filterKey];

    let filterValue = this.props.searchState[filterKey];

    try {
      filterValue = decodeURIComponent(filterValue);
    } catch (e) {
      //
    }

    if (filtersPrev !== filters) {
      const filtersValues = JSON.parse(filterValue || '{}');

      this.props.applyFilterValues(
        this.props.registryKey,
        filtersValues,
      );
    }
  }

  render() {
    return (
      <DivNone />
    );
  }
}

export default compose<EtsFilterCheckSearchProps, EtsFilterCheckSearchOwnProps>(
  connect<EtsFilterCheckSearchStateProps, EtsFilterCheckSearchDispatchProps, EtsFilterCheckSearchOwnProps, ReduxState>(
    null,
    (dispatch: any) => ({
      applyFilterValues: (...arg) => (
        dispatch(
          applyFilterValues(...arg),
        )
      ),
    }),
  ),
  withSearch,
)(EtsFilterCheckSearch);
