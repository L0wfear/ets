import * as React from 'react';
import { withProps } from 'recompose';

import { IReportProps } from 'components/reports/@types/common.h';
import { ISchemaMaker } from 'components/ui/table/@types/schema.h';

import { parseMultiSelectListQueryParams } from 'components/reports/common/utils';
import { exportable } from 'utils/decorators';
import ReportContainer from 'components/reports/common/ReportContainer';
import ReportHeader from './ReportHeader';
import DeltaTableHeader from './DeltaTableHeader';

const serviceUrl = 'route_odh_coverage_report';
const reportUrl = 'route-odh-coverage-report';
const serviceName = 'RouteODHCoverageReportService';

const deltaHeaderTooltip = `
  Разница между полем "Длина маршрута" и характеристикой объекта (характеристика зависит от типа проверки тех. операции: 
  если Тип проверки = Чекин или Площадь Проезжей части или Протяженность по основной оси, то берется "Протяженность ОДХ";
  если Тип проверки= Площадь тротуара с мехуборкой, то берется "Длина тротуара";
  если Тип проверки = Протяженность по лотку, то берется "Длина лотков")
`;

const schemaMakers: ISchemaMaker = {
  routes_names: schema => ({
    ...schema,
    filter: {
      type: 'string',
    },
  }),
  delta: schema => ({
    ...schema,
    customHeaderComponent: <DeltaTableHeader name={schema.displayName} tooltip={deltaHeaderTooltip} />,
  }),
};
const renderers = {
  routes_names: ({ data }) => <span>{data.join(', ')}</span>,
};
const headerStateMaker = queryState => parseMultiSelectListQueryParams(queryState, ['technical_operations_ids']);

const reportProps: IReportProps = {
  title: 'Покрытие ОДХ маршрутами',
  enumerated: true,
  serviceName,
  reportUrl,
  serviceUrl,
  headerComponent: ReportHeader,
  renderers,
  summaryRenderes: renderers,
  schemaMakers,
  headerStateMaker,
};

const ExportableReportContainer = exportable({
  entity: serviceUrl,
})(ReportContainer);

export default withProps(reportProps)(ExportableReportContainer);
