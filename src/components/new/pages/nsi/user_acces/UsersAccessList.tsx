import * as React from 'react';

import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import Registry from 'components/new/ui/registry/components/Registry';
import UsersAccessListFormWrap from 'components/new/pages/nsi/user_acces/form/UsersAccessFormWrap';

import {
  registryKey,
  config,
} from 'components/new/pages/nsi/user_acces/_config-data/registry-config';

import { User } from 'redux-main/reducers/modules/some_uniq/users_access/@types';

type OwnProps = {};
const UsersAccessList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <Registry registryKey={registryKey}>
        <UsersAccessListFormWrap registryKey={registryKey} />
      </Registry>
    );
  },
);

export default withRegistry<User, OwnProps>(
  config,
)(UsersAccessList);
