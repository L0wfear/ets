import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import { DivNone } from 'global-styled/global-styled';
import { PropsFuelRateFormWrap } from 'components/directories/normative/fuel_rates/FuelRateForm/@types/FuelRate.h';

// const FuelRateForm = enhanceWithPermissions(BaseFuelRateForm);

const FuelRateForm = React.lazy(() => (
  import(/* webpackChunkName: "fuel_rate_form" */'components/directories/normative/fuel_rates/FuelRateForm/FuelRateForm')
));

class FuelRateFormWrap extends React.Component<PropsFuelRateFormWrap, {}> {
  render() {
    const { showForm, ...props } = this.props;
    const page = props.loadingPageName || props.page;
    const path = `${props.path ? `${props.path}-` : ''}fuel-rate-form`;

    return showForm ?
      (
        <React.Suspense fallback={<LoadingComponent />}>
          <FuelRateForm
            element={props.element}
            handleHide={props.onFormHide}

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

export default FuelRateFormWrap;
