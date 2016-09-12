import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';
import { Button, Glyphicon } from 'react-bootstrap';
import { connectToStores, FluxContext, exportable } from 'utils/decorators';
import { isEmpty } from 'utils/functions';

let getStatusLabel = (status) => status === 'fail' ? 'Нет' : 'Да';

let tableMeta = {
	cols: [
		{
			name: 'technical_operation_name',
			displayName: 'Тех. операция',
			type: 'text',
			filter: {
				type: 'select',
			}
		},
		{
			name: 'odh_name',
			displayName: 'ОДХ',
			type: 'text',
			filter: {
				type: 'select',
			}
		},
		{
			name: 'status',
			displayName: 'Покрытие',
			type: 'text',
			filter: false
		},
		{
			name: 'distance',
			displayName: 'Протяженность ОДХ',
			type: 'number',
			filter: false
		},
		{
			name: 'traveled',
			displayName: 'Длина маршрута',
			type: 'number',
			filter: false
		},
		{
			name: 'delta',
			displayName: 'Дельта',
			type: 'number',
			filter: false
		},
		{
			name: 'gutters_length',
			displayName: 'Длина лотков',
			type: 'number',
			filter: false
		},
		{
			name: 'footway_length',
			displayName: 'Длина тротуаров',
			type: 'number',
			filter: false
		},
		{
			name: 'check_type_name',
			displayName: 'Тип проверки',
			type: 'text',
			filter: false
		}
	]
}

let RouteOdhCoveringReportTable = (props) => {

	const renderers = {
		delta: ({data}) => <div>{!isEmpty(data) ? parseFloat(data).toFixed(2) : ''}</div>,
  	traveled: ({data}) => <div>{!isEmpty(data) ? parseFloat(data).toFixed(2) : ''}</div>,
  	footway_length: ({data}) => <div>{!isEmpty(data) ? parseFloat(data).toFixed(2) : ''}</div>,
  	gutters_length: ({data}) => <div>{!isEmpty(data) ? parseFloat(data).toFixed(2) : ''}</div>,
    status: ({data}) => <div>{!isEmpty(data) ? getStatusLabel(data) : ''}</div>,
	};

	return <Table title='Покрытие ОДХ маршрутами'
								tableMeta={tableMeta}
								results={props.data}
								renderers={renderers}
								{...props} />

}

@connectToStores(['routes'])
@FluxContext
@exportable
export default class RouteOdhCoveringReport extends Component {
	constructor(props) {
		super(props);
		this.entity = 'route_odh_covering_report/' + this.props.routeParams.id;
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
					<Button bsSize="small" onClick={() => this.export()}><Glyphicon glyph="download-alt" /></Button>
				</RouteOdhCoveringReportTable>
			</div>
		);
	}
}
