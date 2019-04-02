import * as React from 'react';
import { SelectLabel, InstectionBlockSelect } from 'components/new/pages/inspection/autobase/components/select_carpool/styled/InspectionAutobaseSelectCarpoolStyled';
import { SelectField } from '../../styled/InspectionPgmBaseSelectCarpoolStyled';
import { ExtField } from 'components/ui/new/field/ExtField';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { compose } from 'recompose';
import { connect } from 'react-redux';
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

const filterPgmBaseByCompany = (pgmBaseList: PgmStore[], companyId: number) => (
  pgmBaseList.filter(({ company_id }) => company_id === companyId)
);

const SelectPgmBase: React.FC<SelectPgmBaseProps> = (props) => {
  const {
    searchState,
    setDataInSearch,
  } = props;
  const companyId = getNumberValueFromSerch(searchState.companyId);
  const pgmBaseId = getNumberValueFromSerch(searchState.pgmBaseId);

  React.useEffect(
    () => {
      if (pgmBaseId && companyId && props.pgmBaseList.length) {
        const currentPgmBaseInCompany = filterPgmBaseByCompany(
          props.pgmBaseList,
          companyId,
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
    [companyId, pgmBaseId, props.companyList, searchState],
  );

  const pgmBaseOptions = React.useMemo(
    () => {
      if (companyId) {
        return filterPgmBaseByCompany(
          props.pgmBaseList,
          companyId,
        ).map(
          (pgmBase) => ({
            value: pgmBase.id,
            label: `${pgmBase.address} (${pgmBase.pgm_stores_type_name})`,
            rowData: pgmBase,
          }),
        ).filter(({ value }) => value);
      }

      return [];
    },
    [props.pgmBaseList, companyId],
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
          Адрес и тип базы
        </h5>
      </SelectLabel>
      <SelectField md={4} sm={6}>
        <ExtField
          type="select"
          value={pgmBaseId}
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

export default compose<SelectPgmBaseProps, SelectPgmBaseOwnProps>(
  withSearch,
  connect<SelectPgmBaseStateProps, SelectPgmBaseDispatchProps, SelectPgmBaseOwnProps, ReduxState>(
    (state) => ({
      companyList: getInspectPgmBase(state).companyList,
      pgmBaseList: getInspectPgmBase(state).pgmBaseList,
    }),
  ),
)(SelectPgmBase);
