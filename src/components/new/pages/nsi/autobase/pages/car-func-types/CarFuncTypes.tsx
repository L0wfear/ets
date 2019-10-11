import * as React from 'react';

import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import Registry from 'components/new/ui/registry/components/Registry';
import CarFuncTypesFormWrap from 'components/new/pages/nsi/autobase/pages/car-func-types/CarFuncTypesForm/CarFuncTypesFormWrap';

import {
  registryKey,
  config,
} from 'components/new/pages/nsi/autobase/pages/car-func-types/_config-data/registry-config';
import { CarFuncTypes } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

type OwnProps = {};

const CarFuncTypesList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <Registry registryKey={registryKey}>
        <CarFuncTypesFormWrap registryKey={registryKey} />
      </Registry>
    );
  },
);

export default withRegistry<CarFuncTypes, OwnProps>(
  config,
)(CarFuncTypesList);
