import * as React from 'react';

import { User } from 'redux-main/reducers/modules/some_uniq/users_access/@types';
import { WithFormRegistrySearchProps, withFormRegistrySearch } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

const UserAccessFrom = React.lazy(() => (
  import(/* webpackChunkName: "users_access" */ 'components/new/pages/nsi/user_acces/form/UsersAccessForm')
));

export default withFormRegistrySearch<WithFormRegistrySearchProps<User>, User>({
  add_path: 'users_access',
})(UserAccessFrom);
