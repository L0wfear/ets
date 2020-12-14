import * as React from 'react';
import { getInspectCarsCondition } from 'redux-main/reducers/selectors';
import InspectionSelectCompany from 'components/new/pages/inspection/common_components/InspectionSelectCompany';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';

type OwnProps = {};

const SelectCarsConditionCompany: React.FC<OwnProps> = React.memo(
  () => {
    const companyList = etsUseSelector(
      (state) => getInspectCarsCondition(state).companyList,
    );
    return <InspectionSelectCompany companyList={companyList}/>;
  }
);

export default SelectCarsConditionCompany;
