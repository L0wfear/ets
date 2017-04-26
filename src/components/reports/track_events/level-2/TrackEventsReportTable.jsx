import React from 'react';
import { Glyphicon } from 'react-bootstrap';

import Table from 'components/ui/table/DataTable.jsx';
import DateFormatter from 'components/ui/DateFormatter.jsx';
import schema from './TrackEventsReportSchema';

const tableMeta = {
  cols: [
    {
      name: 'okrug_name',
      displayName: 'Округ',
      type: 'text',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'company_name',
      displayName: 'Учреждение',
      type: 'text',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'started_at',
      displayName: 'Дата и время начала',
      type: 'text',
      filter: {
        type: 'datetime',
      },
    },
    {
      name: 'finished_at',
      displayName: 'Дата и время окончания',
      type: 'text',
      filter: {
        type: 'datetime',
      },
    },
    {
      name: 'type_name',
      displayName: 'Тип ТС',
      type: 'text',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'model_name',
      displayName: 'Модель ТС',
      type: 'text',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'gov_number',
      displayName: 'Рег. номер ТС',
      type: 'text',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'event_name',
      displayName: 'Событие',
      type: 'text',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'event_value',
      displayName: 'Объем, л',
      type: 'number',
      filter: {
        type: 'number',
      },
    },
    {
      name: 'coords_msk',
      displayName: 'Координаты МСК',
      filter: false,
      cssClassName: 'map-view',
    },
    {
      name: 'coords_wgs',
      displayName: 'Координаты WGS',
      display: false,
      filter: false,
      cssClassName: 'map-view',
    },
  ],
};

const MapButtonRenderer = props => (
  <div>
    <span onClick={() => props.mapView(props.data.split(', '))}>
      <Glyphicon glyph="info-sign" />
    </span>
  </div>
);

const ReportTable = (props) => {
  const renderers = () => {
    const floats = {};
    schema.forEach((p) => {
      if (p.float) {
        floats[p.key] = ({ data }) => <div>
          {p && !isNaN(data) && data != null && data !== '' ? parseFloat(data).toFixed(p.float) : data}
        </div>;
      }
    });
    return ({
      ...floats,
      started_at: ({ data }) => <DateFormatter date={data} time />,
      finished_at: ({ data }) => <DateFormatter date={data} time />,
      coords_msk: meta => <MapButtonRenderer data={meta.data} mapView={props.mapView} />,
      coords_wgs: meta => <MapButtonRenderer data={meta.data} mapView={props.mapView} />,
    });
  };

  return (
    <Table
      title="Отчет по возможным сливам топлива"
      tableMeta={tableMeta}
      results={props.data}
      renderers={renderers()}
      {...props}
    />
  );
};

export default ReportTable;
