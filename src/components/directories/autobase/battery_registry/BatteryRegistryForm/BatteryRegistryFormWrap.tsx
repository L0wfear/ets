import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';

import { PropsBatteryRegistryFormWrap } from 'components/directories/autobase/battery_registry/BatteryRegistryForm/@types/BatteryRegistry.h';

const BatteryRegistryFrom = React.lazy(() => (
  import(/* webpackChunkName: "battery_registry_form" */ 'components/directories/autobase/battery_registry/BatteryRegistryForm/BatteryRegistryForm')
));

class BatteryRegistryFormWrap extends React.Component<PropsBatteryRegistryFormWrap, {}> {
  render() {
    const { showForm, ...props } = this.props;
    const page = props.loadingPageName || props.page;
    const path = `${props.path ? `${props.path}-` : ''}battery-brand-form`;

    return showForm ?
      (
        <ErrorBoundaryForm>
          <React.Suspense fallback={<LoadingComponent />}>
            <BatteryRegistryFrom
              element={props.element}
              handleHide={props.onFormHide}

              page={page}
              path={path}
            />
          </React.Suspense>
        </ErrorBoundaryForm>
      )
      :
      (
        <DivNone />
      );
  }
}

export default BatteryRegistryFormWrap;
