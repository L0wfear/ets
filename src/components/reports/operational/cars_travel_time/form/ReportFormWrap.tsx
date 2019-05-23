import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';

const ReportForm = React.lazy(() => (
  import(/* webpackChunkName: "ReportForm" */ 'components/reports/operational/cars_travel_time/form/ReportForm')
));

export type CarTravelTimeSelectedElement = {
  car_id: number | null;
  carpool_events: {
    date: string;
    events: string[];
  }[];
  carpool_events_for_xls: string | null;
  carpool_time: string | null;
  cars_func_type_name: string | null;
  company_name: string | null;
  distance_mission: number | null;
  distance_out_mission: number | null;
  gov_number: string | null;
  gps_code: string | null;
  has_mkad: false
  okrug_name: string | null;
  parking_time: string | null;
  parking_time_out_mission: string | null;
  rowNumber: null
  travel_time_in_mission: string | null;
  travel_time_out_mission: string | null;
  _uniq_field: 1
};

type PropsReportFormWrap = {
  showForm: boolean;
  onFormHide: () => any;
  date_from: string;
  date_to: string;
  selectedElement: CarTravelTimeSelectedElement;
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
