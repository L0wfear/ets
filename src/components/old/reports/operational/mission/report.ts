import { withProps } from 'recompose';
import { isNumber } from 'lodash';

import { IReportProps } from 'components/old/reports/@types/common.h';

import { exportable } from 'utils/decorators';
import ReportContainer from 'components/old/reports/common/ReportContainer';
import ReportHeader from 'components/old/reports/operational/mission/ReportHeader';
import { createValidDateTimeDots } from 'components/@next/@utils/dates/dates';

const serviceUrl = 'car_travel_report';
const reportUrl = 'mission-reports';
const serviceName = 'MissionReportsService';

const schemaMakers = {
  object_type: (schema) => ({
    ...schema,
    filter: {
      type: 'multiselect',
      options: [
        { label: 'ОДХ', value: 'ОДХ' },
        { label: 'ДТ', value: 'ДТ' },
        { label: 'ПН', value: 'ПН' },
      ],
    },
  }),
};

function tableColValueParser({ data }) {
  if (isNumber(data)) {
    return data.toFixed(2);
  }

  return data ? data : '-';
}

const renderers = {
  order_date_from: ({ data }) => data ? createValidDateTimeDots(data) : '-',
  order_date_to: ({ data }) => data ? createValidDateTimeDots(data) : '-',
  date_start: ({ data }) => data ? createValidDateTimeDots(data) : '-',
  date_end: ({ data }) => data ? createValidDateTimeDots(data) : '-',
  waybill_number: ({ data }) => data ? data : '-',
  mission_number: ({ data }) => data ? data : '-',
  mission_status: ({ data }) => data ? data : '-',
  measure_unit_name: ({ data }) => data ? data : '-',
  plan_order: ({ data }) => data ? data : '-',
  plan_order_mission: ({ data }) => data ? data : '-',
  not_coverage: ({ data }) => data ? data : '-',
  fact_traveled_area: tableColValueParser,
};

const reportProps: IReportProps = {
  enumerated: true,
  enumeratedChildren: true,
  headerComponent: ReportHeader,
  notUseServerSummerTable: true,
  renderers,
  reportUrl,
  schemaMakers,
  serviceName,
  serviceUrl,
  summaryTitle: 'Итого',
  tableProps: { reportKey: serviceUrl },
  title: 'Прохождение заданий',
};

const ExportableReportContainer = exportable({
  entity: serviceUrl,
})(ReportContainer);

export default withProps(reportProps)(ExportableReportContainer);
