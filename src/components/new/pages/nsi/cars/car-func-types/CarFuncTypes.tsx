import * as React from 'react';

import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import Registry from 'components/new/ui/registry/components/Registry';

import {
  registryKey,
  config,
} from 'components/new/pages/nsi/cars/car-func-types/_config-data/registry-config';

import {
  PropsCarFuncTypes,
  StateCarFuncTypes,
} from 'components/new/pages/nsi/cars/car-func-types/CarFuncTypes.h';

class CarFuncTypes extends React.Component<PropsCarFuncTypes, StateCarFuncTypes> {
  render() {
    return (
      <Registry
        registryKey={registryKey}
      />
    );
  }
}

export default withRegistry(
  config,
)(CarFuncTypes);
