import * as React from 'react';
import { uniqBy } from 'lodash';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import { SelectLabel, InstectionBlockSelect } from 'components/new/pages/inspection/autobase/components/select_carpool/styled/InspectionAutobaseSelectCarpoolStyled';
import { SelectField } from '../../styled/InspectionPgmBaseSelectCarpoolStyled';
import { ExtField } from 'components/ui/new/field/ExtField';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';

import { ReduxState } from 'redux-main/@types/state';
import { getInspectPgmBase } from 'redux-main/reducers/selectors';
import { PgmStore } from 'redux-main/reducers/modules/geoobject/actions_by_type/pgm_store/@types';
import { IStateInspectPgmBase } from 'redux-main/reducers/modules/inspect/pgm_base/@types/inspect_pgm_base';

type SelectPgmBaseStateProps = {
  companyList: IStateInspectPgmBase['companyList'];
  pgmBaseList: IStateInspectPgmBase['pgmBaseList'];
};
type SelectPgmBaseDispatchProps = {};
type SelectPgmBaseOwnProps = {};

type SelectPgmBaseMergeProps = (
  SelectPgmBaseStateProps
  & SelectPgmBaseDispatchProps
  & SelectPgmBaseOwnProps
);
type SelectPgmBaseProps = (
  SelectPgmBaseMergeProps
  & WithSearchProps
);

const filterPgmBaseByCompany = (pgmBaseList: PgmStore[], companyId: number, pgmBaseId: number) => (
  pgmBaseList.filter(({ company_id, pgm_stores_type_id }) => company_id === companyId && pgm_stores_type_id === pgmBaseId)
);

const SelectPgmBase: React.FC<SelectPgmBaseProps> = (props) => {
  const {
    searchState,
    setDataInSearch,
  } = props;
  const companyId = getNumberValueFromSerch(searchState.companyId);
  const pgmBaseTypeId = getNumberValueFromSerch(searchState.pgmBaseTypeId);
  const pgmBaseId = getNumberValueFromSerch(searchState.pgmBaseId);

  React.useEffect(
    () => {
      if (pgmBaseId && companyId && pgmBaseId && props.pgmBaseList.length) {
        const currentPgmBaseInCompany = filterPgmBaseByCompany(
          props.pgmBaseList,
          companyId,
          pgmBaseTypeId,
        ).some(({ id }) => id === pgmBaseId);

        if (!currentPgmBaseInCompany) {
          const newPartialSearch: any = {
            ...searchState,
            pgmBaseId: null,
          };

          setDataInSearch(newPartialSearch);
        }
      }
    },
    [companyId, pgmBaseTypeId, pgmBaseId, props.companyList, searchState],
  );

  const pgmBaseIdOptions = React.useMemo(
    () => {
      if (companyId && pgmBaseTypeId) {
        return uniqBy(
          filterPgmBaseByCompany(
            props.pgmBaseList,
            companyId,
            pgmBaseTypeId,
          ).map(
            (pgmBase) => ({
              value: pgmBase.id,
              label: pgmBase.address,
              rowData: pgmBase,
            }),
          ).filter(({ value }) => value),
          'value',
        );
      }

      return [];
    },
    [props.pgmBaseList, companyId, pgmBaseTypeId],
  );

  const setPgmBaseId = React.useCallback(
    (selectedPgmBaseId: number) => {
      const newPartialSearch: any = {
        ...searchState,
      };

      newPartialSearch.pgmBaseId = selectedPgmBaseId;

      setDataInSearch(newPartialSearch);
    },
    [searchState],
  );

  return (
    <InstectionBlockSelect>
      <SelectLabel md={1} sm={1}>
        <h5>
          Адрес базы
        </h5>
      </SelectLabel>
      <SelectField md={4} sm={6}>
        <ExtField
          type="select"
          value={pgmBaseId}
          disabled={!companyId || !pgmBaseTypeId}
          label={false}
          options={pgmBaseIdOptions}
          onChange={setPgmBaseId}
          clearable={false}
        />
      </SelectField>
    </InstectionBlockSelect>
  );
};

export default compose<SelectPgmBaseProps, SelectPgmBaseOwnProps>(
  withSearch,
  connect<SelectPgmBaseStateProps, SelectPgmBaseDispatchProps, SelectPgmBaseOwnProps, ReduxState>(
    (state) => ({
      companyList: getInspectPgmBase(state).companyList,
      pgmBaseList: getInspectPgmBase(state).pgmBaseList,
    }),
  ),
)(SelectPgmBase);
