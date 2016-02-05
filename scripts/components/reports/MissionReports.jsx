import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import Table from '../ui/table/DataTable.jsx';
import { Button, Glyphicon } from 'react-bootstrap';
import EtsSelect from '../ui/EtsSelect.jsx';
import Div from '../ui/Div.jsx';
import { getFormattedDateTimeSeconds } from '../../utils/dates.js';

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
      name: 'mission_number',
      caption: '№ Задания',
      type: 'string',
      filter: {
        type: 'select',
      },
    },
		{
			name: 'driver_name',
			caption: 'Водитель',
			type: 'string',
			filter: {
				type: 'select',
			}
		},
		{
			name: 'car_gov_number',
			caption: 'Гос. номер ТС',
			type: 'string',
			filter: {
				type: 'select',
			}
		},
		{
			name: 'technical_operation_name',
			caption: 'Тех. операция',
			type: 'string',
			filter: {
				type: 'select',
			}
		},
		{
			name: 'route_name',
			caption: 'Маршрут',
			type: 'string',
			filter: {
				type: 'select',
			},
		},
		{
			name: 'route_traveled_percentage',
			caption: 'Пройдено',
			type: 'string',
			filter: {
				type: 'select',
			},
		},
		{
			name: 'route_left_percentage',
			caption: 'Осталось',
			type: 'string',
			filter: {
				type: 'select',
			},
		},
	]
}

let CarsTable = (props) => {

	const renderers = {
    route_traveled_percentage: ({data}) => <div>{parseFloat(data) * 100 + '%'}</div>,
    route_left_percentage: ({data}) => <div>{ parseFloat(data) * 100 + '%'}</div>,
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
    this.context.history.pushState(null, '/mission-report/'+id);
  }

  handleGenerationTypeChange(type) {
    this.setState({generationType: type});
  }
  createRouteReport() {
    console.log(` creating report`, this.state.generationType);
		const { flux } = this.context;
		flux.getActions('routes').createRouteReport(this.state.generationType);
  }

	render() {

		const { reportsList = [], techOperationsList = [], missionReportsList } = this.props;
    const TECH_OPERATIONS = [{value: 'null', label: 'Все операции'}].concat(techOperationsList.map(({id, name}) => ({value: id, label: name})));

		return (
			<div className="ets-page-wrap">
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
