import * as React from 'react';

import { WithFormRegistrySearchProps, withFormRegistrySearchNew, WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearchNew';
import { MaintenanceWork } from 'redux-main/reducers/modules/some_uniq/maintenance_work/@types';

const MaintenanceWorkFrom = React.lazy(() => (
  import(/* webpackChunkName: "maintenance_work_form" */ 'components/new/pages/nsi/data_for_calculation/pages/maintenance_work/form/context/MaintenanceWorkFormContext')
));

const MaintenanceWorkFormLazy: React.FC<WithFormRegistrySearchAddProps<MaintenanceWork>> = React.memo(
  (props) => {
    const type = props.match.params.selected_odh_dt_value;

    const element = React.useMemo(
      () => {
        if (props.element) {
          if (!props.element.id) {
            return {
              ...props.element,
              type,
            };
          }
        }

        return props.element;
      },
      [props.element, type],
    );

    return (
      <MaintenanceWorkFrom
        {...props}
        element={element}
      />
    );
  },
);

export default withFormRegistrySearchNew<WithFormRegistrySearchProps<MaintenanceWork>, MaintenanceWork>({
  add_path: 'maintenance_work',
})(MaintenanceWorkFormLazy);
