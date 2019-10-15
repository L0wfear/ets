import * as React from 'react';

import { getFormattedDateTimeSeconds, getFormattedDateTime } from 'components/@next/@utils/dates/dates';

import { checkFixed, getDataTraveledYet } from 'components/new/ui/mission_info_form/form-components/info-table-data/utils/format';
import { UiConstants } from 'components/@next/@ui/renderFields/UiConstants';

const getEstimatedFinishTime = (data) => {
  if (typeof data === 'string' && data.indexOf('2') === -1) {
    return data;
  }
  return getFormattedDateTime(data);
};

export const listData: any[] = [
  {
    path: ['mission_data', 'name'],
    title: 'Задание',
  },
  {
    path: ['technical_operation_data', 'name'],
    title: 'Тех. операция',
  },
  {
    path: ['mission_data', 'element'],
    title: 'Элемент',
  },
  {
    path: ['route_data', 'object_type_name'],
    title: 'Тип объекта',
  },
  {
    path: ['car_data', 'driver_fio'],
    title: 'Водитель',
  },
  {
    path: ['car_data', 'driver_allowed'],
    title: 'Задание',
    RenderComponent: ({ infoData }) => (
      Boolean(infoData.car_data.driver_allowed) && (
        <div style={{ marginBottom: 5, marginTop: 5 }}>
          <span style={{ fontSize: 16, color: UiConstants.colorError }}>Не пройден внеплановый мед. осмотр</span>
        </div>
      )
    ),
  },
  {
    path: ['car_data', 'gov_number'],
    title: 'Рег. номер ТС',
  },
  {
    path: ['car_data', 'garage_number'],
    title: 'Гаражный номер',
  },
  {
    path: ['mission_data', 'date_start'],
    title: 'Начало задания',
    RenderComponent: ({ infoData }) => (
      <li>
        <b>Начало задания: </b>
        {getFormattedDateTimeSeconds(infoData.mission_data.date_start)}
      </li>
    ),
  },
  {
    path: ['mission_data', 'date_end'],
    title: 'Окончание задани',
    RenderComponent: ({ infoData }) => (
      <li>
        <b>Окончание задания: </b>
        {getFormattedDateTimeSeconds(infoData.mission_data.date_end)}
      </li>
    ),
  },
  {
    path: ['report_data', 'estimated_finish_time'],
    title: 'Расчетное время выполнения',
    RenderComponent: ({ infoData }) => (
      <li>
        <b>Расчетное время выполнения: </b>
        {getEstimatedFinishTime(infoData.report_data.estimated_finish_time || 'Подсчет')}
      </li>
    ),
  },
  {
    path: ['report_data', 'traveled', 'check_unit'],
    title: 'Пройдено в рабочем режиме',
    RenderComponent: ({ infoData: { report_data } }) => {
      const traveledAndCheck_unit = checkFixed([report_data.traveled, report_data.check_unit], 'TWO_F');
      return (
        <li>
          <b>Пройдено в рабочем режиме: </b>
          {getDataTraveledYet(traveledAndCheck_unit) || '---'}
        </li>
      );
    },
  },
  {
    path: ['report_data', 'traveled', 'check_unit', 'time_work_speed'],
    title: 'Пройдено с рабочей скоростью',
    RenderComponent: ({ infoData: { report_data } }) => {
      const traveledAndCheck_unit = checkFixed([report_data.traveled, report_data.check_unit], 'TWO_F');

      return (
        <li>
          <b>Пройдено с рабочей скоростью: </b>
          {getDataTraveledYet([...traveledAndCheck_unit, report_data.time_work_speed]) || '---'}
        </li>
      );
    },
  },
  {
    path: ['report_data', 'traveled_high_speed', 'check_unit'],
    title: 'Пройдено с превышением рабочей скорости',
    RenderComponent: ({ infoData: { report_data } }) => {
      const traveled_high_speedAndCheck_unit = checkFixed([report_data.traveled_high_speed, report_data.check_unit], 'TWO_F');

      return (
        <li>
          <b>Пройдено с превышением рабочей скорости: </b>
          {getDataTraveledYet([...traveled_high_speedAndCheck_unit, report_data.time_high_speed]) || '---'}
        </li>
      );
    },
  },
  {
    path: ['mission_data', 'sensor_traveled_working'],
    title: 'Общий пробег с работающим оборудованием',
    RenderComponent: ({ infoData: { mission_data: { sensor_traveled_working } } }) => {
      const sensor_traveled_workingAndCheck_unit = checkFixed([sensor_traveled_working / 1000, 'км'], 'THREE_F');

      return (
        <li><b>Общий пробег с работающим оборудованием: </b>
          {`${sensor_traveled_working ?
            getDataTraveledYet(sensor_traveled_workingAndCheck_unit)
            :
            'Данные будут отображены после выполнения задания'
          }`}
        </li>
      );
    },
  },
];
