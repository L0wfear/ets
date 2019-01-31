import {
  get,
} from 'lodash';
import { DutyMissionTemplateService } from 'api/missions/index';
import { DutyMissionTemplate } from './@types/index.h';

export const promiseGetDutyMissionTemplate = async (payload) => {
  let response = null;
  try {
    response = await DutyMissionTemplateService.get(
      { ...payload },
    );
  } catch (error) {
    console.warn(error); // tslint:disable-line
    response = null;
  }

  const data = get(response, ['result'], []).map((employee) => {
    const brigade_employee_id_list = get(employee, 'brigade_employee_id_list', []) || [];

    employee.brigade_employee_id_list_id = brigade_employee_id_list.map(({ employee_id }) => employee_id);
    employee.brigade_employee_id_list_fio = brigade_employee_id_list.map(({ employee_fio }) => employee_fio);

    return employee;
  });

  return {
    data,
  };
};

export const promiseCreateDutyMissionTemplate = async (payloadOwn: DutyMissionTemplate) => {
  const payload: any = { ...payloadOwn };

  delete payload.brigade_employee_id_list_fio;
  delete payload.brigade_employee_id_list_id;

  payload.brigade_employee_id_list = payload.brigade_employee_id_list.map(({ employee_id }) => employee_id);

  const response = await DutyMissionTemplateService.post(
    { ...payload },
    false,
    'json',
  );

  const dutyDutyMissionTemplate = get(response, ['result', 0],  null);

  return {
    dutyDutyMissionTemplate,
  };
};

export const promiseUpdateDutyMissionTemplate = async (payloadOwn: DutyMissionTemplate) => {
  const payload: any = { ...payloadOwn };

  delete payload.brigade_employee_id_list_fio;
  delete payload.brigade_employee_id_list_id;

  payload.brigade_employee_id_list = payload.brigade_employee_id_list.map(({ employee_id }) => employee_id);

  const response = await DutyMissionTemplateService.put(
    { ...payload },
    false,
    'json',
  );

  const dutyDutyMissionTemplate = get(response, ['result', 0],  null);

  return {
    dutyDutyMissionTemplate,
  };
};

export const promiseRemoveDutyMissionTemplates = async (ids: number[]) => {
  return Promise.all(
    ids.map((idNumber) => (
      promiseRemoveDutyMissionTemplate(idNumber)
    )),
  );
};

export const promiseRemoveDutyMissionTemplate = async (id: number) => {
  return DutyMissionTemplateService.delete(
    { id },
    false,
    'json',
  );
};
