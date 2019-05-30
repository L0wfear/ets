import * as React from 'react';
import { compose } from 'recompose';
import { ReduxState } from 'redux-main/@types/state';
import { connect, HandleThunkActionCreator } from 'react-redux';
import SelectPgmBaseOkrug from './select/okrug/SelectPgmBaseOkrug';
import inspectionPgmBaseActions from 'redux-main/reducers/modules/inspect/pgm_base/inspect_pgm_base_actions';
import SelectPgmBaseCompany from './select/company/SelectPgmBaseCompany';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import SelectPgmBaseAddress from './select/address/SelectPgmBaseAddress';
import SelectPgmBaseTypeId from './select/pgm_store_type_id/SelectPgmBaseTypeId';

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
      <SelectPgmBaseTypeId />
      <SelectPgmBaseAddress />
    </>
  );
};

export default compose<InspectionPgmBaseSelectCarpoolProps, InspectionPgmBaseSelectCarpoolOwnProps>(
  withSearch,
  connect<InspectionPgmBaseSelectCarpoolStateProps, InspectionPgmBaseSelectCarpoolDispatchProps, InspectionPgmBaseSelectCarpoolOwnProps, ReduxState>(
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
  ),
)(InspectionPgmBaseSelectData);
