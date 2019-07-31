import * as React from 'react';
import { SelectLabel, InstectionBlockSelect, SelectField } from 'components/new/pages/inspection/autobase/components/select_carpool/styled/InspectionAutobaseSelectCarpoolStyled';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { compose } from 'recompose';
import { getInspectAutobase } from 'redux-main/reducers/selectors';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';

type SelectCarpoolCompanyProps = (
  {} &
  WithSearchProps
);

const SelectCarpoolCompany: React.FC<SelectCarpoolCompanyProps> = (props) => {
  const {
    searchState,
    setDataInSearch,
  } = props;

  const companyList = etsUseSelector(
    (state) => getInspectAutobase(state).companyList,
  );

  const companyId = getNumberValueFromSerch(searchState.companyId);

  const compnayOptions = React.useMemo(
    () => {
      return (
        companyList.map(
          (company) => ({
            value: company.company_id,
            label: company.short_name,
            rowData: company,
          }),
        ).filter(({ value }) => value)
      );
    },
    [companyList],
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

  return React.useMemo(
    () => (
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
    ),
    [
      companyId,
      compnayOptions,
      setCompanyId,
    ],
  );
};

export default compose<SelectCarpoolCompanyProps, {}>(
  withSearch,
)(SelectCarpoolCompany);
