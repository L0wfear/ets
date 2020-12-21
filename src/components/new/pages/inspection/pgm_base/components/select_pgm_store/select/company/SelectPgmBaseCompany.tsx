import * as React from 'react';
import { getInspectPgmBase } from 'redux-main/reducers/selectors';
import InspectionSelectCompany from 'components/new/pages/inspection/common_components/InspectionSelectCompany';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';

type OwnProps = {};

const SelectPgmBaseCompany: React.FC<OwnProps> = React.memo(
  () => {
    const companyList = etsUseSelector(
      (state) => getInspectPgmBase(state).companyList,
    );
    return <InspectionSelectCompany companyList={companyList}/>;
  }
);

export default SelectPgmBaseCompany;