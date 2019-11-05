import * as React from 'react';
import { connect } from 'react-redux';
import {
  registryToggleIsOpenFilter,
  registryResetAllTypeFilter,
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
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { compose } from 'recompose';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

type PropsButtonsLIne = {
  registryKey: string;
  isOpen: boolean;
  canApply: boolean;
  canResetFilters: boolean;
} & WithSearchProps;

const ButtonsLIne: React.FC<PropsButtonsLIne> = React.memo(
  (props) => {
    const dispatch = etsUseDispatch();
    const resetAllTypeFilter = React.useCallback(
      () => {
        const filterKey = `${props.registryKey}_filters`;
        const timeKey = `${props.registryKey}_time`;
        props.setDataInSearch({
          [filterKey]: null,
          [timeKey]: null
        });

        dispatch(registryResetAllTypeFilter(props.registryKey));
      },
      [props.setDataInSearch, props.match.params, props.searchState],
    );

    const handleClose = React.useCallback(
      () => {
        dispatch(registryToggleIsOpenFilter(props.registryKey));
      },
      [],
    );

    return (
      <EtsFiltersButtonsLine>
        <div />
        <EtsFilterActionButtonConteiner>
          <EtsFilterActionButton id="submit" type="submit">Применить</EtsFilterActionButton>
          <EtsFilterActionButton
            onClick={resetAllTypeFilter}
            disabled={!props.canResetFilters}>
            Сброс
          </EtsFilterActionButton>
        </EtsFilterActionButtonConteiner>
        <EtsFiltersCloseContainer onClick={handleClose}>
          <EtsBootstrap.Glyphicon glyph="remove" />
        </EtsFiltersCloseContainer>
      </EtsFiltersButtonsLine>
    );
  },
);

export default compose<any, any>(
  connect<any, any, any, ReduxState>(
    (state, { registryKey }) => {
      const canApply = Object.values(
        getFilterData(state.registry, registryKey).rawFilterValues,
      ).some((valuesObj) =>
        Object.values(valuesObj).some(
          ({ value }: any) =>
            isNumber(value)
            || isBoolean(value)
            || (isString(value) && !!value.length)
            || (value
              && (!Array.isArray(value) || (Array.isArray(value) && !!value.length))),
        ),
      );

      return {
        canApply,
        canResetFilters:
          canApply
          || Boolean(
            Object.values(
              getListData(state.registry, registryKey).processed.filterValues,
            ).length,
          ),
      };
    },
  ),
  withSearch,
)(ButtonsLIne);
