import * as React from 'react';
import { getFormattedDateTimeSeconds } from 'components/@next/@utils/dates/dates';

export const listData: Array<any> = [
  {
    path: ['duty_mission_data', 'duty_mission_number'],
    title: '№ Задания',
  },
  {
    path: ['duty_mission_data', 'technical_operation_name'],
    title: 'Тех. операция',
  },
  {
    path: ['duty_mission_data', 'element_name'],
    title: 'Элемент',
  },
  {
    path: ['duty_mission_data', 'duty_mission_date_start'],
    title: 'Начало задания(плановое)',
    RenderComponent: ({ infoData }) => (
      <li>
        <b>Начало задания(плановое): </b>
        {getFormattedDateTimeSeconds(
          infoData.duty_mission_data.duty_mission_date_start,
        )}
      </li>
    ),
  },
  {
    path: ['duty_mission_data', 'object_type_name'],
    title: 'Тип объекта',
  },
  {
    path: ['duty_mission_data', 'duty_mission_date_end'],
    title: 'Окончание задания(плановое)',
    RenderComponent: ({ infoData }) => (
      <li>
        <b>Окончание задания(плановое): </b>
        {getFormattedDateTimeSeconds(
          infoData.duty_mission_data.duty_mission_date_end,
        )}
      </li>
    ),
  },
  {
    path: ['duty_mission_data', 'foreman_fio'],
    title: 'ФИО бригадира',
  },
  {
    path: ['duty_mission_data', 'foreman_phone'],
    title: 'Номер телефона бригадира',
  },
];
