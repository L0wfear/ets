import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import { DivNone } from 'global-styled/global-styled';
import { PropsMaterialConsumptionRateFormLazy } from 'components/new/pages/nsi/regulatory_indicator/pages/material_consumption_rate/form/@types/MaterialConsumptionRateForm';
import withFormRegistrySearch from 'components/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

const MaterialConsumptionRateForm = React.lazy(() => (
  import(/* webpackChunkName: "material_consumption_rate_form" */ 'components/new/pages/nsi/regulatory_indicator/pages/material_consumption_rate/form/MaterialConsumptionRateForm')
));

const MaterialConsumptionRateFormLazy: React.FC<PropsMaterialConsumptionRateFormLazy> = React.memo(
  (props) => {
    const page = props.registryKey || props.page;
    const path = `${props.path ? `${props.path}-` : ''}consumption-rate-form`;

    return (
      props.element ?
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
        : (
          <DivNone />
        )
    );
  },
);

export default withFormRegistrySearch({})(MaterialConsumptionRateFormLazy);
