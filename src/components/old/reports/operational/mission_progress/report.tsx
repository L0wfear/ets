import * as React from 'react';
import { withProps } from 'recompose';

import { IReportProps } from 'components/old/reports/@types/common.h';
import { ISchemaMaker } from 'components/old/ui/table/@types/schema.h';

import { exportable } from 'utils/decorators';
import ReportContainer from 'components/old/reports/common/ReportContainer';
import ReportHeader from 'components/old/reports/operational/mission_progress/ReportHeader';
import EtsBootstrap from 'components/new/ui/@bootstrap';

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
    displayName: (
      <React.Fragment>
        {schema.displayName}
        {' '}
        <EtsBootstrap.OverlayTrigger
          trigger={['hover', 'focus']}
          overlay={(
            <EtsBootstrap.Popover>
              {
                'Суммарное значение всех строк соответствующей тех. операции и элементу из выданных заданий. '
                + 'Исключаются перепробеги: если при выборке данных из задания "Факт уборки" > "Плана уборки", '
                + 'то в сумму расчета колонки “Факт уборки” из данного задания должно попадать значение Плана уборки задания.'
              }
            </EtsBootstrap.Popover>
          )}
          placement="left"
        >
          <EtsBootstrap.Glyphicon glyph="info-sign"/>
        </EtsBootstrap.OverlayTrigger>
      </React.Fragment>
    ),
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

const renderers = {
  remain_value: ({ data }) => data ? data.toFixed(2) : data,
  rerun: ({ data }) => data ? data.toFixed(2) : data,
};

const summarySchemaMakers: ISchemaMaker = {
  fact_check_value: (schema) => ({
    ...schemaMakers.fact_check_value(schema),
  }),
  remain_value: (schema) => ({
    ...schema,
    render: renderers.remain_value,
  }),
  rerun: (schema) => ({
    ...schema,
    render: renderers.rerun,
  }),
};

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
  summarySchemaMakers,
  notUseServerSummerTable: true,
};

const ExportableReportContainer = exportable({
  entity: serviceUrl,
})(ReportContainer);

export default withProps(reportProps)(ExportableReportContainer);
