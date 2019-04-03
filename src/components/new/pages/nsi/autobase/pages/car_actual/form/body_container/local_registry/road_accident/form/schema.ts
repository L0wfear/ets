import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { PropsRoadAccident } from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/road_accident/form/@types/RoadAccident';
import { RoadAccident } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const roadAccidentFormSchema: SchemaType<RoadAccident, PropsRoadAccident> = {
  properties: [
    {
      key: 'accident_date',
      title: 'Дата',
      type: 'date',
      required: true,
    },
    {
      key: 'driver_id',
      title: 'Водитель',
      type: 'valueOfArray',
      required: true,
    },
    {
      key: 'cause_id',
      title: 'Причина ДТП',
      type: 'valueOfArray',
      required: true,
    },
    {
      key: 'accident_place',
      title: 'Место ДТП',
      type: 'string',
      maxLength: 1024,
    },
    {
      key: 'damage_price',
      title: 'Стоимость ущерба, руб.',
      type: 'number',
      maxLength: 128,
      min: 0,
      integer: true,
    },
    {
      key: 'comment',
      title: 'Примечание',
      type: 'string',
      maxLength: 2048,
    },
    {
      key: 'cause_name',
      title: 'Причина ДТП',
      type: 'string',
    },
    {
      key: 'is_guilty',
      title: 'Виновность',
      type: 'boolean',
    },
  ],
};
