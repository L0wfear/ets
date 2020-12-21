import * as React from 'react';
import { SelectLabel, InstectionBlockSelect } from 'components/new/pages/inspection/autobase/components/select_carpool/styled/InspectionAutobaseSelectCarpoolStyled';
import { SelectField } from 'components/new/pages/inspection/pgm_base/components/select_pgm_store/styled/InspectionPgmBaseSelectCarpoolStyled';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { IStateCompany, Company } from 'redux-main/reducers/modules/company/@types';

type InspectionSelectCompanyStateProps = {
  companyList: IStateCompany['companyList'];
};
type InspectionSelectCompanyDispatchProps = {};
type InspectionSelectCompanyOwnProps = {};

type InspectionSelectCompanyMergeProps = (
  InspectionSelectCompanyStateProps
  & InspectionSelectCompanyDispatchProps
  & InspectionSelectCompanyOwnProps
);
type InspectionSelectCompanyProps = (
  InspectionSelectCompanyMergeProps
  & WithSearchProps
);

const filterCompanyByOkrug = (companyList: Array<Company>, okrugId: number) => (
  companyList.filter(({ okrug_id }) => okrug_id === okrugId)
);

const InspectionSelectCompany: React.FC<InspectionSelectCompanyProps> = (props) => {
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

  const companyOptions = React.useMemo(
    () => {
      if (okrugId) {
        return filterCompanyByOkrug(
          props.companyList,
          okrugId,
        ).map(
          (company) => ({
            value: company.company_id,
            label: company.short_name,
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
    [searchState, props.match.params],
  );

  return (
    <InstectionBlockSelect>
      <SelectLabel md={3} sm={1}>
        <h5>
            Организация
        </h5>
      </SelectLabel>
      <SelectField md={9} sm={6}>
        <ExtField
          type="select"
          label={false}
          value={companyId}
          options={companyOptions}
          onChange={setCompanyId}
          clearable={false}
          disabled={!okrugId}
        />
      </SelectField>
    </InstectionBlockSelect>
  );
};

export default withSearch<InspectionSelectCompanyMergeProps>(InspectionSelectCompany);
