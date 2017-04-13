import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';
import { Button, Glyphicon, Row, Col } from 'react-bootstrap';
import Div from 'components/ui/Div.jsx';
import { connectToStores, FluxContext, HistoryContext, exportable } from 'utils/decorators';
import DateFormatter from 'components/ui/DateFormatter.jsx';
import Datepicker from 'components/ui/DatePicker.jsx';
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
      name: 'coords_msk',
      displayName: 'Координаты МСК',
      filter: false,
      cssClassName: 'map-view',
    },
    {
      name: 'coords_wgs',
      displayName: 'Координаты WGS',
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

@connectToStores(['reports'])
@exportable({ entity: 'track_events' })
@FluxContext
@HistoryContext
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

  printReport() {
    const payload = {
      company_id: this.props.routeParams.company_id,
      event_type: this.props.routeParams.event_type,
      date_start: this.props.routeParams.date_start,
      date_end: this.props.routeParams.date_end,
    };
    this.props.export(payload);
  }

  mapView(coords) {
    this.setState({ coords, showMap: true });
  }

  pushBack() {
    const query = {
      date_start: this.props.routeParams.date_start,
      date_end: this.props.routeParams.date_end,
    }
    this.context.history.pushState(null, '/track-events-reports', query);
  }

  renderHeader() {
    return (
      <Div>
        <Row>
          <Col md={4} />
          <Col md={5}>
            <Div><label>Период формирования</label></Div>
            <Div className="inline-block reports-date">
              <Datepicker disabled time={false} date={this.props.routeParams.date_start} />
            </Div>
            <Div className="inline-block reports-date">
              <Datepicker disabled time={false} date={this.props.routeParams.date_end} />
            </Div>
          </Col>
          <Col md={3}>
            <Button style={{position: 'relative', top: 30}} bsSize="small" onClick={() => this.pushBack()}>Назад</Button>
          </Col>
        </Row>
      </Div>
    );
  }

  render() {
    const { trackEventsReport = [] } = this.props;

    return (
      <div className="ets-page-wrap">
        {this.renderHeader()}
        <ReportTable data={trackEventsReport} mapView={coords => this.mapView(coords)}>
          <Button bsSize="small" onClick={() => this.printReport()}><Glyphicon glyph="download-alt" /></Button>
        </ReportTable>
        <MapModal coords={this.state.coords} showForm={this.state.showMap} onFormHide={() => this.setState({ showMap: false })} />
      </div>
    );
  }
}
