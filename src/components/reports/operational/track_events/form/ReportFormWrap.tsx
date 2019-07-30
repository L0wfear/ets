import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

const ReportForm = React.lazy(() => (
  import(/* webpackChunkName: "ReportForm" */ 'components/reports/operational/track_events/form/ReportForm')
));

type PropsReportFormWrap = {
  showForm: boolean;
  onFormHide: () => any;
  coords: [number, number];
};

const ReportFormWrap: React.FC<PropsReportFormWrap> = React.memo(
  (props) => {
    return (
      Boolean(props.showForm) && (
        <ErrorBoundaryForm>
          <React.Suspense fallback={<LoadingComponent />}>
            <ReportForm
              onFormHide={props.onFormHide}
              coords={props.coords}
            />
          </React.Suspense>
        </ErrorBoundaryForm>
      )
    );
  },
);

export default ReportFormWrap;
