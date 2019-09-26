import * as React from 'react';

import Registry from 'components/new/ui/registry/components/Registry';
import TireModelFormLazy from 'components/new/pages/nsi/autobase/pages/tire_model/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/autobase/pages/tire_model/_config-data/registry-config';
import { TireModel } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';

type OwnProps = {};
const TireModelList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <React.Fragment>
        <Registry registryKey={registryKey} />
        <TireModelFormLazy registryKey={registryKey} />
      </React.Fragment>
    );
  },
);

export default withRegistry<TireModel, OwnProps>(getToConfig())(TireModelList);
