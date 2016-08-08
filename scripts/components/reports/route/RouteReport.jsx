import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';
import { Button, Glyphicon } from 'react-bootstrap';
import { connectToStores, FluxContext } from 'utils/decorators';

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
			filter: false
		},
		{
			name: 'distance',
			caption: 'Протяженность ОДХ',
			type: 'number',
			filter: false
		},
		{
			name: 'traveled',
			caption: 'Длина маршрута',
			type: 'number',
			filter: false
		},
		{
			name: 'delta',
			caption: 'Дельта',
			type: 'number',
			filter: false
		},
		{
			name: 'gutters_length',
			caption: 'Длина лотков',
			type: 'number',
			filter: false
		},
		{
			name: 'footway_length',
			caption: 'Длина тротуаров',
			type: 'number',
			filter: false
		},
		{
			name: 'technical_operation_considered_length',
			caption: 'Тип проверки',
			type: 'text',
			filter: false
		}
	]
}

let RouteOdhCoveringReportTable = (props) => {

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

@connectToStores(['routes'])
@FluxContext
export default class RouteOdhCoveringReport extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		const { flux } = this.context;
		flux.getActions('routes').getRouteReportById(this.props.routeParams.id);
	}

	render() {
		const { selectedReportData = [] } = this.props;

		return (
			<div className="ets-page-wrap">
				<RouteOdhCoveringReportTable data={selectedReportData} >
				</RouteOdhCoveringReportTable>
			</div>
		);
	}
}
