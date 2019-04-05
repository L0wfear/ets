import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';

import { PropsBatteryBrandFormLazy } from 'components/new/pages/nsi/autobase/pages/battery_brand/form/@types/BatteryBrandForm';
import withFormRegistrySearch from 'components/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

const BatteryBrandFrom = React.lazy(() => (
  import(/* webpackChunkName: "battery_brand_form" */ 'components/new/pages/nsi/autobase/pages/battery_brand/form/BatteryBrandForm')
));

const BatteryBrandFormLazy: React.FC<PropsBatteryBrandFormLazy> = React.memo(
  (props) => {
    const page = props.registryKey || props.page;
    const path = `${props.path ? `${props.path}-` : ''}battery_brand-form`;

    return (
      props.element
        ? (
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
        : (
          <DivNone />
        )
    );
  },
);

export default withFormRegistrySearch({})(BatteryBrandFormLazy);
