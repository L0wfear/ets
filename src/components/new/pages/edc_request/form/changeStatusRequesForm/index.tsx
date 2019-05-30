import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';
import { OneRegistryData } from 'components/new/ui/registry/module/registry';
import { compose } from 'recompose';
import {
  connect,
  // HandleThunkActionCreator
} from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';

const ChangeStatusRequesForm = React.lazy(() =>
  import(/* webpackChunkName: "request_history" */ 'components/new/pages/edc_request/form/changeStatusRequesForm/ChangeStatusRequesForm'),
);

export type ChangeStatusRequesFormLazyDispatchProps = {
};

export type ChangeStatusRequesFormLazyOwnProps = {
  checkedRows: Mission | DutyMission | OneRegistryData['list']['data']['checkedRows'];
  onFormHide: (isSubmitted: boolean | any, result?: any) => any;
};

type ChangeStatusRequesFormLazyProps = (
  ChangeStatusRequesFormLazyOwnProps
  & ChangeStatusRequesFormLazyDispatchProps
);

const ChangeStatusRequesFormLazy: React.FC<ChangeStatusRequesFormLazyProps> = React.memo(
  (props) => {

    const page = '';
    const path = '';

    return (
      props.checkedRows && (
        <ErrorBoundaryForm>
          <React.Suspense fallback={<LoadingComponent />}>
            <ChangeStatusRequesForm
              checkedRows={props.checkedRows}
              onFormHide={props.onFormHide}

              page={page}
              path={path}
            />
          </React.Suspense>
        </ErrorBoundaryForm>
      )
    );
  },
);

export default compose<any, any>(
  connect<null, ChangeStatusRequesFormLazyDispatchProps, any, ReduxState>(
    null,
    (dispatch: any) => ({
    }),
  ),
)(ChangeStatusRequesFormLazy);
