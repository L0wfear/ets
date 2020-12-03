import * as React from 'react';
import { uniqBy } from 'lodash';
import { SelectLabel, InstectionBlockSelect } from 'components/new/pages/inspection/autobase/components/select_carpool/styled/InspectionAutobaseSelectCarpoolStyled';
import { SelectField } from 'components/new/pages/inspection/pgm_base/components/select_pgm_store/styled/InspectionPgmBaseSelectCarpoolStyled';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { IStateCompany } from 'redux-main/reducers/modules/company/@types';

type InspectionSelectOkrugStateProps = {
  companyList: IStateCompany['companyList'];
};
type InspectionSelectOkrugDispatchProps = {};
type InspectionSelectOkrugOwnProps = {};

type InspectionSelectOkrugMergeProps = (
  InspectionSelectOkrugStateProps
  & InspectionSelectOkrugDispatchProps
  & InspectionSelectOkrugOwnProps
);
type InspectionSelectOkrugProps = (
  InspectionSelectOkrugMergeProps
  & WithSearchProps
);
 
const InspectionSelectOkrug: React.FC<InspectionSelectOkrugProps> = (props) => {
  const {
    searchState,
    setDataInSearch,
  } = props;
  const okrugId = getNumberValueFromSerch(searchState.okrugId);

  const okrugOptions = React.useMemo(
    () => {
      return uniqBy(props.companyList, 'okrug_id').map((company) => ({
        value: company.okrug_id,
        label: company.okrug_name,
        rowData: company,
      })).filter(({ value }) => value);
    },
    [props.companyList],
  );

  const setOkrugId = React.useCallback(
    (selectedOkrugId: number) => {
      const newPartialSearch: any = {
        ...searchState,
      };

      newPartialSearch.okrugId = selectedOkrugId;

      setDataInSearch(newPartialSearch);
    },
    [searchState, props.match.params],
  );

  return (
    <InstectionBlockSelect>
      <SelectLabel md={3} sm={1}>
        <h5>
          Округ
        </h5>
      </SelectLabel>
      <SelectField md={9} sm={6}>
        <ExtField
          type="select"
          label={false}
          value={okrugId}
          options={okrugOptions}
          onChange={setOkrugId}
          clearable={false}
        />
      </SelectField>
    </InstectionBlockSelect>
  );
};

export default withSearch<InspectionSelectOkrugMergeProps>(InspectionSelectOkrug);
