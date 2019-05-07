import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';

const ReportForm = React.lazy(() => (
  import(/* webpackChunkName: "ReportForm" */ 'components/reports/operational/cars_travel_time_new/form/ReportForm')
));

type PropsReportFormWrap = {
  showForm: boolean;
  onFormHide: () => any;
  date_from: string;
  date_to: string;
  selectedElement: any; // <<< затипизировать
};

class ReportFormWrap extends React.PureComponent<PropsReportFormWrap, {}> {
  render() {
    const {
      showForm,
      ...props
    } = this.props;

    return (
      showForm ?
      (
        <ErrorBoundaryForm>
          <React.Suspense fallback={<LoadingComponent />}>
            <ReportForm
              onFormHide={props.onFormHide}
              date_from={props.date_from}
              date_to={props.date_to}
              selectedElement={props.selectedElement}
            />
          </React.Suspense>
        </ErrorBoundaryForm>
      )
      :
      ( <DivNone /> )
    );
  }
}

export default ReportFormWrap;
