import * as React from 'react';
import { get } from 'lodash';

import LoadingComponent from 'components/old/ui/PreloaderMainPage';
import { PropsMaintenanceRateFormLazy } from 'components/new/pages/nsi/regulatory_indicator/pages/maintenance_rate/form/@types/MaintenanceRateForm';
import withFormRegistrySearch from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { getServiceData } from 'components/new/ui/registry/module/selectors-registry';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';

const MaintenanceRateForm = React.lazy(() => (
  import(/* webpackChunkName: "maintenance_rate_form" */'components/new/pages/nsi/regulatory_indicator/pages/maintenance_rate/form/MaintenanceRateForm')
));

const MaintenanceRateFormLazy: React.FC<PropsMaintenanceRateFormLazy> = React.memo(
  (props) => {
    const page = props.registryKey || props.page;
    const path = `${props.path ? `${props.path}-` : ''}maintenance-rate-form`;
    const type = etsUseSelector((state) => get(getServiceData(state, props.registryKey), 'getRegistryData.payload.type', null));

    return props.element && (
        <React.Suspense fallback={<LoadingComponent />}>
          <MaintenanceRateForm
            element={props.element}
            handleHide={props.onFormHide}

            type={type}
            page={page}
            path={path}
          />
        </React.Suspense>
      );
  },
);

export default withFormRegistrySearch({})(MaintenanceRateFormLazy);
