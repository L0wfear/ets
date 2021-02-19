import { withProps } from 'recompose';

import { IReportProps } from 'components/old/reports/@types/common.h';
import { ISchemaMaker } from 'components/old/ui/table/@types/schema.h';
import { exportable } from 'utils/decorators';
import ReportContainer from 'components/old/reports/common/ReportContainer';
import ReportHeader from 'components/old/reports/operational/tachograph/ReportHeader';
import { isNullOrUndefined } from 'util';

const serviceUrl = 'autobase/reports/tachograph';
const reportUrl = 'tachograph';
const serviceName = 'TachographReport';

const schemaMakers: ISchemaMaker = {};

const renderers = {
  okrug_name: ({ data }) => !isNullOrUndefined(data) ? data : '-',
  district_name: ({ data }) => !isNullOrUndefined(data) ? data : '-',
};
const summaryRenderes = {
  okrug_name: ({ data }) => !isNullOrUndefined(data) ? data : '-',
  district_name: ({ data }) => !isNullOrUndefined(data) ? data : '-',
};

const reportProps: IReportProps = {
  title: 'Отчет по тахографам',
  serviceName,
  reportUrl,
  serviceUrl,
  headerComponent: ReportHeader,
  renderers,
  tableProps: {
    reportKey: reportUrl,
  },
  enumerated: true,
  schemaMakers,
  notUseServerSummerTableForPrint: true,
  summaryRenderes,

};

const ExportableReportContainer = exportable({
  entity: serviceUrl,
})(ReportContainer);

export default withProps(reportProps)(ExportableReportContainer);
