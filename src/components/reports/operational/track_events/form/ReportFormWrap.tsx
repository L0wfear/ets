import * as React from 'react';
// import LoadingComponent from 'components/ui/PreloaderMainPage';
// import loadable from 'loadable-components';

import { DivNone } from 'global-styled/global-styled';
import ReportForm from 'components/reports/operational/track_events/form/ReportForm';

/*
const ReportForm = loadable(
  () => import(/* webpackChunkName: "ReportForm" *//* 'components/reports/operational/track_events/form/ReportForm'), {
  LoadingComponent,
});
*/

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
        <ReportForm
          onFormHide={props.onFormHide}
          coords={props.coords}
        />
      )
      :
      ( <DivNone /> )
    )
  }
}

export default ReportFormWrap;
