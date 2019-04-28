import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { MissionTemplate } from 'redux-main/reducers/modules/missions/mission_template/@types/index.h';
import { PropsMissionTemplateForm } from './@types/index.h';

export const missionTemplateFormSchema: SchemaType<MissionTemplate, PropsMissionTemplateForm> = {
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
    passes_count: {
      title: 'Количество циклов',
      type: 'number',
      required: true,
      integer: true,
      max: 10,
      dependencies: [
        (value) => {
          if (value < 1) {
            return '"Количество циклов" должно быть больше 0';
          }

          return '';
        },
      ],
    },
    car_ids: {
      title: 'Транспортное средство',
      type: 'multiValueOfArray',
      required: true,
      dependencies: [
        (value = [], { for_column }) => {
          if (!value || value.length === 0) {
            return 'Поле "Транспортное средство" должно быть заполнено';
          }

          if (for_column && Array.isArray(value) && value.length === 1) {
            return 'Для создания шаблона задания на колонну должно быть выбрано более одного ТС';
          }

          return '';
        },
      ],
    },
    route_id: {
      title: 'Маршрут',
      type: 'valueOfArray',
      required: true,
    },
  },
};
