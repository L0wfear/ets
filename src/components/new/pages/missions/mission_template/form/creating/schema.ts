import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { diffDates } from 'utils/dates';
import { MissionTemplateCreating, PropsMissionTemplateCreatingForm } from './@types/MissionTemplateCreatingForm';
import { routeTypesByKey } from 'constants/route';

export const missionTemplateCreatingFormSchema: SchemaType<MissionTemplateCreating, PropsMissionTemplateCreatingForm> = {
  properties: {
    mission_source_id: {
      title: 'Источник получения задания',
      type: 'valueOfArray',
      required: true,
    },
    date_start: {
      title: 'Время выполнения.C',
      type: 'datetime',
      required: true,
      dependencies: [
        (date_start, { date_end }) => {
          if (date_start) {
            if (date_end && diffDates(date_start, date_end) >= 0) {
              return 'Дата начала должна быть раньше даты окончания';
            }
          }
          return '';
        },
      ],
    },
    date_end: {
      title: 'Время выполнения.По',
      type: 'datetime',
      required: true,
      dependencies: [
        (date_end, { date_start, missionTemplates }) => {
          const missionTemplatesAsArr = Object.values(missionTemplates);

          if (missionTemplatesAsArr.some(({ is_cleaning_norm }) => is_cleaning_norm.includes(true)) && date_start) {
            const time = routeTypesByKey[missionTemplatesAsArr[0].route_type].time;

            if (time && diffDates(date_end, date_start, 'hours') > time) {
              return `Время выполнения задания для ${routeTypesByKey[missionTemplatesAsArr[0].route_type].title} должно составлять не более ${time} часов`;
            }
          }
        },
      ],
    },
    passes_count: {
      title: 'Количество циклов',
      type: 'number',
      required: true,
      integer: true,
      max: 10,
      minNotEqual: 0,
    },
  },
};
