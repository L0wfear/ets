import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { PropsTechInspection } from 'components/new/pages/nsi/autobase/pages/tech_inspection/form/@types/TechInspectionForm';

import { TechInspection } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { diffDates } from 'utils/dates';

export const techInspectionFormSchema: SchemaType<TechInspection, PropsTechInspection> = {
  properties: {
    car_id: {
      title: 'Регистрационный номер',
      type: 'valueOfArray',
      required: true,
    },
    reg_number: {
      title: 'Номер диагностической карты/Талона ГТО',
      type: 'string',
      required: true,
      maxLength: 21,
    },
    date_start: {
      title: 'Дата прохождения',
      type: 'date',
      required: true,
    },
    date_end: {
      title: 'Срок действия до',
      type: 'date',
      required: true,
      dependencies: [
        (value, { date_start }) => {
          if (value && date_start) {
            if (diffDates(date_start, value) > 0) {
              return '"Срок действия до" не должен быть раньше "Даты прохождения"';
            }
          }

          return '';
        },
      ],
    },
    tech_operator: {
      title: 'Оператор технического осмотра / пункт технического осмотра',
      type: 'string',
      maxLength: 256,
    },
    is_allowed: {
      title: 'Заключение о возможности/невозможности эксплуатации ТС',
      type: 'boolean',
    },
    note: {
      title: 'Примечание прохождения',
      type: 'string',
    },
  },
};
