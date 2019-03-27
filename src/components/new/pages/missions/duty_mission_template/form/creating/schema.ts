import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { PropsDutyMissionTemplateCreatingForm } from './@types/index.h';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';
import { diffDates } from 'utils/dates';

export const dutyDutyMissionTemplateCreatingFormSchema: SchemaType<Partial<Pick<DutyMission, 'plan_date_end' | 'plan_date_start' | 'mission_source_id'>>, PropsDutyMissionTemplateCreatingForm> = {
  properties: [
    {
      key: 'mission_source_id',
      title: 'Источник получения задания',
      type: 'valueOfArray',
      required: true,
    },
    {
      key: 'plan_date_start',
      title: 'Время выполнения.C',
      type: 'datetime',
      required: true,
    },
    {
      key: 'plan_date_end',
      title: 'Время выполнения.По',
      type: 'datetime',
      required: true,
    },
  ],
  dependencies: {
    plan_date_start: [
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
};
