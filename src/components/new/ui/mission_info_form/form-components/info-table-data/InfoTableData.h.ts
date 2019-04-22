import {
  IMIssionData,
  IReportData,
} from 'components/new/ui/mission_info_form/MissionInfoForm.h';

export type PropsInfoTableData = {
  mission_data: IMIssionData;
  report_data: IReportData;
  parkingCount: number | void;
};
