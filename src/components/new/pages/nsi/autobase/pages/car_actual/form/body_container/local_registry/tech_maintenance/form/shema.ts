import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { PropsTechMaintenance } from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/tech_maintenance/form/@types/TechMintenanceForm';

import { TechMaintenance } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { getRequiredFieldMessage } from 'utils/validate';
import { hasMotohours } from 'utils/functions';
import { diffDates } from 'utils/dates';

export const techMaintFormSchema: SchemaType<TechMaintenance, PropsTechMaintenance> = {
  properties: [
    {
      key: 'tech_maintenance_order_ids',
      title: 'Регламент ТО',
      type: 'multiValueOfArray',
      required: true,
    },
    {
      key: 'repair_company_id',
      title: 'Исполнитель ремонта',
      type: 'valueOfArray',
    },
    {
      key: 'number',
      title: 'Номер документа',
      type: 'string',
      maxLength: 128,
    },
    {
      key: 'plan_date_start',
      title: 'Плановая дата начала',
      type: 'date',
      required: true,
    },
    {
      key: 'plan_date_end',
      title: 'Плановая дата окончания',
      type: 'date',
    },
    {
      key: 'fact_date_start',
      title: 'Плановая дата начала',
      type: 'date',
    },
    {
      key: 'fact_date_end',
      title: 'Плановая дата окончания',
      type: 'date',
    },
    {
      key: 'odometr_fact',
      title: 'Пробег на момент ТО, км',
      type: 'number',
      maxLength: 128,
      integer: true,
    },
    {
      key: 'motohours_fact',
      title: 'Счетчик м/ч на момент ТО, м/ч',
      type: 'number',
      maxLength: 128,
      integer: true,
    },
    {
      key: 'note',
      title: 'Номер документа',
      type: 'string',
      maxLength: 2048,
    },
  ],
  dependencies: {
    repair_company_id: [
      (value, { fact_date_start = '' }) => {
        if (fact_date_start && !value) {
          return getRequiredFieldMessage('Исполнитель ремонта');
        }

        return '';
      },
    ],
    plan_date_end: [
      (value = null, { plan_date_start = null }) => {
        if (!value) {
          return getRequiredFieldMessage('Плановая дата окончания');
        }

        if (plan_date_start) {
          return diffDates(plan_date_start, value) <= 0
            ? ''
            : '"Плановая дата окончания" должна быть >= "Плановая дата начала ремонта"';
        }

        return '';
      },
    ],
    fact_date_end: [
      (value = null, { fact_date_start = null }) => {
        if (fact_date_start && value) {
          return diffDates(fact_date_start, value) <= 0
            ? ''
            : '"Фактическая дата окончания" должна быть >= "Фактическая дата начала ремонта"';
        }

        return '';
      },
    ],
    odometr_fact: [
      (value = null, { fact_date_start = null, fact_date_end = null, gov_number }) => {
        if (
          (fact_date_start || fact_date_end) &&
          !value &&
          !hasMotohours(gov_number)
        ) {
          return getRequiredFieldMessage('Пробег на момент ТО, км');
        }

        return '';
      },
    ],
    motohours_fact: [
      (value = null, { fact_date_start = null, fact_date_end = null, gov_number }) => {
        if (
          (fact_date_start || fact_date_end) &&
          !value &&
          hasMotohours(gov_number)
        ) {
          return getRequiredFieldMessage('Счетчик м/ч на момент ТО, м/ч');
        }

        return '';
      },
    ],
  },
};
