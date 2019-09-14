import * as React from 'react';

import { ConsumableMaterial } from 'redux-main/reducers/modules/consumable_material/@types/consumableMaterial';
import { WithFormRegistrySearchProps, WithFormRegistrySearchAddProps, withFormRegistrySearchNew } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearchNew';

const ConsumableMaterialFrom = React.lazy(() => (
  import(/* webpackChunkName: "consumable_material_form" */ 'components/new/pages/nsi/data_for_calculation/pages/consumable_material/form/ConsumableMaterialForm')
));

const ConsumableMaterialFormLazy: React.FC<WithFormRegistrySearchAddProps<ConsumableMaterial>> = React.memo(
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
      <ConsumableMaterialFrom
        element={element}
        {...props}
      />
    );
  },
);

export default withFormRegistrySearchNew<WithFormRegistrySearchProps<ConsumableMaterial>, ConsumableMaterial>({
  add_path: 'consumable_material',
})(ConsumableMaterialFormLazy);
