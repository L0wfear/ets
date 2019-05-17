import { SchemaFormContext } from 'components/new/utils/context/form/@types';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';

export const waybillFormSchema: SchemaFormContext<Waybill> = {
  header: {
    type: 'waybill',
  },
  body: {
    fields: [
      [
        {
          key: 'waybill_employee_change_status',
          title: '',
        },
        {
          key: 'waybill_structure_and_accompanying_person',
          title: '',
        },
        {
          key: 'waybill_dates',
          title: '',
          md: 6,
        },
      ],
      [
        {
          key: 'waybill_car_id',
          title: 'Транспортное средство',
          md: 6,
        },
        {
          key: 'waybill_trailer_id',
          title: 'Прицеп',
          md: 6,
        },
      ],
      [
        {
          key: 'is_bnso_broken',
          title: 'Исправность датчика ГЛОНАСС',
        },
      ],
      [
        {
          key: 'waybill_driver_id',
          title: 'Водитель',
          md: 6,
        },
        {
          key: 'waybill_work_mode_id',
          title: 'Режим работы',
          md: 6,
        },
      ],
      [
        {
          key: 'waybill_missions',
          title: 'Задание',
        },
      ],
    ],
  },
  footer: {
    type: 'waybill',
  },
};
