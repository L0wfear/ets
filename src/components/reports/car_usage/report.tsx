import { withProps } from 'recompose';
import * as React from 'react';

import { IReportProps } from 'components/reports/@types/common.h';

import { exportable } from 'utils/decorators';
import { multiselectFilterSchema, commonSchemaMakers } from 'components/reports/common/utils';
import ReportContainer from 'components/reports/common/ReportContainer';
import ReportHeader from './ReportHeader';
import Title from './Title';

const serviceUrl = 'car_usage_report';
const reportUrl = 'car-usage-report';
const serviceName = 'CarUsageReportService';


const schemaMakers = {
  ...commonSchemaMakers,
  func_type_group: schema => multiselectFilterSchema(schema),
};

const renderers = {};

const infoMessage = 'Отчет строится по назначенным заданиям на ТС, попадающим в период формирования отчета. Если хотя бы одна координата поступала от ТС, то ТС учитывается в отчете.';
const titleText = 'Статистика выхода техники';

const title = (
  <Title
    text={titleText}
    hint={infoMessage}
  />
);

const reportProps: IReportProps = {
  title,
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
