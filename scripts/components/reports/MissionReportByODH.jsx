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
      name: 'odh_name',
      caption: 'ОДХ',
      type: 'string',
      filter: {
        type: 'select',
      },
    },
    {
      name: 'route_check_length',
      caption: 'Нужно пройти',
      type: 'string',
      filter: {
        type: 'select',
      },
    },
		{
			name: 'traveled',
			caption: 'Пройдено',
			type: 'string',
			filter: {
				type: 'select',
			}
		},
		{
			name: 'left',
			caption: 'Осталось',
			type: 'string',
			filter: {
				type: 'select',
			}
		},
		{
			name: 'left_percentage',
			caption: 'Осталось %',
			type: 'string',
			filter: {
				type: 'select',
			}
		},
		{
			name: 'v_avg',
			caption: 'Средняя скорость',
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
    left_percentage: ({data}) => <div>{ parseFloat(parseFloat(data) * 100).toFixed(2) + '%'}</div>,
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
		flux.getActions('missions').getMissionReportByODHs(this.props.routeParams.index);
	}

	render() {

		const { selectedReportDataODHS = [] } = this.props;

		return (
			<div className="ets-page-wrap">
				<CarsTable data={selectedReportDataODHS} >
				</CarsTable>
			</div>
		);

	}
}

RouteReports.contextTypes = {
  history: React.PropTypes.object,
	flux: React.PropTypes.object,
};

export default connectToStores(RouteReports, ['missions']);
