import * as React from 'react';
import { getRootRegistry } from 'components/new/ui/registry/module/selectors-registry';

import { ExtField } from 'components/old/ui/new/field/ExtField';
import { isAllChecked } from 'components/new/ui/registry/module/check_funk';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';

type Props = {
  metaField: ValuesOf<ValuesOf<OneRegistryData['list']['meta']['fieldsInDeepArr']>>;
  registryKey: string;
};

const ThCheckbox: React.FC<Props> = React.memo(
  (props) => {
    const allIsChecked = etsUseSelector((state) => isAllChecked(getRootRegistry(state.registry, props.registryKey)));

    return (
      <ExtField
        type="boolean"
        error={false}
        label={false}
        value={allIsChecked}
        checkboxStyle={false}
        className={null}
      />
    );
  },
);

export default ThCheckbox;
