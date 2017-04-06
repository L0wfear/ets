import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';
import { Button, Glyphicon } from 'react-bootstrap';
import { connectToStores, FluxContext, exportable } from 'utils/decorators';
import DateFormatter from 'components/ui/DateFormatter.jsx';
import schema from './TrackEventsReportsSchema';
import MapModal from '../MapModal.jsx';

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
      name: 'coords',
      displayName: 'Координаты',
      filter: false,
      cssClassName: 'map-view',
    },
  ],
};

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
      coords: (meta) => (
        <div>
          <span onClick={() => props.mapView(meta.data.split(', '))}>
            <Glyphicon glyph="info-sign" />
          </span>
        </div>
      ),
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

@connectToStores(['reports'])
// @exportable({ entity: 'route_odh_covering_report/' })
@FluxContext
export default class TrackEventsReport extends Component {

  state = {
    coords: null,
  }

  componentDidMount() {
    const { flux } = this.context;
    const payload = {
      company_id: this.props.routeParams.company_id,
      event_type: this.props.routeParams.event_type,
      date_start: this.props.routeParams.date_start,
      date_end: this.props.routeParams.date_end,
    };
    flux.getActions('reports').getTrackEventsReport(payload);
  }

  mapView(coords) {
    this.setState({ coords, showMap: true });
  }

  render() {
    const { trackEventsReport = [] } = this.props;

    return (
      <div className="ets-page-wrap">
        <ReportTable data={trackEventsReport} mapView={coords => this.mapView(coords)}>
          {false && <Button bsSize="small" onClick={() => this.props.export({}, true)}><Glyphicon glyph="download-alt" /></Button>}
        </ReportTable>
        <MapModal coords={this.state.coords} showForm={this.state.showMap} onFormHide={() => this.setState({ showMap: false })} />
      </div>
    );
  }
}
