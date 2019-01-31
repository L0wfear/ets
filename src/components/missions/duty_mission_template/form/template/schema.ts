import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { DutyMissionTemplate } from 'redux-main/reducers/modules/missions/duty_mission_template/@types/index.h';
import { PropsDutyMissionTemplateForm } from './@types/index.h';

export const dutyDutyMissionTemplateFormSchema: SchemaType<DutyMissionTemplate, PropsDutyMissionTemplateForm> = {
  properties: [
    {
      key: 'technical_operation_id',
      title: 'Технологическая операция',
      type: 'valueOfArray',
      required: true,
    },
    {
      key: 'municipal_facility_id',
      title: 'Элемент',
      type: 'valueOfArray',
      required: true,
    },
    {
      key: 'route_id',
      title: 'Маршрут',
      type: 'valueOfArray',
      required: true,
    },
    {
      key: 'foreman_id',
      title: 'Бригадир',
      type: 'valueOfArray',
      required: true,
    },
    {
      key: 'brigade_employee_id_list_id',
      title: 'Бригада',
      type: 'multiValueOfArray',
      required: false,
    },
    {
      key: 'comment',
      title: 'Комментарий',
      type: 'string',
      required: false,
    },
  ],
};
