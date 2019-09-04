import * as React from 'react';

import {
  registryTriggerOnChangeSelectedField,
} from 'components/new/ui/registry/module/actions-registy';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import ThDefault from 'components/new/ui/registry/components/data/table-data/table-container/@new/thead/th/ThDefault';
import ThCheckbox from 'components/new/ui/registry/components/data/table-data/table-container/@new/thead/th/ThCheckbox';

type Props = {
  metaField: ValuesOf<ValuesOf<OneRegistryData['list']['meta']['fieldsInDeepArr']>>;
  registryKey: string;
};

const Th: React.FC<Props> = React.memo(
  (props) => {
    const {
      metaField,
      metaField: {
        sortable = true,
      },
    } = props;

    const dispatch = etsUseDispatch();

    const handleClick = React.useCallback(
      () => {
        dispatch(
          registryTriggerOnChangeSelectedField(props.registryKey, metaField.key, sortable && !('childrenFields' in metaField)),
        );
      },
      [props.registryKey, metaField, sortable],
    );

    return (
      <EtsBootstrap.Grid.GridBootstrapThead.Th
        canClick={sortable}
        onClick={handleClick}
      >
        {
          metaField.key === 'checkbox'
            ? (
              <ThCheckbox metaField={metaField} registryKey={props.registryKey}/>
            )
            : (
              <ThDefault metaField={metaField} registryKey={props.registryKey}/>
            )
        }
      </EtsBootstrap.Grid.GridBootstrapThead.Th>
    );
  },
);

export default Th;
