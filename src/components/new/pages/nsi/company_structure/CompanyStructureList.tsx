import * as React from 'react';

import Registry from 'components/new/ui/registry/components/Registry';
import CompanyStructureFormLazy from 'components/new/pages/nsi/company_structure/form';

import {
  registryKey,
  config,
} from 'components/new/pages/nsi/company_structure/_config-data/registry-config';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import { CompanyStructure } from 'redux-main/reducers/modules/company_structure/@types/company_structure.h';

type OwnProps = {};
const CompanyStructureList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <React.Fragment>
        <Registry registryKey={registryKey} />
        <CompanyStructureFormLazy registryKey={registryKey} />
      </React.Fragment>
    );
  },
);

export default withRegistry<CompanyStructure, OwnProps>(config)(CompanyStructureList);
