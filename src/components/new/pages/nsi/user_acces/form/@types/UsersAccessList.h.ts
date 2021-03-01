import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { User } from 'redux-main/reducers/modules/some_uniq/users_access/@types';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

export type PropsUsersAccessWithForm = WithFormRegistrySearchAddProps<User>;

export type PropsUsersAccess = OutputWithFormProps<
  PropsUsersAccessWithForm,
  User,
  [ User ],
  any
>;
