import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import ButtonsLine from 'components/new/ui/registry/components/data/filters/buttons-line/ButtonsLine';
import FiltersLines from 'components/new/ui/registry/components/data/filters/filters-lines/FiltersLines';

import { EtsFilterCntainer } from 'components/new/ui/registry/components/data/filters/styled/styled';
import { ReduxState } from 'redux-main/@types/state';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { getFilterData } from '../../../module/selectors-registry';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';

import { applyFilterFromRaw } from '../../../module/utils/filter';
import EtsFilterCheckSearch from './EtsFilterCheckSearch';

type FiltersStateProps = {
  rawFilterValues: OneRegistryData['filter'];
};
type FiltersDispatchProps = {
};
type FiltersOwnProps = {
  needUpdateFiltersOptions: boolean;
  registryKey: string;
};
type FiltersProps = (
  FiltersStateProps
  & FiltersDispatchProps
  & FiltersOwnProps
) & WithSearchProps;

const Filters: React.FC<FiltersProps> = React.memo(
  (props) => {
    const { registryKey } = props;

    const hanleClickApplyRawFilters = React.useCallback(
      (event) => {
        event.preventDefault();
        const timeKey = `${props.registryKey}_time`;
        const filterKey = `${props.registryKey}_filters`;

        props.setDataInSearch({
          [filterKey]: encodeURIComponent(JSON.stringify(applyFilterFromRaw(props.rawFilterValues.rawFilterValues))),
          [timeKey]: (new Date()).toString(),
        });
      },
      [props.rawFilterValues, props.setDataInSearch, props.registryKey],
    );

    return (
      <React.Fragment>
        <EtsFilterCntainer onSubmit={hanleClickApplyRawFilters}>
          <ButtonsLine registryKey={registryKey} />
          <FiltersLines registryKey={registryKey} needUpdateFiltersOptions={props.needUpdateFiltersOptions} />
        </EtsFilterCntainer>
        <EtsFilterCheckSearch registryKey={registryKey} />
      </React.Fragment>
    );
  },
);

export default compose<FiltersProps, FiltersOwnProps>(
  connect<FiltersStateProps, FiltersDispatchProps, FiltersOwnProps, ReduxState>(
    (state, { registryKey }) => ({
      rawFilterValues: getFilterData(state.registry, registryKey),
    }),
  ),
  withSearch,
)(Filters);
