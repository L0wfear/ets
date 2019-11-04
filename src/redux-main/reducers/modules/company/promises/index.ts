import { CompanyService } from 'api/Services';
import { Company } from 'redux-main/reducers/modules/company/@types';
import {
  keyBy,
  get,
} from 'lodash';

const colors = [];

Array(16)
  .fill(1)
  .map((_, r) => (
    Array(16)
      .fill(1)
      .map((__, g) => (
        Array(16)
          .fill(1)
          .map((___, b) => (
            colors.push(`rgb(${r * 16}, ${g * 16}, ${b * 16})`)
          ))
      ))
  ));

/* ------------- COMPANY ------------- */
export const promiseGetCompany = async (payload = {}) => {
  let response = null;
  try {
    response = await CompanyService.get({ ...payload });
  } catch (error) {
    console.info(error); // eslint-disable-line
  }

  const data: Array<Company> = get(response, ['result'], [])
    .map((company) => {
      company.rgb_color = company.rgb_color || colors[Math.ceil(Math.random() * 4096)];

      return company;
    });

  return {
    data,
    dataIndex: keyBy(data, 'company_id'),
  };
};

export const promiseLoadPFCompany = async (payloadOwn) => {
  return CompanyService.getBlob(payloadOwn);
};

export const promiseCreateCompany = async (ownPayload) => {
  const payload = {
    ...ownPayload,
  };

  const response = await CompanyService.post(
    payload,
    false,
    'json',
  );

  const data = get(response, ['result', 0], null);

  return data;
};
export const promiseUpdateCompany = async (ownPayload) => {
  const payload = {
    ...ownPayload,
  };

  const response = await CompanyService.path(ownPayload.company_id).put(
    payload,
    false,
    'json',
  );

  const data = get(response, ['result', 0], null);

  return data;
};
export const promiseDeleteCompany = (id) => {
  return CompanyService.path(id).delete(
    {},
    false,
    'json',
  ).then(() => {
    global.NOTIFICATION_SYSTEM.notify('Запись успешно удалена', 'success');
  });
};
