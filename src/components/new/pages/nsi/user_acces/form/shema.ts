import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { PropsUsersAccess } from 'components/new/pages/nsi/user_acces/form/@types/UsersAccessList.h';
import { User } from 'redux-main/reducers/modules/some_uniq/users_access/@types';

export const usersAccessSchema: SchemaType<User, PropsUsersAccess> = {
  properties: {},
};
