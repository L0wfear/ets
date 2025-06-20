import { withProps } from 'recompose';

import { IReportProps } from 'components/old/reports/@types/common.h';

import { exportable } from 'utils/decorators';
import ReportContainer from 'components/old/reports/common/ReportContainer';
import ReportHeader from 'components/old/reports/operational/fuel_cards_report/ReportHeader';
import { createValidDateDots } from 'components/@next/@utils/dates/dates';

const serviceUrl = 'fuel_cards_report';
const reportUrl = 'fuel_cards_report';
const serviceName = 'FuelCardsReportService';

const schemaMakers = {};

const renderers = {
  refill_date: ({ data }) => createValidDateDots(data),
};

const reportProps: IReportProps = {
  title: 'Отчёт по топливным картам',
  serviceName,
  reportUrl,
  serviceUrl,
  headerComponent: ReportHeader,
  renderers,
  enumerated: true,
  schemaMakers,
  summaryTitle: 'Итого по топливным картам:',
  notUseServerSummerTable: true, // for custom summary
  tableProps: {  // for custom summary
    reportKey: serviceUrl,
  },
};

const ExportableReportContainer = exportable({
  entity: serviceUrl,
})(ReportContainer);

export default withProps(reportProps)(ExportableReportContainer);
