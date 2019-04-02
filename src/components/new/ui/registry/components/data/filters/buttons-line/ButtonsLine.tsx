import * as React from 'react';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { connect } from 'react-redux';
import {
  registryToggleIsOpenFilter,
  registryResetAllTypeFilter,
  registryApplyRawFilters,
} from 'components/new/ui/registry/module/actions-registy';

import {
  getFilterData,
  getListData,
} from 'components/new/ui/registry/module/selectors-registry';
import { isBoolean, isString, isNumber } from 'util';
import {
  EtsFiltersButtonsLine,
  EtsFiltersCloseContainer,
  EtsFilterActionButton,
  EtsFilterActionButtonConteiner,
} from 'components/new/ui/registry/components/data/filters/buttons-line/styled/styled';
import { ReduxState } from 'redux-main/@types/state';

type PropsButtonsLIne = {
  registryKey: string;
  isOpen: boolean;
  canApply: boolean;
  canResetFilters: boolean;

  handleClose: any;
  resetAllTypeFilter: any;
  hanleClickApplyRawFilters: any;
};

type StateButtonsLIne = {};

class ButtonsLIne extends React.PureComponent<PropsButtonsLIne, StateButtonsLIne> {
  render() {
    const { props } = this;

    return (
      <EtsFiltersButtonsLine>
        <div />
        <EtsFilterActionButtonConteiner>
          <EtsFilterActionButton type="submit">Применить</EtsFilterActionButton>
          <EtsFilterActionButton
            onClick={props.resetAllTypeFilter}
            disabled={!props.canResetFilters}>
            Сброс
          </EtsFilterActionButton>
        </EtsFilterActionButtonConteiner>
        <EtsFiltersCloseContainer onClick={props.handleClose}>
          <Glyphicon glyph="remove" />
        </EtsFiltersCloseContainer>
      </EtsFiltersButtonsLine>
    );
  }
}

const mapStateToProps = (state, { registryKey }) => {
  const canApply = Object.values(
    getFilterData(state.registry, registryKey).rawFilterValues,
  ).some((valuesObj) =>
    Object.values(valuesObj).some(
      ({ value }: any) =>
        isNumber(value) ||
        isBoolean(value) ||
        (isString(value) && !!value.length) ||
        (value &&
          (!Array.isArray(value) || (Array.isArray(value) && !!value.length))),
    ),
  );

  return {
    canApply,
    canResetFilters:
      canApply ||
      Boolean(
        Object.values(
          getListData(state.registry, registryKey).processed.filterValues,
        ).length,
      ),
  };
};

const mapDispatchToProps = (dispatch, { registryKey }) => ({
  handleClose: () => dispatch(registryToggleIsOpenFilter(registryKey)),
  hanleClickApplyRawFilters: () =>
    dispatch(registryApplyRawFilters(registryKey)),
  resetAllTypeFilter: () => dispatch(registryResetAllTypeFilter(registryKey)),
});

export default connect<any, any, any, ReduxState>(
  mapStateToProps,
  mapDispatchToProps,
)(ButtonsLIne);
