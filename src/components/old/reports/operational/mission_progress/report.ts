import { withProps } from 'recompose';

import { IReportProps } from 'components/old/reports/@types/common.h';
import { ISchemaMaker } from 'components/old/ui/table/@types/schema.h';

import { exportable } from 'utils/decorators';
import ReportContainer from 'components/old/reports/common/ReportContainer';
import ReportHeader from 'components/old/reports/operational/mission_progress/ReportHeader';

const serviceUrl = 'mission_progress_report';
const reportUrl = 'mission-progress-report';
const serviceName = 'MissionProgressReportService';

const schemaMakers: ISchemaMaker = {
  plan_check_value: (schema) => ({
    ...schema,
    filter: {
      type: 'advanced-number',
    },
  }),
  fact_check_value: (schema) => ({
    ...schema,
    filter: {
      type: 'advanced-number',
    },
  }),
  sensor_percentage: (schema) => ({
    ...schema,
    filter: {
      type: 'advanced-number',
    },
  }),
  sensor_traveled_working: (schema) => ({
    ...schema,
    filter: {
      type: 'advanced-number',
    },
  }),
  sensor_traveled_idle: (schema) => ({
    ...schema,
    filter: {
      type: 'advanced-number',
    },
  }),
};
const renderers = {};
const tableProps = {
  reportKey: serviceUrl,
};

const reportProps: IReportProps = {
  title: 'Отчет посещения ОДХ/ДТ уборочной техникой, оборудованной датчиками КБМ',
  serviceName,
  enumerated: true,
  tableProps,
  reportUrl,
  serviceUrl,
  headerComponent: ReportHeader,
  renderers,
  schemaMakers,
  notUseServerSummerTable: true,
};

const ExportableReportContainer = exportable({
  entity: serviceUrl,
})(ReportContainer);

export default withProps(reportProps)(ExportableReportContainer);
