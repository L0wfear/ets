import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import Table from '../ui/table/DataTable.jsx';
import { Button, Glyphicon } from 'react-bootstrap';
import EtsSelect from '../ui/EtsSelect.jsx';
import Div from '../ui/Div.jsx';
import { getFormattedDateTimeSeconds } from '../../utils/dates.js';
import { getReportNotReadyNotification } from '../../utils/notifications.js';

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

	return <Table title='Прохождение заданий'
								tableMeta={tableMeta}
								results={props.data}
								renderers={renderers}
								{...props} />

}

class RouteLaunchReports extends Component {

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
		flux.getActions('missions').getMissionReports().then( r => console.log(r));
		flux.getActions('objects').getTechOperations();
	}

  onReportSelect({props}) {
    const id = props.data.id;
    if (props.data.status !== 'success') {
      global.NOTIFICATION_SYSTEM._addNotification(getReportNotReadyNotification(this.context.flux));
    } else {
      this.context.history.pushState(null, '/mission-report/'+id);
    }
  }

  handleGenerationTypeChange(type) {
    this.setState({generationType: type});
  }
  createMissionReport() {
		const { flux } = this.context;
		flux.getActions('missions').createMissionReport();
  }

	render() {

		const { reportsList = [], techOperationsList = [], missionReportsList } = this.props;
    const TECH_OPERATIONS = [{value: 'null', label: 'Все операции'}].concat(techOperationsList.map(({id, name}) => ({value: id, label: name})));

		return (
			<div className="ets-page-wrap">
      <Div className="route-report-panel">
        <Button bsSize="small" onClick={this.createMissionReport.bind(this)}>Сформировать отчет</Button>
      </Div>
				<CarsTable data={missionReportsList} onRowSelected={this.onReportSelect.bind(this)}>
				</CarsTable>
			</div>
		);

	}
}

RouteLaunchReports.contextTypes = {
  history: React.PropTypes.object,
	flux: React.PropTypes.object,
};

export default connectToStores(RouteLaunchReports, ['missions', 'objects']);
