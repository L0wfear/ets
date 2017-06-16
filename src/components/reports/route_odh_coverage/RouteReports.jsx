import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';
import { Button } from 'react-bootstrap';
import EtsSelect from 'components/ui/EtsSelect.jsx';
import Div from 'components/ui/Div.jsx';
import { REPORT_STATUSES } from 'constants/statuses';
import { getFormattedDateTimeSeconds } from 'utils/dates';
import { FluxContext, HistoryContext, exportable, staticProps, connectToStores } from 'utils/decorators';
import { getReportNotReadyNotification2 } from 'utils/notifications';


export const tableMeta = props => ({
  cols: [
    {
      name: 'company_name',
      displayName: 'Учреждение',
      type: 'text',
      display: props ? props.isOkrug : false,
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'status',
      displayName: 'Статус',
      type: 'text',
      filter: {
        type: 'multiselect',
        labelFunction: s => REPORT_STATUSES[s] || REPORT_STATUSES.default,
      },
    },
    {
      name: 'operation_name',
      displayName: 'Тех. операция',
      type: 'text',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'timestamp_create',
      displayName: 'Дата создания',
      type: 'number',
      filter: {
        type: 'date',
      },
    },
    {
      name: 'timestamp_process_begin',
      displayName: 'Дата начала обработки',
      type: 'number',
      filter: {
        type: 'date',
      },
    },
    {
      name: 'timestamp_process_end',
      displayName: 'Дата завершения обработки',
      type: 'number',
      filter: {
        type: 'date',
      },
    },
    {
      name: 'odh_fail_count',
      displayName: 'Кол-во непокрытых',
      type: 'number',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'odh_total_count',
      displayName: 'Общее кол-во',
      type: 'number',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'odh_success_count',
      displayName: 'Кол-во покрытых',
      type: 'number',
      filter: {
        type: 'multiselect',
      },
    },
  ],
});

const RouteOdhCoveringReportsTable = (props) => {
  const renderers = {
    status: ({ data }) => <div>{REPORT_STATUSES[data] || REPORT_STATUSES.default}</div>,
    timestamp_create: ({ data }) => <div>{data ? getFormattedDateTimeSeconds(data) : ''}</div>,
    timestamp_process_begin: ({ data }) => <div>{data ? getFormattedDateTimeSeconds(data) : ''}</div>,
    timestamp_process_end: ({ data }) => <div>{data ? getFormattedDateTimeSeconds(data) : ''}</div>,
  };

  return (
    <Table
      title="Покрытие ОДХ маршрутами"
      tableMeta={tableMeta(props)}
      results={props.data}
      renderers={renderers}
      initialSort={tableMeta(props).cols[2].name}
      initialSortAscending={false}
      {...props}
    />
  );
};

@connectToStores(['routes', 'objects', 'session'])
@exportable({ entity: 'route_odh_covering_report' })
@FluxContext
@HistoryContext
@staticProps({
  entity: 'route_odh_covering_report',
})
export default class RouteOdhCoveringReports extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedCar: null,
      showForm: false,
      generationType: 'null',
    };
  }

  componentDidMount() {
    const { flux } = this.context;
    flux.getActions('routes').getRouteReports();
    flux.getActions('technicalOperation').getTechnicalOperations();
  }

  onReportSelect({ props }) {
    const id = props.data.id;
    if (props.data.status !== 'success' && props.data.status !== 'fail') {
      global.NOTIFICATION_SYSTEM.notify(getReportNotReadyNotification2(this.context.flux));
    } else if (props.data.status !== 'fail') {
      this.context.history.pushState(null, `/route-report/${id}`);
    }
  }

  handleGenerationTypeChange(type) {
    this.setState({ generationType: type });
  }

  createRouteReport() {
    console.log(' creating report', this.state.generationType);
    const { flux } = this.context;
    flux.getActions('routes').createRouteReport(this.state.generationType);
  }

  render() {
    const { reportsList = [], technicalOperationsList = [] } = this.props;
    const TECH_OPERATIONS = [{ value: 'null', label: 'Все операции' }].concat(technicalOperationsList.filter(route => route.object_name.indexOf('ОДХ') > -1).map(({ id, name }) => ({ value: id, label: name })));

    return (
      <div className="ets-page-wrap">
        <Div className="route-report-panel">
          <Button bsSize="small" onClick={this.createRouteReport.bind(this)}>Сформировать отчет</Button>
          <EtsSelect
            options={TECH_OPERATIONS}
            value={this.state.generationType}
            onChange={this.handleGenerationTypeChange.bind(this)}
            clearable={false}
          />
        </Div>
        <RouteOdhCoveringReportsTable data={reportsList} onRowSelected={this.onReportSelect.bind(this)}>
          {/* <Button bsSize="small" onClick={() => this.props.export()}><Glyphicon glyph="download-alt" /></Button> */}
        </RouteOdhCoveringReportsTable>
      </div>
    );
  }
}
