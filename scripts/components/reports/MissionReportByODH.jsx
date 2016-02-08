import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import Table from '../ui/table/DataTable.jsx';

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
			name: 'v_avg_max',
			caption: 'Максимальная скорость',
			type: 'string',
			filter: {
				type: 'select',
			},
		},
	]
}

let MissionReportByODHTable = (props) => {

	const renderers = {
    left_percentage: ({data}) => <div>{ parseFloat(parseFloat(data) * 100).toFixed(2) + '%'}</div>,
    left: ({data}) => <div>{ parseFloat(data).toFixed(2)}</div>,
    traveled: ({data}) => <div>{ parseFloat(data).toFixed(2)}</div>,
    route_check_length: ({data}) => <div>{ parseFloat(data).toFixed(2)}</div>,
	};

	return <Table title='Прохождение заданий по ОДХ'
								tableMeta={tableMeta}
								results={props.data}
								renderers={renderers}
								{...props} />

}

class MissionReportByODH extends Component {

	constructor(props) {
		super(props);
		this.state = {
		};
	}

	componentDidMount() {
		this.context.flux.getActions('missions').getMissionReportByODHs(this.props.routeParams.index);
	}

	render() {
		return (
			<div className="ets-page-wrap">
				<MissionReportByODHTable data={this.props.selectedReportDataODHS || []} >
				</MissionReportByODHTable>
			</div>
		);
	}
}

MissionReportByODH.contextTypes = {
	flux: React.PropTypes.object,
};

export default connectToStores(MissionReportByODH, ['missions']);
