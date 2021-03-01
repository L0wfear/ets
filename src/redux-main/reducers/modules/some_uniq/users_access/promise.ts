import { UsersAccessRegistryService } from 'api/Services';
import { get } from 'lodash';
import { User, CreateUserAccessPayload, UpdtateUserAccessPayload, GetUserAccessPayload } from 'redux-main/reducers/modules/some_uniq/users_access/@types';

export const promiseGetUsersAccess = async (payload: GetUserAccessPayload): Promise<Array<User>>  => {
  let response = null;
  try {
    response = await UsersAccessRegistryService.get({ ...payload });
  } catch (error) {
    console.info(error); // eslint-disable-line
  }

  const data: Array<User> = get(response, 'result.rows', []);

  return data;
};

export const promiseCreateUserAccess = async (ownPayload: CreateUserAccessPayload): Promise<Array<User>> => {
  const payload = {
    ...ownPayload,
  };

  const response = await UsersAccessRegistryService.post(
    payload,
    false,
    'json',
  );

  const data: Array<User> = get(response, 'result.rows', []);

  return data;
};
export const promiseUpdtateUserAccess = async (id: User['id'], ownPayload: UpdtateUserAccessPayload): Promise<Array<User>> => {
  const payload = {
    ...ownPayload,
  };

  const response = await UsersAccessRegistryService.path(id).put(
    payload,
    false,
    'json',
  );

  const data: Array<User> = get(response, 'result.rows', []);

  return data;
};
