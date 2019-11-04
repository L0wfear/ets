import * as React from 'react';
import { get, isEmpty, } from 'lodash';

import {
  registryTriggerOnChangeSelectedField,
} from 'components/new/ui/registry/module/actions-registy';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { etsUseDispatch, etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import ThDefault from 'components/new/ui/registry/components/data/table-data/table-container/@new/thead/th/ThDefault';
import ThCheckbox from 'components/new/ui/registry/components/data/table-data/table-container/@new/thead/th/ThCheckbox';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';

type Props = {
  metaField: ValuesOf<ValuesOf<OneRegistryData['list']['meta']['fieldsInDeepArr']>>;
  registryKey: string;
};

const componentsByKey: Record<string, React.ComponentType<Props>> = {
  checkbox: ThCheckbox,
};

const Th: React.FC<Props> = React.memo(
  (props) => {
    const {
      metaField,
      metaField: {
        width,
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

    const Component = componentsByKey[metaField.key] || ThDefault;
    const groupOpt = get(metaField, 'groupOpt', null);
    const groupColumn = etsUseSelector((state) => getListData(state.registry, props.registryKey).meta.groupColumn);
    const isActive = groupOpt
      ? get(groupColumn, `${groupOpt.key}.isActive`, true) || groupOpt.firstElem
      : true;
    const isStickyTh = isEmpty(groupColumn);

    return (
      isActive
        && <EtsBootstrap.Grid.GridBootstrapThead.Th
          width={width}
          canClick={sortable}
          onClick={handleClick}
          isStickyTh={isStickyTh}
        >
          <Component metaField={metaField} registryKey={props.registryKey}/>
        </EtsBootstrap.Grid.GridBootstrapThead.Th>
    );
  },
);

export default Th;
