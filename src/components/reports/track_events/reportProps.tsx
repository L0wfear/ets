import * as React from 'react';
import { Glyphicon } from 'react-bootstrap';

import { IReportProps } from 'components/reports/@types/common.h';

import { bindable } from 'utils/decorators';
import ReportHeader from './ReportHeader';
import DateFormatter from 'components/ui/DateFormatter';

export const serviceUrl = 'track_events';
const reportUrl = 'track-events-reports';
const serviceName = 'TrackEventsReportService';

const schemaMakers = {
  coords_msk: schema => ({
    ...schema,
    cssClassName: 'map-view',
  }),
  event_value: schema => ({
    ...schema,
    filter: {
      type: 'advanced-number',
    },
  }),
  finished_at: schema => ({
    ...schema,
    type: 'datetime',
    filter: {
      ...schema.filter,
      type: 'advanced-datetime',
    },
  }),
  started_at: schema => ({
    ...schema,
    type: 'datetime',
    filter: {
      ...schema.filter,
      type: 'advanced-datetime',
    },
  }),
};

const ShowMapButtonSFC = props =>
  <div>
    <span onClick={props.onClick}>
      <Glyphicon glyph="info-sign" />
    </span>
  </div>;

const ShowMapButton: any = bindable(ShowMapButtonSFC);

export const renderers = handleMapVisibility => ({
  okrug_name: ({ data }) => <div>{data || '-'}</div>,
  district_name: ({ data }) => <div>{data || '-'}</div>,
  coords_msk: meta =>
    <ShowMapButton
      onClick={handleMapVisibility}
      bindOnClick={meta.data}
    />,
    finished_at: ({ data }) => (<DateFormatter date={data} time />),
    started_at: ({ data }) => (<DateFormatter date={data} time />),
});

const reportProps: IReportProps = {
  title: 'Отчет по возможным сливам топлива',
  serviceName,
  reportUrl,
  serviceUrl,
  headerComponent: ReportHeader,
  enumerated: true,
  schemaMakers,
  useServerFilter: true,
};

export default reportProps;
