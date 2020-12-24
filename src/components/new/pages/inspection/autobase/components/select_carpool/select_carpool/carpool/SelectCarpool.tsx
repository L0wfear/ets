import * as React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { SelectLabel, InstectionBlockSelect, SelectField } from 'components/new/pages/inspection/autobase/components/select_carpool/styled/InspectionAutobaseSelectCarpoolStyled';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { ReduxState } from 'redux-main/@types/state';
import { getInspectAutobase } from 'redux-main/reducers/selectors';
import { IStateInspectAutobase } from 'redux-main/reducers/modules/inspect/autobase/@types/inspect_autobase';
import { Carpool } from 'redux-main/reducers/modules/geoobject/actions_by_type/carpool/@types';

type SelectCarpoolStateProps = {
  companyList: IStateInspectAutobase['companyList'];
  carpoolList: IStateInspectAutobase['carpoolList'];
};
type SelectCarpoolDispatchProps = {};
type SelectCarpoolOwnProps = {};

type SelectCarpoolMergeProps = (
  SelectCarpoolStateProps
  & SelectCarpoolDispatchProps
  & SelectCarpoolOwnProps
);
type SelectCarpoolProps = (
  SelectCarpoolMergeProps
  & WithSearchProps
);

const filterPgmBaseByCompany = (carpoolList: Array<Carpool>, companyId: number) => (
  carpoolList.filter(({ contractor_id }) => contractor_id === companyId)
);

const SelectCarpool: React.FC<SelectCarpoolProps> = (props) => {
  const {
    searchState,
    setDataInSearch,
  } = props;
  const companyId = getNumberValueFromSerch(searchState.companyId);
  const carpoolId = getNumberValueFromSerch(searchState.carpoolId);

  React.useEffect(
    () => {
      if (carpoolId && props.carpoolList.length) {
        const currentCarpoolInCompany = filterPgmBaseByCompany(
          props.carpoolList,
          companyId,
        ).some(({ id }) => id === carpoolId);

        if (!currentCarpoolInCompany) {
          const newPartialSearch: any = {
            ...searchState,
            carpoolId: null,
          };

          setDataInSearch(newPartialSearch);
        }
      }
    },
    [companyId, carpoolId, props.companyList, searchState, props.match.params],
  );

  const carpoolOptions = React.useMemo(
    () => {
      if (companyId) {
        return filterPgmBaseByCompany(
          props.carpoolList,
          companyId,
        ).map(
          (rowData) => ({
            value: rowData.id,
            label: rowData.address,
            rowData,
          }),
        ).filter(({ value }) => value);
      }

      return [];
    },
    [props.carpoolList, companyId],
  );

  const setCarpoolId = React.useCallback(
    (selectedCarpoolId: number) => {
      const newPartialSearch: any = {
        ...searchState,
      };

      newPartialSearch.carpoolId = selectedCarpoolId;

      setDataInSearch(newPartialSearch);
    },
    [searchState, props.match.params],
  );

  return (
    <InstectionBlockSelect>
      <SelectLabel md={3} sm={1}>
        <h5>
        Автобаза
        </h5>
      </SelectLabel>
      <SelectField md={9} sm={6}>
        <ExtField
          type="select"
          value={carpoolId}
          disabled={!companyId}
          label={false}
          options={carpoolOptions}
          onChange={setCarpoolId}
          clearable={false}
        />
      </SelectField>
    </InstectionBlockSelect>
  );
};

export default compose<SelectCarpoolProps, SelectCarpoolOwnProps>(
  withSearch,
  connect<SelectCarpoolStateProps, SelectCarpoolDispatchProps, SelectCarpoolOwnProps, ReduxState>(
    (state) => ({
      companyList: getInspectAutobase(state).companyList,
      carpoolList: getInspectAutobase(state).carpoolList,
    }),
  ),
)(SelectCarpool);
