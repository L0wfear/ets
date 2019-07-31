import { withProps } from 'recompose';

import { IReportProps } from 'components/old/reports/@types/common.h';

import { exportable } from 'utils/decorators';
import ReportContainer from 'components/old/reports/common/ReportContainer';
import ReportHeader from 'components/old/reports/operational/car-condition/ReportHeader';

const serviceUrl = 'car_condition_report';
const reportUrl = 'car-condition-reports';
const serviceName = 'CarConditionReport';

const schemaMakers = {};

const renderers = {};

const reportProps: IReportProps = {
  title: 'Количество ТС в разрезе технического состояния',
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
