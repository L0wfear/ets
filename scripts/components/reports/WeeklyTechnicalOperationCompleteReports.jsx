import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import Table from '../ui/table/DataTable.jsx';
import { Button, Glyphicon, Row, Col } from 'react-bootstrap';
import EtsSelect from '../ui/EtsSelect.jsx';
import Div from '../ui/Div.jsx';
import Field from '../ui/Field.jsx';
import Datepicker from '../ui/DatePicker.jsx';
import { getToday9am, getTomorrow9am, getToday0am, getToday2359, getFormattedDateTimeSeconds } from 'utils/dates';
import { getReportNotReadyNotification } from 'utils/notifications';
import { isEmpty } from 'utils/functions';
import DailyReportHeader from './DailyReportHeader.jsx';

let getStatusLabel = (status) => {
  let result = '';

  switch (status) {
    case 'fail':
      result = 'Ошибка';
      break;
    case 'success':
      result = 'Обработан';
      break;
    case 'in progress':
      result = 'В обработке';
      break;
    case 'wait':
      result = 'В очереди';
      break;
  }

  return result;
};

let getTypeLabel = (type) => type === 'distance' ? 'Протяженность' : type;

let tableMeta = {
	cols: [
		{
			name: 'status',
			caption: 'Статус',
			type: 'text',
			filter: {
				type: 'select',
			}
		},
		{
			name: 'mission_name',
			caption: 'Задание',
			type: 'number',
			filter: {
				type: 'select',
			},
		},
		{
			name: 'technical_operation_name',
			caption: 'Тех. операция',
			type: 'number',
			filter: {
				type: 'select',
			},
		},
		{
			name: 'timestamp_create',
			caption: 'Дата создания',
			type: 'number',
			filter: {
				type: 'select',
			},
		},
		{
			name: 'timestamp_process_begin',
			caption: 'Дата начала обработки',
			type: 'number',
			filter: {
				type: 'select',
			},
		},
		{
			name: 'timestamp_process_end',
			caption: 'Дата завершения обработки',
			type: 'number',
			filter: {
				type: 'select',
			},
		},
	]
}

let CarsTable = (props) => {

	const renderers = {
    status: ({data}) => <div>{data ? getStatusLabel(data) : ''}</div>,
    timestamp_create: ({data}) => <div>{data ? getFormattedDateTimeSeconds(data) : ''}</div>,
    timestamp_process_begin: ({data}) => <div>{data ? getFormattedDateTimeSeconds(data) : ''}</div>,
    timestamp_process_end: ({data}) => <div>{data ? getFormattedDateTimeSeconds(data) : ''}</div>,
	};

	return <Table title='Статус по выполнению технологических операций'
								tableMeta={tableMeta}
								results={props.data}
								renderers={renderers}
								{...props} />

}

class WeeklyTechnicalOperationCompleteReports extends Component {

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
		flux.getActions('missions').getMissionReports();
	}

  onReportSelect({props}) {
    const id = props.data.id;
    if (props.data.status !== 'success') {
      global.NOTIFICATION_SYSTEM._addNotification(getReportNotReadyNotification(this.context.flux));
    } else {
      this.context.history.pushState(null, `/mission-report/${id}`);
    }
  }

  handleChange(field, value) {
		this.setState({[field]: value});
	}

  createDailyCleaningReport() {
		const { flux } = this.context;
		//flux.getActions('missions').createMissionReport(this.state.mission_date_start_from, this.state.mission_date_end_to);
  }

	render() {

    console.log('state is', this.state);

		const { missionReportsList = [] } = this.props;

		return (
			<div className="ets-page-wrap">
  			<DailyReportHeader handleChange={this.handleChange.bind(this)} onClick={this.createDailyCleaningReport.bind(this)} {...this.state}/>

				{/*<CarsTable data={missionReportsList} onRowSelected={this.onReportSelect.bind(this)} />*/}
			</div>
		);

	}
}

WeeklyTechnicalOperationCompleteReports.contextTypes = {
  history: React.PropTypes.object,
	flux: React.PropTypes.object,
};

export default connectToStores(WeeklyTechnicalOperationCompleteReports, ['objects']);
