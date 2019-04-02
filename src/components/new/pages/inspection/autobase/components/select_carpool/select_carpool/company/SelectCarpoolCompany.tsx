import * as React from 'react';
import { SelectLabel, InstectionBlockSelect, SelectField } from 'components/new/pages/inspection/autobase/components/select_carpool/styled/InspectionAutobaseSelectCarpoolStyled';
import { ExtField } from 'components/ui/new/field/ExtField';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { getInspectAutobase } from 'redux-main/reducers/selectors';
import { IStateCompany } from 'redux-main/reducers/modules/company/@types';

type SelectCarpoolCompanyStateProps = {
  companyList: IStateCompany['companyList'];
};
type SelectCarpoolCompanyDispatchProps = {};
type SelectCarpoolCompanyOwnProps = {};

type SelectCarpoolCompanyMergeProps = (
  SelectCarpoolCompanyStateProps
  & SelectCarpoolCompanyDispatchProps
  & SelectCarpoolCompanyOwnProps
);
type SelectCarpoolCompanyProps = (
  SelectCarpoolCompanyMergeProps
  & WithSearchProps
);

const SelectCarpoolCompany: React.FC<SelectCarpoolCompanyProps> = (props) => {
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
            label: company.company_name,
            rowData: company,
          }),
        ).filter(({ value }) => value)
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
      <SelectLabel md={1} sm={1}>
          <h5>
            Организация
          </h5>
        </SelectLabel>
        <SelectField md={4} sm={6}>
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

export default compose<SelectCarpoolCompanyProps, SelectCarpoolCompanyOwnProps>(
  withSearch,
  connect<SelectCarpoolCompanyStateProps, SelectCarpoolCompanyDispatchProps, SelectCarpoolCompanyOwnProps, ReduxState>(
    (state) => ({
      companyList: getInspectAutobase(state).companyList,
    }),
  ),
)(SelectCarpoolCompany);
