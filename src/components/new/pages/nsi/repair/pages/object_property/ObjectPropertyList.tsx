import * as React from 'react';

import Registry from 'components/new/ui/registry/components/Registry';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/repair/pages/object_property/_config-data/registry-config';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import { ObjectProperty } from 'redux-main/reducers/modules/repair/object_property/@types/objectProperty';

type OwnProps = {};
const ObjectPropertyList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <React.Fragment>
        <Registry registryKey={registryKey} />
      </React.Fragment>
    );
  },
);

export default withRegistry<ObjectProperty, OwnProps>(getToConfig())(ObjectPropertyList);
