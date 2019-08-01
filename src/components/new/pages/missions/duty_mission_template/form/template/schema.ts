import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { DutyMissionTemplate } from 'redux-main/reducers/modules/missions/duty_mission_template/@types/index.h';
import { PropsDutyMissionTemplateForm } from './@types/index.h';
import { isPermittedEmployeeForDutyMission } from '../../../duty_mission/form/main/utils';

export const dutyDutyMissionTemplateFormSchema: SchemaType<DutyMissionTemplate, PropsDutyMissionTemplateForm> = {
  properties: {
    technical_operation_id: {
      title: 'Технологическая операция',
      type: 'valueOfArray',
      required: true,
    },
    municipal_facility_id: {
      title: 'Элемент',
      type: 'valueOfArray',
      required: true,
    },
    route_id: {
      title: 'Маршрут',
      type: 'valueOfArray',
      required: true,
    },
    foreman_id: {
      title: 'Бригадир',
      type: 'valueOfArray',
      required: true,
      dependencies: [
        (value, { structure_id }, { employeeIndex }) => {
          if (value && Object.keys(employeeIndex).length) {
            const isPermitted = isPermittedEmployeeForDutyMission(
              employeeIndex[value],
              structure_id,
            );

            if (!isPermitted) {
              return 'Поле "Бригадир" должно быть заполнено активным сотрудником';
            }
          }

          return '';
        },
      ],
    },
    brigade_employee_id_list_id: {
      title: 'Бригада',
      type: 'multiValueOfArray',
      required: false,
      dependencies: [
        (value, { structure_id }, { employeeIndex }) => {
          if (value.length && Object.keys(employeeIndex).length) {
            const isPermitted = !value.some((employee_id) => (
              !isPermittedEmployeeForDutyMission(
                employeeIndex[employee_id],
                structure_id,
              )
            ));

            if (!isPermitted) {
              return 'Поле "Бригада" должно быть заполнено активными сотрудниками';
            }
          }

          return '';
        },
      ],
    },
    comment: {
      title: 'Комментарий',
      type: 'string',
      required: false,
    },
  },
};
