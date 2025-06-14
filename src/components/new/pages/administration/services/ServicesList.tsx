import * as React from 'react';

import Registry from 'components/new/ui/registry/components/Registry';

import {
  registryKey,
  config,
} from 'components/new/pages/administration/services/_config-data/registry-config';

import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import { Service } from 'redux-main/reducers/modules/services/@types/services';

type OwnProps = {};
type Props = OwnProps;

const ServicesList: React.FC<Props> = React.memo(
  () => {
    return (
      <Registry registryKey={registryKey}/>
    );
  },
);

export default withRegistry<Service, OwnProps>(config)(ServicesList);
