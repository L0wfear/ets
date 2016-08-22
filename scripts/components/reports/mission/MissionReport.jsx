import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import Table from 'components/ui/table/DataTable.jsx';
import { exportable } from 'utils/decorators';
import { Button, Glyphicon } from 'react-bootstrap';

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
			filter: false
		},
		{
			name: 'route_left_percentage',
			caption: 'Осталось',
			type: 'string',
			filter: false
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

@exportable
class MissionReport extends Component {


	constructor(props) {
		super(props);

		this.state = {
			selectedCar: null,
			showForm: false,
		};

		this.entity = 'car_odh_travel_report/' + this.props.routeParams.id;
	}

	componentDidMount() {
		const { flux } = this.context;
		flux.getActions('missions').getMissionReportById(this.props.routeParams.id);
	}

  onReportSelect({props}) {
    let index = props.data.index;
		if (props.data.report_by_odh) {
	    this.context.history.pushState(null, '/mission-report/' + this.props.routeParams.id + '/odhs/' + index);
		} else if (props.data.report_by_dt) {
	    this.context.history.pushState(null, '/mission-report/' + this.props.routeParams.id + '/dts/' + index);
		} else if (props.data.report_by_point) {
	    this.context.history.pushState(null, '/mission-report/' + this.props.routeParams.id + '/points/' + index);
		}
  }

	render() {

		const { selectedReportData = [] } = this.props;

		return (
			<div className="ets-page-wrap">
				<MissionReportTable data={selectedReportData} onRowSelected={this.onReportSelect.bind(this)}>
					<Button bsSize="small" onClick={() => this.export()}><Glyphicon glyph="download-alt" /></Button>
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
