import * as React from 'react';
import { get } from 'lodash';

import { getServiceData } from 'components/new/ui/registry/module/selectors-registry';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { withFormRegistrySearch, WithFormRegistrySearchProps, WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { MaintenanceRate } from 'redux-main/reducers/modules/maintenance_rate/@types/maintenanceRate.h';

const MaintenanceRateForm = React.lazy(() => (
  import(/* webpackChunkName: "maintenance_rate_form" */'components/new/pages/nsi/regulatory_indicator/pages/maintenance_rate/form/MaintenanceRateForm')
));

type OwnProps = WithFormRegistrySearchProps<MaintenanceRate> & {};
type Props = WithFormRegistrySearchAddProps<MaintenanceRate>;

const MaintenanceRateFormLazy: React.FC<Props> = React.memo(
  (props) => {
    const type = etsUseSelector((state) => get(getServiceData(state, props.page), 'getRegistryData.payload.type', null));
    const element = React.useMemo(
      () => ({
        ...props.element,
        type,
      }),
      [props.element, type],
    );

    return (
      <MaintenanceRateForm
        {...props}
        element={element}
      />
    );
  },
);

export default withFormRegistrySearch<OwnProps, MaintenanceRate>({
  add_path: 'maintenance-rate',
})(MaintenanceRateFormLazy);
