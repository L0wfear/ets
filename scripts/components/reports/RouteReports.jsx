import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import Table from '../ui/table/DataTable.jsx';
import { Button, Glyphicon } from 'react-bootstrap';

// function createFakeMissingCarData(types, el, i) {
// 	el.type = _.find(types, t => t.id === el.type_id).title;
// 	return el;
// }

let getStatusLabel = (status) => status === 'fail' ? 'Нет' : 'Да';
let getTypeLabel = (type) => type === 'distance' ? 'Протяженность' : type;

let tableMeta = {
	cols: [
		{
			name: 'technical_operation_name',
			caption: 'Тех. операция',
			type: 'text',
			filter: {
				type: 'select',
			}
		},
		{
			name: 'odh_name',
			caption: 'ОДХ',
			type: 'text',
			filter: {
				type: 'select',
			}
		},
		{
			name: 'status',
			caption: 'Покрытие',
			type: 'text',
			filter: {
				type: 'select',
			}
		},
		{
			name: 'distance',
			caption: 'Протяженность ОДХ',
			type: 'number',
			filter: {
				type: 'select',
			}
		},
		{
			name: 'traveled',
			caption: 'Длина маршрута',
			type: 'number',
			filter: {
				type: 'select',
			},
		},
		{
			name: 'delta',
			caption: 'Дельта',
			type: 'number',
			filter: {
				type: 'select',
			},
		},
		{
			name: 'gutters_length',
			caption: 'Длина лотков',
			type: 'number',
			filter: {
				type: 'select',
			},
		},
		{
			name: 'footway_length',
			caption: 'Длина тротуаров',
			type: 'number',
			filter: {
				type: 'select',
			},
		},
		{
			name: 'technical_operation_considered_length',
			caption: 'Тип проверки',
			type: 'text',
			filter: {
				type: 'select',
			},
		}
	]
}

let CarsTable = (props) => {

	const renderers = {
		delta: ({data}) => <div>{data ? parseFloat(data).toFixed(2) : ''}</div>,
  	traveled: ({data}) => <div>{data ? parseFloat(data).toFixed(2) : ''}</div>,
  	footway_length: ({data}) => <div>{data ? parseFloat(data).toFixed(2) : ''}</div>,
  	gutters_length: ({data}) => <div>{data ? parseFloat(data).toFixed(2) : ''}</div>,
    status: ({data}) => <div>{data ? getStatusLabel(data) : ''}</div>,
    technical_operation_considered_length: ({data}) => <div>{data ? getTypeLabel(data) : ''}</div>,
	};

	return <Table title='Покрытие ОДХ маршрутами'
								tableMeta={tableMeta}
								results={props.data}
								renderers={renderers}
								{...props} />

}

class RouteReports extends Component {


	constructor(props) {
		super(props);

		this.state = {
			selectedCar: null,
			showForm: false,
		};
	}

	componentDidMount() {
		const { flux } = this.context;
		flux.getActions('routes').getRouteReportById(this.props.routeParams.id);
	}

	render() {

		const { selectedReportData = [] } = this.props;

		return (
			<div className="ets-page-wrap">
				<CarsTable data={selectedReportData} >
				</CarsTable>
			</div>
		);

	}
}

RouteReports.contextTypes = {
  history: React.PropTypes.object,
	flux: React.PropTypes.object,
};

export default connectToStores(RouteReports, ['routes']);
