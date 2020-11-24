import * as React from 'react';

import Registry from 'components/new/ui/registry/components/Registry';
import TachographFormLazy from 'components/new/pages/nsi/autobase/pages/tachograph/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/autobase/pages/tachograph/_config-data/registry-config';
import { TachographListWithOuterProps } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_registry/@types';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';

type OwnProps = {};
const TachographsList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <Registry registryKey={registryKey}>
        <TachographFormLazy registryKey={registryKey} />
      </Registry>
    );
  },
);

export default withRegistry<TachographListWithOuterProps, OwnProps>(getToConfig())(TachographsList);
