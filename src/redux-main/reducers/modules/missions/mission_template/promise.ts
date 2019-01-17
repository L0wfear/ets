import { get } from 'lodash';

export const promiseGetMissionTemplate = async (payload) => {
  let response = null;
  try {
    response = await Promise.resolve({});
  } catch (error) {
    console.warn(error); // tslint:disable-line
    response = null;
  }

  const data = get(response, ['result', 'rows'], []);

  return {
    data,
  };
};

export const promiseCreateMissionTemplate = async (payload) => {
  let response = null;
  try {
    response = await Promise.resolve({});
  } catch (error) {
    console.warn(error); // tslint:disable-line
    response = null;
  }

  const missionTemplate = get(response, ['result', 'rows'], []);

  return {
    missionTemplate,
  };
};

export const promiseUpdateMissionTemplate = async (payload) => {
  let response = null;
  try {
    response = await Promise.resolve({});
  } catch (error) {
    console.warn(error); // tslint:disable-line
    response = null;
  }

  const missionTemplate = get(response, ['result', 'rows'], []);

  return {
    missionTemplate,
  };
};
