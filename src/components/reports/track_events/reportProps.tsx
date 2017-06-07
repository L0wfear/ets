import * as React from 'react';
import { Glyphicon } from 'react-bootstrap';

import { IReportProps } from 'components/reports/@types/common.h';

import { bindable } from 'utils/decorators';
import { multiselectFilterSchema, commonSchemaMakers } from 'components/reports/common/utils';
import ReportHeader from './ReportHeader';

export const serviceUrl = 'track_events';
const reportUrl = 'track-events-reports';
const serviceName = 'TrackEventsReportService';

const schemaMakers = {
  ...commonSchemaMakers,
  fuel_type_name: schema => multiselectFilterSchema(schema),
  car_model_name: schema => multiselectFilterSchema(schema),
  car_gov_number: schema => multiselectFilterSchema(schema),
  employee_name: schema => multiselectFilterSchema(schema),
  coords_msk: schema => ({
    ...schema,
    cssClassName: 'map-view',
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
  coords_msk: meta =>
    <ShowMapButton
      onClick={handleMapVisibility}
      bindOnClick={meta.data}
    />,
});

const reportProps: IReportProps = {
  title: 'Отчет по возможным сливам топлива',
  serviceName,
  reportUrl,
  serviceUrl,
  headerComponent: ReportHeader,
  enumerated: true,
  schemaMakers,
};

export default reportProps;
