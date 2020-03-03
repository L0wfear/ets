import * as React from 'react';

import {
  DivGreen,
  DivRed,
} from 'global-styled/global-styled';

import {
  checkFixed,
  getDataTraveledYet,
} from 'components/new/ui/mission_info_form/form-components/info-table-data/utils/format';

import { secondsToTime } from 'components/@next/@utils/dates/dates';

import {
  IMIssionData,
  IReportData,
} from 'components/new/ui/mission_info_form/MissionInfoForm.h';

type Props = {
  mission_data: IMIssionData;
  report_data: IReportData;
  parkingCount: number | void;
};

const InfoTableData: React.FC<Props> = React.memo(
  (props) => {
    const {
      mission_data,
      report_data,
      parkingCount,
    } = props;

    const withWorkSpeed = getDataTraveledYet([
      ...checkFixed([report_data.traveled_raw, report_data.check_unit], 'TWO_F'),
      report_data.time_work_speed,
    ]);

    const withHightSpeed = getDataTraveledYet([
      ...checkFixed([report_data.traveled_high_speed, report_data.check_unit], 'TWO_F'),
      report_data.time_high_speed,
    ]);

    const allRunWithWorkEquipment = (
      mission_data.sensor_traveled_working !== null
        ? getDataTraveledYet(
          checkFixed([mission_data.sensor_traveled_working / 1000, 'км'], 'THREE_F'),
        )
        :      'Нет данных'
    );

    return (
      <>
        <div>* - расстояние, учитываемое при прохождении задания</div>
        <div>** - пройдено с рабочей скоростью / пройдено с превышением рабочей скорости</div>
        <DivGreen>
          <b>{'Пройдено с рабочей скоростью: '}</b>{withWorkSpeed}
        </DivGreen>
        <DivRed>
          <b>{'Пройдено с превышением рабочей скорости: '}</b>{withHightSpeed}
        </DivRed>
        <div>
          <b>{'Общее время стоянок: '}</b>{parkingCount || parkingCount === 0 ? secondsToTime(parkingCount) : 'Рассчитывается...'}
        </div>
        <div>
          <b>{'Общий пробег с работающим оборудованием: '}</b>{allRunWithWorkEquipment}
        </div>
        <div>
          <b>{'Процент выполнения задания, %: '}</b>{mission_data.traveled_percentage || '-'}
        </div>
      </>
    );
  },
);

export default InfoTableData;
