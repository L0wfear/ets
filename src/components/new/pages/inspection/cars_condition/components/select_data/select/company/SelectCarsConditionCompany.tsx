import * as React from 'react';
import { SelectLabel, InstectionBlockSelect } from 'components/new/pages/inspection/autobase/components/select_carpool/styled/InspectionAutobaseSelectCarpoolStyled';
import { SelectField } from '../../styled/InspectionCarsConditionStyled';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { getInspectCarsCondition } from 'redux-main/reducers/selectors';
import { IStateCompany } from 'redux-main/reducers/modules/company/@types';

type SelectCarsConditionCompanyStateProps = {
  companyList: IStateCompany['companyList'];
};
type SelectCarsConditionCompanyDispatchProps = {};
type SelectCarsConditionCompanyOwnProps = {};

type SelectCarsConditionCompanyMergeProps = (
  SelectCarsConditionCompanyStateProps
  & SelectCarsConditionCompanyDispatchProps
  & SelectCarsConditionCompanyOwnProps
);
type SelectCarsConditionCompanyProps = (
  SelectCarsConditionCompanyMergeProps
  & WithSearchProps
);

const SelectCarsConditionCompany: React.FC<SelectCarsConditionCompanyProps> = (props) => {
  const {
    searchState,
    setDataInSearch,
  } = props;
  const companyId = getNumberValueFromSerch(searchState.companyId);

  const compnayOptions = React.useMemo(
    () => {
      return (
        props.companyList.map(
          (company) => ({
            value: company.company_id,
            label: company.short_name,
            rowData: company,
          }),
        ).filter(
          ({ value }) => value,
        )
      );
    },
    [props.companyList],
  );

  const setCompanyId = React.useCallback(
    (selectedCompanyId: number) => {
      const newPartialSearch: any = {
        ...searchState,
      };

      newPartialSearch.companyId = selectedCompanyId;

      setDataInSearch(newPartialSearch);
    },
    [searchState],
  );

  return (
    <InstectionBlockSelect>
      <SelectLabel md={3} sm={2}>
          <h5>
            Организация
          </h5>
        </SelectLabel>
        <SelectField md={9} sm={6}>
          <ExtField
            type="select"
            label={false}
            value={companyId}
            options={compnayOptions}
            onChange={setCompanyId}
            clearable={false}
          />
        </SelectField>
      </InstectionBlockSelect>
  );
};

export default compose<SelectCarsConditionCompanyProps, SelectCarsConditionCompanyOwnProps>(
  connect<SelectCarsConditionCompanyStateProps, SelectCarsConditionCompanyDispatchProps, SelectCarsConditionCompanyOwnProps, ReduxState>(
    (state) => ({
      companyList: getInspectCarsCondition(state).companyList,
    }),
  ),
  withSearch,
)(SelectCarsConditionCompany);
