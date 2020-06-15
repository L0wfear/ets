import { withProps } from 'recompose';
import * as React from 'react';
import { IReportProps } from 'components/old/reports/@types/common.h';

import { exportable } from 'utils/decorators';
import ReportContainer from 'components/old/reports/common/ReportContainer';
import ReportHeader from 'components/old/reports/operational/mission/ReportHeader';
import { createValidDateTimeDots } from 'components/@next/@utils/dates/dates';
import ShowMissionInfo from 'components/old/reports/operational/mission/form/ShowMissionInfo';
import EtsBootstrap from 'components/new/ui/@bootstrap';

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
  route_traveled_percentage: (schema) => ({
    ...schema,
    displayName: (
      <React.Fragment>
        {schema.displayName}
        <EtsBootstrap.OverlayTrigger
          trigger={['hover', 'focus']}
          overlay={(
            <EtsBootstrap.Popover>
              {
                'Данные актуальны на момент формирования отчета'
              }
            </EtsBootstrap.Popover>
          )}
          placement="left"
        >
          <EtsBootstrap.Glyphicon glyph="info-sign"/>
        </EtsBootstrap.OverlayTrigger>
      </React.Fragment>
    ),
  }),
};

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
  mission_id: ({ data }) => data ? <ShowMissionInfo id={data} />: '-',
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
