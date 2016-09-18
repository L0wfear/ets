import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';
import { getToday9am, getTomorrow9am, getFormattedDateTimeSeconds } from 'utils/dates';
import { getReportNotReadyNotification3 } from 'utils/notifications';
import DailyReportHeader from 'components/reports/DailyReportHeader.jsx';
import { getReportStatusLabel, getGeozoneTypeLabel } from 'utils/labelFunctions';
import { FluxContext, HistoryContext, exportable, staticProps, connectToStores } from 'utils/decorators';
import find from 'lodash/find';

const getElementLabel = (el) => {
  const element = find([
    { value: 'roadway', label: 'Проезжая часть' },
    { value: 'footway', label: 'Тротуар' },
    { value: 'yard', label: 'Двор' }], obj => obj.value === el) || {};
  return element.label || '';
};

const tableMeta = {
  cols: [
    {
      name: 'status',
      displayName: 'Статус',
      type: 'text',
      filter: {
        type: 'select',
        labelFunction: getReportStatusLabel,
      },
    },
    {
      name: 'geozone_type',
      displayName: 'Объект',
      type: 'number',
      filter: {
        type: 'select',
        labelFunction: getGeozoneTypeLabel,
      },
    },
    {
      name: 'element',
      displayName: 'Элемент',
      type: 'number',
      filter: {
        type: 'select',
        labelFunction: el => getElementLabel(el),
      },
    },
    {
      name: 'date_start',
      displayName: 'Начало периода',
      type: 'number',
      filter: {
        type: 'date',
      },
    },
    {
      name: 'date_end',
      displayName: 'Конец периода',
      type: 'number',
      filter: {
        type: 'date',
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
  ],
};

const WeeklyTechnicalOperationCompleteReportsTable = (props) => {
  const renderers = {
    status: ({ data }) => <div>{data ? getReportStatusLabel(data) : ''}</div>,
    geozone_type: ({ data }) => <div>{data ? getGeozoneTypeLabel(data) : ''}</div>,
    element: ({ data }) => <div>{data ? getElementLabel(data) : ''}</div>,
    date_start: ({ data }) => <div>{data ? getFormattedDateTimeSeconds(data) : ''}</div>,
    date_end: ({ data }) => <div>{data ? getFormattedDateTimeSeconds(data) : ''}</div>,
    timestamp_create: ({ data }) => <div>{data ? getFormattedDateTimeSeconds(data) : ''}</div>,
    timestamp_process_begin: ({ data }) => <div>{data ? getFormattedDateTimeSeconds(data) : ''}</div>,
    timestamp_process_end: ({ data }) => <div>{data ? getFormattedDateTimeSeconds(data) : ''}</div>,
  };

  return (<Table title="Статус по выполнению технологических операций"
    tableMeta={tableMeta}
    results={props.data}
    renderers={renderers}
    initialSort={'timestamp_create'}
    initialSortAscending={false}
    {...props}
  />);
};

@connectToStores(['reports'])
@exportable({ entity: 'status_of_technical_operation_execution_weekly_report' })
@FluxContext
@HistoryContext
@staticProps({
  entity: 'status_of_technical_operation_execution_weekly_report',
})
export default class WeeklyTechnicalOperationCompleteReports extends Component {

  constructor(props) {
    super(props);

    const [date_start, date_end] = [getToday9am(), getTomorrow9am()];

    this.state = {
      date_start,
      date_end,
      geozone_type: 'odh',
      element: 'roadway',
      car_type_id_list: [],
    };
  }

  componentDidMount() {
    const { flux } = this.context;
    flux.getActions('reports').getWeeklyTechnicalOperationCompleteReports();
  }

  onReportSelect({ props }) {
    const id = props.data.id;
    if (props.data.status !== 'success' && props.data.status !== 'fail') {
      global.NOTIFICATION_SYSTEM.notify(getReportNotReadyNotification3(this.context.flux));
    } else if (props.data.status !== 'fail') {
      this.context.history.pushState(null, `/weekly-technical-operation-complete-report/${props.data.element}/${id}`);
    }
  }

  handleChange(field, value) {
    this.setState({ [field]: value });
  }

  createWeeklyTechnicalOperationCompleteReport() {
    const { flux } = this.context;
    flux.getActions('reports').createWeeklyTechnicalOperationCompleteReport(this.state);
  }

  render() {
    console.log('state is', this.state);

    const { weeklyTechnicalOperationCompleteReportsList = [] } = this.props;

    return (
      <div className="ets-page-wrap">
        <DailyReportHeader handleChange={this.handleChange.bind(this)} onClick={this.createWeeklyTechnicalOperationCompleteReport.bind(this)} {...this.state} />

        <WeeklyTechnicalOperationCompleteReportsTable
          data={weeklyTechnicalOperationCompleteReportsList}
          onRowSelected={this.onReportSelect.bind(this)}
        >
          {/* <Button bsSize="small" onClick={() => this.props.export()}><Glyphicon glyph="download-alt"/></Button> */}
        </WeeklyTechnicalOperationCompleteReportsTable>
      </div>
    );
  }
}
