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
import { IStateCompany, Company } from 'redux-main/reducers/modules/company/@types';

type SelectPgmBaseCompanyStateProps = {
  companyList: IStateCompany['companyList'];
};
type SelectPgmBaseCompanyDispatchProps = {};
type SelectPgmBaseCompanyOwnProps = {};

type SelectPgmBaseCompanyMergeProps = (
  SelectPgmBaseCompanyStateProps
  & SelectPgmBaseCompanyDispatchProps
  & SelectPgmBaseCompanyOwnProps
);
type SelectPgmBaseCompanyProps = (
  SelectPgmBaseCompanyMergeProps
  & WithSearchProps
);

const filterCompanyByOkrug = (companyList: Company[], okrugId: number) => (
  companyList.filter(({ okrug_id }) => okrug_id === okrugId)
);

const SelectPgmBaseCompany: React.FC<SelectPgmBaseCompanyProps> = (props) => {
  const {
    searchState,
    setDataInSearch,
  } = props;
  const okrugId = getNumberValueFromSerch(searchState.okrugId);
  const companyId = getNumberValueFromSerch(searchState.companyId);

  React.useEffect(
    () => {
      if (okrugId && companyId && props.companyList.length) {
        const currentCompanyInOkrug = filterCompanyByOkrug(
          props.companyList,
          okrugId,
        ).some(({ company_id }) => company_id === companyId);

        if (!currentCompanyInOkrug) {
          const newPartialSearch: any = {
            ...searchState,
            companyId: null,
          };

          setDataInSearch(newPartialSearch);
        }
      }
    },
    [okrugId, companyId, props.companyList, searchState],
  );

  const compnayOptions = React.useMemo(
    () => {
      if (okrugId) {
        return filterCompanyByOkrug(
          props.companyList,
          okrugId,
        ).map(
          (company) => ({
            value: company.company_id,
            label: company.company_name,
            rowData: company,
          }),
        ).filter(({ value }) => value);
      }

      return [];
    },
    [props.companyList, okrugId],
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
            disabled={!okrugId}
          />
        </SelectField>
      </InstectionBlockSelect>
  );
};

export default compose<SelectPgmBaseCompanyProps, SelectPgmBaseCompanyOwnProps>(
  connect<SelectPgmBaseCompanyStateProps, SelectPgmBaseCompanyDispatchProps, SelectPgmBaseCompanyOwnProps, SelectPgmBaseCompanyMergeProps, ReduxState>(
    (state) => ({
      companyList: getInspectPgmBase(state).companyList,
    }),
    null,
    null,
    {
      pure: false,  // для react-router
    },
  ),
  withSearch,
)(SelectPgmBaseCompany);
