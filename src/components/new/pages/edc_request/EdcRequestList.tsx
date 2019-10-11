import * as React from 'react';

import Registry from 'components/new/ui/registry/components/Registry';

import {
  registryKey,
  config,
} from 'components/new/pages/edc_request/_config-data/registry-config';

import EdcRequestFormLazy from 'components/new/pages/edc_request/form';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import { EdcRequest } from 'redux-main/reducers/modules/edc_request/@types';

type OwnProps = {};
const EdcRequestList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <Registry registryKey={registryKey}>
        <EdcRequestFormLazy registryKey={registryKey} />
      </Registry>
    );
  },
);
export default withRegistry<EdcRequest, OwnProps>(config)(EdcRequestList);
