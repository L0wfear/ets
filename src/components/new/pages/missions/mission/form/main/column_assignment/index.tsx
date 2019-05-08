import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';
import { PropsColumnAssignmentFormLazy } from './@types/index.h';

const ColumnAssignmentForm = React.lazy(() => (
  import(/* webpackChunkName: "column_assignment" */ 'components/new/pages/missions/mission/form/main/column_assignment/ColumnAssignmentForm')
));

const ColumnAssignmentFormLazy: React.FC<PropsColumnAssignmentFormLazy> = (props) => {
  return props.showForm ?
    (
      <ErrorBoundaryForm>
        <React.Suspense fallback={<LoadingComponent />}>
          <ColumnAssignmentForm
            assign_to_waybill={props.assign_to_waybill}
            car_ids={props.car_ids}
            handleChangeAssignToWaybill={props.handleChangeAssignToWaybill}
            hideColumnAssignment={props.hideColumnAssignment}
            handleSubmit={props.handleSubmit}

            page={props.page}
            path={props.path}
          />
        </React.Suspense>
      </ErrorBoundaryForm>
    )
    :
    (
      <DivNone />
    );
};

export default ColumnAssignmentFormLazy;
