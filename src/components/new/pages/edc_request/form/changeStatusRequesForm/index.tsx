import * as React from 'react';
import LoadingComponent from 'components/old/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';
// import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
// import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';
// import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import { compose } from 'recompose';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import withElementFromArray from 'components/new/utils/hoc/with_element_from_array/withElementFromArray';

const ChangeStatusRequesForm = React.lazy(() =>
  import(/* webpackChunkName: "request_history" */ 'components/new/pages/edc_request/form/changeStatusRequesForm/ChangeStatusRequesForm'),
);

export type ChangeStatusRequesFormLazyDispatchProps = {
};

export type ChangeStatusRequesFormLazyOwnProps = {
  onHide: (isSubmitted: boolean | any, result?: any) => any;

  element: OneRegistryData['list']['data']['selectedRow'];
};

type ChangeStatusRequesFormLazyProps = (
  ChangeStatusRequesFormLazyOwnProps
  & ChangeStatusRequesFormLazyDispatchProps
);

const ChangeStatusRequesFormLazy: React.FC<ChangeStatusRequesFormLazyProps> = React.memo(
  (props) => {
    const page = 'ChangeStatusRequesForm';
    const path = 'ChangeStatusRequesForm';

    return (
      <ErrorBoundaryForm>
        <React.Suspense fallback={<LoadingComponent />}>
          <ChangeStatusRequesForm
            onFormHide={props.onHide}
            element={props.element}

            page={page}
            path={path}
          />
        </React.Suspense>
      </ErrorBoundaryForm>
    );
  },
);

export default compose<ChangeStatusRequesFormLazyProps, any>(
  withElementFromArray,
)(ChangeStatusRequesFormLazy);
