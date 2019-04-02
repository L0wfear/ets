import * as React from 'react';
import { compose } from 'recompose';
import { ReduxState } from 'redux-main/@types/state';
import { connect, HandleThunkActionCreator } from 'react-redux';
import SelectPgmBaseOkrug from './select/okrug/SelectPgmBaseOkrug';
import inspectionPgmBaseActions from 'redux-main/reducers/modules/inspect/pgm_base/inspect_pgm_base_actions';
import SelectPgmBaseCompany from './select/company/SelectPgmBaseCompany';
import SelectPgmBase from './select/pgm_store/SelectPgmBase';

type InspectionPgmBaseSelectCarpoolStateProps = {};
type InspectionPgmBaseSelectCarpoolDispatchProps = {
  actionGetAndSetInStoreCompany: HandleThunkActionCreator<typeof inspectionPgmBaseActions.actionGetAndSetInStoreCompany>;
  actionGetAndSetInStorePgmBase: HandleThunkActionCreator<typeof inspectionPgmBaseActions.actionGetAndSetInStorePgmBase>;
  actionResetCompanyAndCarpool: HandleThunkActionCreator<typeof inspectionPgmBaseActions.actionResetCompanyAndCarpool>;
};
type InspectionPgmBaseSelectCarpoolOwnProps = {
  loadingPage: string;
};
type InspectionPgmBaseSelectCarpoolMergedProps = (
  InspectionPgmBaseSelectCarpoolStateProps
  & InspectionPgmBaseSelectCarpoolDispatchProps
  & InspectionPgmBaseSelectCarpoolOwnProps
);
type InspectionPgmBaseSelectCarpoolProps = (
  InspectionPgmBaseSelectCarpoolMergedProps
);

const InspectionPgmBaseSelectData: React.FC<InspectionPgmBaseSelectCarpoolProps> = (props) => {
  React.useEffect(
    () => {
      props.actionGetAndSetInStoreCompany({}, { page: props.loadingPage });
      props.actionGetAndSetInStorePgmBase({}, { page: props.loadingPage });

      return () => {
        props.actionResetCompanyAndCarpool();
      };
    },
    [],
  );

  return (
    <>
      <SelectPgmBaseOkrug />
      <SelectPgmBaseCompany />
      <SelectPgmBase />
    </>
  );
};

export default compose<InspectionPgmBaseSelectCarpoolProps, InspectionPgmBaseSelectCarpoolOwnProps>(
  connect<InspectionPgmBaseSelectCarpoolStateProps, InspectionPgmBaseSelectCarpoolDispatchProps, InspectionPgmBaseSelectCarpoolOwnProps, InspectionPgmBaseSelectCarpoolMergedProps, ReduxState>(
    null,
    (dispatch: any) => ({
      actionGetAndSetInStoreCompany: (...arg) => (
        dispatch(
          inspectionPgmBaseActions.actionGetAndSetInStoreCompany(...arg),
        )
      ),
      actionGetAndSetInStorePgmBase: (...arg) => (
        dispatch(
          inspectionPgmBaseActions.actionGetAndSetInStorePgmBase(...arg),
        )
      ),
      actionResetCompanyAndCarpool: (...arg) => (
        dispatch(
          inspectionPgmBaseActions.actionResetCompanyAndCarpool(...arg),
        )
      ),
    }),
    null,
    {
      pure: false, // для react-router
    },
  ),
)(InspectionPgmBaseSelectData);
