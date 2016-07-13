import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import Table from 'components/ui/table/DataTable.jsx';
import { Button, Glyphicon, Row, Col } from 'react-bootstrap';
import EtsSelect from 'components/ui/EtsSelect.jsx';
import Div from 'components/ui/Div.jsx';
import Field from 'components/ui/Field.jsx';
import Datepicker from 'components/ui/DatePicker.jsx';
import { datePickerFunction, getReportStatusLabel, getGeozoneTypeLabel} from 'utils/labelFunctions';
import { getToday9am, getTomorrow9am, getToday0am, getToday2359, getFormattedDateTime } from 'utils/dates';
import { getReportNotReadyNotification2 } from 'utils/notifications';
import { isEmpty } from 'utils/functions';
import DailyReportHeader from 'components/reports/DailyReportHeader.jsx';

let getElementLabel = (el) => {
  let element = _.find([
    {value: 'roadway', label: 'Проезжая часть'},
    {value: 'footway', label: 'Тротуар'},
    {value: 'yard', label: 'Двор'}], obj => obj.value === el) || {};
  return element.label || '';
};

let tableMeta = {
	cols: [
		{
			name: 'status',
			caption: 'Статус',
			type: 'text',
			filter: {
				type: 'select',
        labelFunction: getReportStatusLabel
			}
		},
		{
			name: 'geozone_type',
			caption: 'Объект',
			type: 'number',
			filter: {
				type: 'select',
        labelFunction: getGeozoneTypeLabel
			},
		},
		{
			name: 'element',
			caption: 'Элемент',
			type: 'number',
			filter: {
				type: 'select',
        labelFunction: (s) => getElementLabel(s)
			},
		},
		{
			name: 'date_start',
			caption: 'Начало периода',
			type: 'number',
			filter: {
        type: 'date_create',
        labelFunction: datePickerFunction
			},
		},
		{
			name: 'date_end',
			caption: 'Конец периода',
			type: 'number',
			filter: {
        type: 'date_create',
        labelFunction: datePickerFunction
			},
		},
		{
			name: 'timestamp_create',
			caption: 'Дата создания',
			type: 'number',
			filter: {
        type: 'date_create',
        labelFunction: datePickerFunction
			},
		},
		{
			name: 'timestamp_process_begin',
			caption: 'Дата начала обработки',
			type: 'number',
			filter: {
        type: 'date_create',
        labelFunction: datePickerFunction
			},
		},
		{
			name: 'timestamp_process_end',
			caption: 'Дата завершения обработки',
			type: 'number',
			filter: {
        type: 'date_create',
        labelFunction: datePickerFunction
			},
		},
	]
}

let DailyCleaningReportsTable = (props) => {

	const renderers = {
    status: ({data}) => <div>{data ? getReportStatusLabel(data) : ''}</div>,
    geozone_type: ({data}) => <div>{data ? getGeozoneTypeLabel(data) : ''}</div>,
    element: ({data}) => <div>{data ? getElementLabel(data) : ''}</div>,
    date_start: ({data}) => <div>{data ? getFormattedDateTime(data) : ''}</div>,
    date_end: ({data}) => <div>{data ? getFormattedDateTime(data) : ''}</div>,
    timestamp_create: ({data}) => <div>{data ? getFormattedDateTime(data) : ''}</div>,
    timestamp_process_begin: ({data}) => <div>{data ? getFormattedDateTime(data) : ''}</div>,
    timestamp_process_end: ({data}) => <div>{data ? getFormattedDateTime(data) : ''}</div>,
	};

	return <Table title='Статус по уборке'
								tableMeta={tableMeta}
								results={props.data}
								renderers={renderers}
                initialSort={'timestamp_create'}
                initialSortAscending={false}
								{...props} />

}

class DailyCleaningReportsETS extends Component {

	constructor(props) {
		super(props);

    let [date_start, date_end] = [getToday9am(), getTomorrow9am()];

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
		flux.getActions('reports').getDailyCleaningReportsETS();
	}

  onReportSelect({props}) {
    const id = props.data.id;
    if (props.data.status !== 'success' && props.data.status !== 'fail') {
      global.NOTIFICATION_SYSTEM._addNotification(getReportNotReadyNotification2(this.context.flux));
    } else if (props.data.status !== 'fail'){
      this.context.history.pushState(null, `/daily-cleaning-report-ets/${props.data.element}/${id}`);
    }
  }

  handleChange(field, value) {
		this.setState({[field]: value});
	}

  createDailyCleaningReportETS() {
		const { flux } = this.context;
    flux.getActions('reports').createDailyCleaningReportETS(this.state);
  }

	render() {

    console.log('state is', this.state);

		const { dailyCleaningReportsListETS = [] } = this.props;

		return (
			<div className="ets-page-wrap">
  			<DailyReportHeader
            handleChange={this.handleChange.bind(this)}
            onClick={this.createDailyCleaningReportETS.bind(this)}
            {...this.state}/>
				<DailyCleaningReportsTable
            data={dailyCleaningReportsListETS}
            refreshable={true}
            onRefresh={() => this.context.flux.getActions('reports').getDailyCleaningReportsETS()}
            onRowSelected={this.onReportSelect.bind(this)} />
			</div>
		);

	}
}

DailyCleaningReportsETS.contextTypes = {
  history: React.PropTypes.object,
	flux: React.PropTypes.object,
};

export default connectToStores(DailyCleaningReportsETS, ['reports']);
