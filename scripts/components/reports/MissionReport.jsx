import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import Table from '../ui/table/DataTable.jsx';

let getStatusLabel = (status) => status === 'fail' ? 'Нет' : 'Да';
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
      name: 'mission_name',
      caption: 'Название',
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

let MissionReportTable = (props) => {

	const renderers = {
    route_traveled_percentage: ({data}) => <div>{ data ? parseFloat(data) * 100 + '%' : 'Нет данных'}</div>,
    route_left_percentage: ({data}) => <div>{ data ? parseFloat(data) * 100 + '%' : 'Нет данных'}</div>,
	};

	return <Table title='Прохождение заданий'
								tableMeta={tableMeta}
								results={props.data}
								renderers={renderers}
								{...props} />

}

class MissionReport extends Component {


	constructor(props) {
		super(props);

		this.state = {
			selectedCar: null,
			showForm: false,
		};
	}

	componentDidMount() {
		const { flux } = this.context;
		flux.getActions('missions').getMissionReportById(this.props.routeParams.id);
	}

  onReportSelect({props}) {
    let index = props.data.index;
    this.context.history.pushState(null, '/mission-report/' + this.props.routeParams.id + '/odhs/' + index);
  }

	render() {

		const { selectedReportData = [] } = this.props;

		return (
			<div className="ets-page-wrap">
				<MissionReportTable data={selectedReportData} onRowSelected={this.onReportSelect.bind(this)}>
				</MissionReportTable>
			</div>
		);

	}
}

MissionReport.contextTypes = {
  history: React.PropTypes.object,
	flux: React.PropTypes.object,
};

export default connectToStores(MissionReport, ['missions']);
