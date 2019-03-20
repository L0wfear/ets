import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import { DivNone } from 'global-styled/global-styled';
import { PropsMaintenanceRateFormWrap } from 'components/directories/normative/maintenance_rate/MaintenanceRateForm/@types/MaintenanceRate.h';

const MaintenanceRateForm = React.lazy(() => (
  import(/* webpackChunkName: "maintenance_rate_form" */'components/directories/normative/maintenance_rate/MaintenanceRateForm/MaintenanceRateForm')
));

class MaintenanceRateFormWrap extends React.Component<PropsMaintenanceRateFormWrap, {}> {
  render() {
    const { showForm, ...props } = this.props;
    const page = props.loadingPageName || props.page;
    const path = `${props.path ? `${props.path}-` : ''}maintenance-rate-form`;

    return showForm ?
      (
        <React.Suspense fallback={<LoadingComponent />}>
          <MaintenanceRateForm
            element={props.element}
            handleHide={props.onFormHide}

            type={props.type}
            page={page}
            path={path}
          />
        </React.Suspense>
      )
      :
      (
        <DivNone />
      );
  }
}

export default MaintenanceRateFormWrap;
