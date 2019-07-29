import * as React from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';

import {
  getListData,
  getFilterData,
} from 'components/new/ui/registry/module/selectors-registry';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import { registryToggleIsOpenFilter } from 'components/new/ui/registry/module/actions-registy';
import { ReduxState } from 'redux-main/@types/state';
import { compose } from 'recompose';
import { OneRegistryData } from 'components/new/ui/registry/module/registry';

type ButtonToggleFilterStateProps = {
  hasFilters: boolean;
};
type ButtonToggleFilterDispatchProps = {
  handleClick: React.MouseEventHandler<React.ClassicComponent<any, {}>>;
};
type ButtonToggleFilterOwnProps = {
  registryKey: string;
  data?: ValuesOf<OneRegistryData['header']['buttons']>
};
type ButtonToggleFilterMergeProps = {};

type ButtonToggleFilterProps = (
  ButtonToggleFilterStateProps
  & ButtonToggleFilterDispatchProps
  & ButtonToggleFilterOwnProps
  & ButtonToggleFilterMergeProps
);

const ButtonToggleFilter: React.FC<ButtonToggleFilterProps> = (props) => {
  const data = React.useMemo(
    () => (
      get(props, 'data', {} as ButtonToggleFilterOwnProps['data'])
    ),
    [props.data],
  );

  return (
    <EtsBootstrap.Button
      id="show-options-filter"
      bsSize="small"
      active={props.hasFilters}
      onClick={props.handleClick}
    >
      <EtsBootstrap.Glyphicon glyph={data.glyph || 'filter'} />
    </EtsBootstrap.Button>
  );
};

export default compose<ButtonToggleFilterProps, ButtonToggleFilterOwnProps>(
  connect<ButtonToggleFilterStateProps, ButtonToggleFilterDispatchProps, ButtonToggleFilterOwnProps, ButtonToggleFilterMergeProps, ReduxState>(
    (state, { registryKey }) => ({
      isOpen: getFilterData(state.registry, registryKey).isOpen,
      hasFilters: (
        Boolean(
          Object.values(
            getListData(state.registry, registryKey).processed.filterValues,
          ).length,
        )
      ),
    }),
    (dispatch: any, { registryKey }) => ({
      handleClick: () => (
        dispatch(
          registryToggleIsOpenFilter(registryKey),
        )
      ),
    }),
    null,
    {
      pure: true,
    },
  ),
)(ButtonToggleFilter);
