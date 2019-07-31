import * as React from 'react';
import { uniqBy } from 'lodash';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { SelectLabel, InstectionBlockSelect } from 'components/new/pages/inspection/autobase/components/select_carpool/styled/InspectionAutobaseSelectCarpoolStyled';
import { SelectField } from '../../styled/InspectionPgmBaseSelectCarpoolStyled';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';

import { ReduxState } from 'redux-main/@types/state';
import { getInspectPgmBase } from 'redux-main/reducers/selectors';
import { PgmStore } from 'redux-main/reducers/modules/geoobject/actions_by_type/pgm_store/@types';
import { IStateInspectPgmBase } from 'redux-main/reducers/modules/inspect/pgm_base/@types/inspect_pgm_base';

type SelectPgmBaseTypeIdStateProps = {
  companyList: IStateInspectPgmBase['companyList'];
  pgmBaseList: IStateInspectPgmBase['pgmBaseList'];
};
type SelectPgmBaseTypeIdDispatchProps = {};
type SelectPgmBaseTypeIdOwnProps = {};

type SelectPgmBaseTypeIdMergeProps = (
  SelectPgmBaseTypeIdStateProps
  & SelectPgmBaseTypeIdDispatchProps
  & SelectPgmBaseTypeIdOwnProps
);
type SelectPgmBaseTypeIdProps = (
  SelectPgmBaseTypeIdMergeProps
  & WithSearchProps
);

const filterPgmBase = (pgmBaseList: PgmStore[], companyId: number) => (
  pgmBaseList.filter(({ company_id }) => company_id === companyId)
);

const SelectPgmBaseTypeId: React.FC<SelectPgmBaseTypeIdProps> = (props) => {
  const {
    searchState,
    setDataInSearch,
  } = props;
  const companyId = getNumberValueFromSerch(searchState.companyId);
  const pgmBaseTypeId = getNumberValueFromSerch(searchState.pgmBaseTypeId);

  React.useEffect(
    () => {
      if (pgmBaseTypeId && companyId && props.pgmBaseList.length) {
        const currentPgmBaseInCompany = filterPgmBase(
          props.pgmBaseList,
          companyId,
        ).some(({ pgm_stores_type_id }) => pgm_stores_type_id === pgmBaseTypeId);

        if (!currentPgmBaseInCompany) {
          const newPartialSearch: any = {
            ...searchState,
            pgmBaseTypeId: null,
          };

          setDataInSearch(newPartialSearch);
        }
      }
    },
    [companyId, pgmBaseTypeId, props.companyList, searchState],
  );

  const pgmBaseOptions = React.useMemo(
    () => {
      if (companyId) {
        return uniqBy(
          filterPgmBase(
            props.pgmBaseList,
            companyId,
          ).map(
            (pgmBase) => ({
              value: pgmBase.pgm_stores_type_id,
              label: pgmBase.pgm_stores_type_name,
              rowData: pgmBase,
            }),
          ).filter(({ value }) => value),
          'value',
        );
      }

      return [];
    },
    [props.pgmBaseList, companyId],
  );

  const setPgmBaseId = React.useCallback(
    (selectedPgmBaseTypeId: number) => {
      const newPartialSearch: any = {
        ...searchState,
      };

      newPartialSearch.pgmBaseTypeId = selectedPgmBaseTypeId;

      setDataInSearch(newPartialSearch);
    },
    [searchState],
  );

  return (
    <InstectionBlockSelect>
      <SelectLabel md={1} sm={1}>
        <h5>
          Тип базы
        </h5>
      </SelectLabel>
      <SelectField md={4} sm={6}>
        <ExtField
          type="select"
          value={pgmBaseTypeId}
          disabled={!companyId}
          label={false}
          options={pgmBaseOptions}
          onChange={setPgmBaseId}
          clearable={false}
        />
      </SelectField>
    </InstectionBlockSelect>
  );
};

export default compose<SelectPgmBaseTypeIdProps, SelectPgmBaseTypeIdOwnProps>(
  withSearch,
  connect<SelectPgmBaseTypeIdStateProps, SelectPgmBaseTypeIdDispatchProps, SelectPgmBaseTypeIdOwnProps, ReduxState>(
    (state) => ({
      companyList: getInspectPgmBase(state).companyList,
      pgmBaseList: getInspectPgmBase(state).pgmBaseList,
    }),
  ),
)(SelectPgmBaseTypeId);
