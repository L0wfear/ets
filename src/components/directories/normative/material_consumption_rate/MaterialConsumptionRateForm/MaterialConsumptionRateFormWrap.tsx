import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import { DivNone } from 'global-styled/global-styled';
import { PropsMaterialConsumptionRateFormWrap } from 'components/directories/normative/material_consumption_rate/MaterialConsumptionRateForm/@types/MaterialConsumptionRate.h';

const MaterialConsumptionRateForm = React.lazy(() => (
  import(/* webpackChunkName: "material_consumption_rate_form" */'components/directories/normative/material_consumption_rate/MaterialConsumptionRateForm/MaterialConsumptionRateForm')
));

class MaterialConsumptionRateFormWrap extends React.Component<PropsMaterialConsumptionRateFormWrap, {}> {
  render() {
    const { showForm, ...props } = this.props;
    const page = props.loadingPageName || props.page;
    const path = `${props.path ? `${props.path}-` : ''}consumption-rate-form`;

    return showForm ?
      (
        <React.Suspense fallback={<LoadingComponent />}>
          <MaterialConsumptionRateForm
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

export default MaterialConsumptionRateFormWrap;
