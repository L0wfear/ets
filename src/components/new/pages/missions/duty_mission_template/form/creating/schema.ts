import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { PropsDutyMissionTemplateCreatingForm } from './@types/index.h';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';
import { diffDates } from 'components/@next/@utils/dates/dates';

export const dutyDutyMissionTemplateCreatingFormSchema: SchemaType<Partial<Pick<DutyMission, 'plan_date_end' | 'plan_date_start' | 'mission_source_id'>>, PropsDutyMissionTemplateCreatingForm> = {
  properties: {
    mission_source_id: {
      title: 'Источник получения задания',
      type: 'valueOfArray',
      required: true,
    },
    plan_date_start: {
      title: 'Время выполнения.C',
      type: 'datetime',
      required: true,
      dependencies: [
        (value, { plan_date_end }) => {
          if (value) {
            if (plan_date_end && diffDates(value, plan_date_end) >= 0) {
              return 'Дата планируемого начала должна быть раньше даты планируемого окончания';
            }
          }
          return '';
        },
      ],
    },
    plan_date_end: {
      title: 'Время выполнения.По',
      type: 'datetime',
      required: true,
    },
  },
};
