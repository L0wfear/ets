import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import Table from '../ui/table/DataTable.jsx';
import { Button, Glyphicon } from 'react-bootstrap';

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
			name: 'operation_name',
			caption: 'Тех. операция',
			type: 'text',
			filter: {
				type: 'select',
			}
		},
		{
			name: 'status',
			caption: 'Статус',
			type: 'text',
			filter: {
				type: 'select',
			}
		},
		{
			name: 'odh_fail_count',
			caption: 'Кол-во непокрытых',
			type: 'number',
			filter: {
				type: 'select',
			}
		},
		{
			name: 'odh_total_count',
			caption: 'Общее кол-во',
			type: 'number',
			filter: {
				type: 'select',
			},
		},
		{
			name: 'odh_success_count',
			caption: 'Кол-во покрытых',
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
	};

	return <Table title='Покрытие ОДХ маршрутами'
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
		};
	}

	componentDidMount() {
		const { flux } = this.context;
		flux.getActions('routes').getRouteReports();
	}

  onReportSelect({props}) {
    const id = props.data.id;
    console.log(id);
		// const { flux } = this.context;
		// flux.getActions('routes').getRouteReportById(id);
    this.context.history.pushState(null, '/route-report/'+id);
  }

	render() {

		const { reportsList = [] } = this.props;

		return (
			<div className="ets-page-wrap">
				<CarsTable data={reportsList} onRowSelected={this.onReportSelect.bind(this)}>
				</CarsTable>
			</div>
		);

	}
}

RouteLaunchReports.contextTypes = {
  history: React.PropTypes.object,
	flux: React.PropTypes.object,
};

export default connectToStores(RouteLaunchReports, ['routes']);
