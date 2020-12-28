import * as React from 'react';
import { getInspectPgmBase } from 'redux-main/reducers/selectors';
import InspectionSelectOkrug from 'components/new/pages/inspection/common_components/InspectionSelectOkrug';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';

type OwnProps = {};

const SelectPgmBaseOkrug: React.FC<OwnProps> = React.memo(
  () => {
    const companyList = etsUseSelector(
      (state) => getInspectPgmBase(state).companyList,
    );
    return <InspectionSelectOkrug companyList={companyList}/>;
  }
);

export default SelectPgmBaseOkrug;
