import { isObject, isNullOrUndefined } from 'util';
import { User } from 'redux-main/reducers/modules/some_uniq/users_access/@types';

export type GetDefaultUsersAccessElement = (compnay: User | null) => User;

export const defaultUser: User = {
  access_companies: [],
  access_companies_ids: [],
  access_companies_text: '',
  access_okrugs: [],
  access_okrugs_ids: [],
  access_okrugs_text: '',
  company_name: '',
  company_name_text: '',
  first_name: '',
  for: 'inspect',
  full_name: '',
  full_name_text: '',
  id: null,
  last_name: '',
  middle_name: '',
  okrug_name: '',
  okrug_name_text: '',
  personnel_number: '',
  personnel_number_text: '',
  position_name: '',
  position_name_text: '',
  status: '',
  user_id: null,
};

export const getDefaultUsersAccessElement: GetDefaultUsersAccessElement = (element) => {
  const newElement = { ...defaultUser };
  if (isObject(element)) {
    Object.keys(defaultUser).forEach((key) => {
      newElement[key] = !isNullOrUndefined(element[key]) ? element[key] : defaultUser[key];
    });
  }

  return newElement;
};
