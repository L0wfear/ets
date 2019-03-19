import * as React from 'react';
import { connect } from 'react-redux';

import {
  getListData,
  getFilterData,
} from 'components/new/ui/registry/module/selectors-registry';
import * as Button from 'react-bootstrap/lib/Button';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';

import { registryToggleIsOpenFilter } from 'components/new/ui/registry/module/actions-registy';
import { ReduxState } from 'redux-main/@types/state';
import { compose } from 'recompose';

type ButtonToggleFilterStateProps = {
  hasFilters: boolean;
};
type ButtonToggleFilterDispatchProps = {
  handleClick: React.MouseEventHandler<React.ClassicComponent<any, {}>>;
};
type ButtonToggleFilterOwnProps = {
  registryKey: string;
};
type ButtonToggleFilterMergeProps = {};

type ButtonToggleFilterProps = (
  ButtonToggleFilterStateProps
  & ButtonToggleFilterDispatchProps
  & ButtonToggleFilterOwnProps
  & ButtonToggleFilterMergeProps
);

const ButtonToggleFilter: React.FC<ButtonToggleFilterProps> = (props) => {
  return (
    <Button
      id="show-options-filter"
      bsSize="small"
      active={props.hasFilters}
      onClick={props.handleClick}
    >
      <Glyphicon glyph="filter" />
    </Button>
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
