import { withProps } from 'recompose';

import { IReportProps } from 'components/reports/@types/common.h';

import { exportable } from 'utils/decorators';
import ReportContainer from 'components/reports/common/ReportContainer';
import ReportHeader from './ReportHeader';

const serviceUrl = 'long_tech_maintenance';
const reportUrl = 'long-tech-maintenance';
const serviceName = 'LongTechMaintenance';

const schemaMakers = {};

const renderers = {};

const reportProps: IReportProps = {
  title: 'Отчет по транспортным средствам, простаивающим длительное время в ремонтной зоне',
  serviceName,
  reportUrl,
  serviceUrl,
  headerComponent: ReportHeader,
  renderers,
  enumerated: true,
  schemaMakers,
};

const ExportableReportContainer = exportable({
  entity: serviceUrl,
})(ReportContainer);

export default withProps(reportProps)(ExportableReportContainer);
