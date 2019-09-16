import * as React from 'react';
import { uniqBy } from 'lodash';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { SelectLabel, InstectionBlockSelect } from 'components/new/pages/inspection/autobase/components/select_carpool/styled/InspectionAutobaseSelectCarpoolStyled';
import { SelectField } from '../../styled/InspectionPgmBaseSelectCarpoolStyled';
import ExtField from 'components/@next/@ui/renderFields/Field';
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

const filterPgmBase = (pgmBaseList: PgmStore[], companyId: number, pgmAddress: string) => (
  pgmBaseList.filter(({ company_id, address }) => company_id === companyId && address === pgmAddress)
);

const SelectPgmBaseTypeId: React.FC<SelectPgmBaseTypeIdProps> = (props) => {
  const {
    searchState,
    setDataInSearch,
  } = props;
  const companyId = getNumberValueFromSerch(searchState.companyId);
  const pgmAddress = searchState.pgmAddress;
  const pgmBaseId = getNumberValueFromSerch(searchState.pgmBaseId);

  // 32 релиз (выпилить в 33)
  React.useEffect(
    () => {
      if (pgmBaseId && !pgmAddress) {
        setDataInSearch({ pgmBaseId: null, pgmBaseTypeId: null });
      }
    },
    [pgmAddress, pgmBaseId, searchState, props.match.params],
  );

  React.useEffect(
    () => {
      if (pgmBaseId && pgmAddress && props.pgmBaseList.length) {
        const currentPgmBaseInCompany = filterPgmBase(
          props.pgmBaseList,
          companyId,
          pgmAddress,
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
    [companyId, pgmAddress, pgmBaseId, props.companyList, searchState, props.match.params],
  );

  const pgmBaseOptions = React.useMemo(
    () => {
      if (companyId && pgmAddress) {
        return uniqBy(
          filterPgmBase(
            props.pgmBaseList,
            companyId,
            pgmAddress,
          ).map(
            (pgmBase) => ({
              value: pgmBase.id,
              label: pgmBase.pgm_stores_type_name,
              rowData: pgmBase,
            }),
          ).filter(({ value }) => value),
          'value',
        );
      }

      return [];
    },
    [props.pgmBaseList, companyId, pgmAddress],
  );

  const setPgmBaseId = React.useCallback(
    (selectedPgmBaseTypeId: number) => {
      const newPartialSearch: any = {
        ...searchState,
      };

      newPartialSearch.pgmBaseId = selectedPgmBaseTypeId;

      setDataInSearch(newPartialSearch);
    },
    [searchState, props.match.params],
  );

  React.useEffect(
    () => {
      if (pgmBaseOptions.length === 1) {
        const data = pgmBaseOptions[0];
        if (data.value !== pgmBaseId) {
          setPgmBaseId(data.value);
        }
      }
    },
    [setPgmBaseId, pgmBaseOptions, pgmBaseId],
  );

  return (
    <InstectionBlockSelect>
      <SelectLabel md={3} sm={1}>
        <h5>
          Тип базы
        </h5>
      </SelectLabel>
      <SelectField md={9} sm={6}>
        <ExtField
          type="select"
          value={pgmBaseId}
          disabled={!companyId || !pgmAddress}
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
