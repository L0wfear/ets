import * as React from 'react';
import LoadingComponent from 'components/old/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

const MissionInfoForm = React.lazy(() => (
  import(/* webpackChunkName: "mission_info_form" */ 'components/new/ui/mission_info_form/MissionInfoForm')
));

type PropsReportFormWrap = {
  onFormHide: () => any;
  element: any;
};

const ReportFormWrap: React.FC<PropsReportFormWrap> = React.memo(
  ({ element, onFormHide }) => {

    return (
      <ErrorBoundaryForm>
        <React.Suspense fallback={<LoadingComponent />}>
          <MissionInfoForm
            onFormHide={onFormHide}
            element={element}
          />
        </React.Suspense>
      </ErrorBoundaryForm>
    );

  },
);

export default ReportFormWrap;
