import { getRequiredFieldMessage } from 'components/@next/@utils/getErrorString/getErrorString';
import { diffDates } from 'components/@next/@utils/dates/dates';
import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { ProgramRegistry } from 'redux-main/reducers/modules/repair/program_registry/@types/programRegistry';

export const formValidationSchema: SchemaType<ProgramRegistry, any> = {
  properties: {
    state_program_id: {
      title: 'Гос. программа',
      type: 'number',
      required: true,
    },
    name: {
      title: 'Наименование программы',
      type: 'string',
      required: true,
    },
    repair_type_id: {
      title: 'Тип ремонта',
      type: 'number',
      required: true,
    },
    object_type_id: {
      title: 'Тип объекта ремонта',
      type: 'number',
      required: true,
    },
    plan_date_start: {
      title: 'План. Начало',
      type: 'date',
      required: true,
    },
    plan_date_end: {
      title: 'План. Завершение',
      type: 'date',
      required: true,
      dependencies: [
        (value = null, { plan_date_start = null }) => {
          if (!value) {
            return getRequiredFieldMessage('Плановая дата окончания');
          }

          if (plan_date_start && diffDates(value, plan_date_start, 'minutes') < 0) {
            return '"Плановая дата окончания" должна быть >= "Плановая дата начала ремонта"';
          }

          return '';
        },
      ],
    },
    is_active: {
      title: 'Версия',
      type: 'boolean',
      required: true,
    },
    fact_date_start: {
      title: 'План. Начало',
      type: 'date',
    },
    fact_date_end: {
      title: 'План. Завершение',
      type: 'date',
      dependencies: [
        (value = null, { fact_date_start = null }) => {
          if (fact_date_start && value && diffDates(value, fact_date_start, 'minutes') < 0) {
            return '"Фактическая дата окончания" должна быть >= "Фактическая дата начала ремонта"';
          }

          return '';
        }
      ],
    },
    contractor_id: {
      title: 'Подрядчик',
      type: 'number',
      required: true,
    },
    contract_number: {
      title: '№ контракта',
      type: 'string',
      maxLength: 128,
      required: true,
    },
    note: {
      title: 'Примечание',
      type: 'string',
      maxLength: 2048,
    },
  },
};
