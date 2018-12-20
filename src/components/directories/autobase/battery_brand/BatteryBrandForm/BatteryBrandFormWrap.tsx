import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';

import { PropsBatteryBrandFormWrap } from 'components/directories/autobase/battery_brand/BatteryBrandForm/@types/BatteryBrand.h';

const BatteryBrandFrom = React.lazy(() => (
  import(/* webpackChunkName: "battery_brand_form" */ 'components/directories/autobase/battery_brand/BatteryBrandForm/BatteryBrandForm')
));

class BatteryBrandFormWrap extends React.Component<PropsBatteryBrandFormWrap, {}> {
  render() {
    const { showForm, ...props } = this.props;
    const page = props.loadingPageName || props.page;
    const path = `${props.path ? `${props.path}-` : ''}battery-brand-form`;

    return showForm ?
      (
        <ErrorBoundaryForm>
          <React.Suspense fallback={<LoadingComponent />}>
            <BatteryBrandFrom
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

export default BatteryBrandFormWrap;
