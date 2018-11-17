import {
  IMIssionData,
  IReportData,
} from 'components/missions/mission/MissionInfoForm/MissionInfoForm.h';

export type PropsInfoTableData = {
  mission_data: IMIssionData;
  report_data: IReportData;
  parkingCount: number | void;
};
