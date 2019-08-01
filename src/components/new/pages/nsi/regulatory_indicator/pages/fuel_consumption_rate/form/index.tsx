import * as React from 'react';
import LoadingComponent from 'components/old/ui/PreloaderMainPage';
import { DivNone } from 'global-styled/global-styled';
import { PropsFuelRateFormLazy } from 'components/new/pages/nsi/regulatory_indicator/pages/fuel_consumption_rate/form/@types/FuelConsumptionRateFrom';
import withFormRegistrySearch from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

// const FuelRateForm = enhanceWithPermissions(BaseFuelRateForm);

const FuelRateForm = React.lazy(() => (
  import(/* webpackChunkName: "fuel_consumption_rate_from" */ 'components/new/pages/nsi/regulatory_indicator/pages/fuel_consumption_rate/form/FuelFonsumptionRateForm')
));

const FuelRateFormLazy: React.FC<PropsFuelRateFormLazy> = React.memo(
  (props) => {
    const page = props.registryKey || props.page;
    const path = `${props.path ? `${props.path}-` : ''}fuel-rate-form`;

    return (
      props.element
        ? (
          <React.Suspense fallback={<LoadingComponent />}>
            <FuelRateForm
              element={props.element}
              handleHide={props.onFormHide}

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

export default withFormRegistrySearch({})(FuelRateFormLazy);
