import { withProps } from 'recompose';
import * as React from 'react';

import { IReportProps } from 'components/old/reports/@types/common.h';

import { exportable } from 'utils/decorators';
import ReportContainer from 'components/old/reports/common/ReportContainer';
import ReportHeader from 'components/old/reports/operational/car_usage_report_with_track/ReportHeader';
import Title from 'components/old/reports/common/Title';

const serviceUrl = 'car_usage_report';
const reportUrl = 'car-usage-report';
const serviceName = 'CarUsageReport';

const schemaMakers = {};

const renderers = {};

const infoMessage = 'Отчет строится по назначенным заданиям на ТС, попадающим в период формирования отчета. Если хотя бы одна координата поступала от ТС, то ТС учитывается в отчете.';
const titleText = 'Отчет по статистике выхода техники';

const title = (
  <Title
    text={titleText}
    hint={infoMessage}
  />
);

const reportProps: IReportProps = {
  title,
  titleText,
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
