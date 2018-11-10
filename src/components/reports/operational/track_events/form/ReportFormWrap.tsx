import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';

import { DivNone } from 'global-styled/global-styled';



const ReportForm = React.lazy(() => (
  import(/* webpackChunkName: "ReportForm" */'components/reports/operational/track_events/form/ReportForm')
));

type PropsReportFormWrap = {
  showForm: boolean;
  onFormHide: () => any;
  coords: [number, number];
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
        <React.Suspense fallback={<LoadingComponent />}>
          <ReportForm
            onFormHide={props.onFormHide}
            coords={props.coords}
          />
        </React.Suspense>
      )
      :
      ( <DivNone /> )
    )
  }
}

export default ReportFormWrap;
