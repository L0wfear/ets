import * as React from 'react';
import { getInspectCarsCondition } from 'redux-main/reducers/selectors';
import InspectionSelectOkrug from 'components/new/pages/inspection/common_components/InspectionSelectOkrug';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';

type OwnProps = {};

const SelectCarsConditionOkrug: React.FC<OwnProps> = React.memo(
  () => {
    const companyList = etsUseSelector(
      (state) => getInspectCarsCondition(state).companyList,
    );
    return <InspectionSelectOkrug companyList={companyList}/>;
  }
);

export default SelectCarsConditionOkrug;
