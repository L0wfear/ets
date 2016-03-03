import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import Table from '../ui/table/DataTable.jsx';
//78
let tableMeta = {
	cols: [
    {
      name: 'name',
      caption: 'Наименование пункта назначения',
      type: 'string',
      filter: {
        type: 'select',
      },
    },
    {
      name: 'status',
      caption: 'Статус',
      type: 'string',
      filter: {
        type: 'select',
      },
    },
	]
}

let MissionReportByPointsTable = (props) => {

	const renderers = {
    status: ({data}) => <div>{data === 'fail' ? 'Не пройден' : 'Пройден'}</div>,
	};

	// if (props.noFilter) {
	// 	tableMeta.cols = tableMeta.cols.filter(c => c.name !== 'left_percentage');
	// 	delete renderers.left_percentage;
	// 	renderers.left = (data) => <div>{`${parseFloat(data.data).toFixed(2)} (${parseFloat(parseFloat(data.rowData.left_percentage) * 100).toFixed(2) + '%'})`}</div>
	// }

	return <Table title='Прохождение заданий по пунктам назначения'
								tableMeta={tableMeta}
								results={props.data}
								renderers={renderers}
								{...props} />

}

class MissionReportByPoints extends Component {

	constructor(props) {
		super(props);
		this.state = {
		};
	}

	async componentDidMount() {
		if (!this.props.noFilter) {
			await this.context.flux.getActions('missions').getMissionReportById(this.props.routeParams.id);
			this.context.flux.getActions('missions').getMissionReportByPoints(this.props.routeParams.index);
		}
	}

	render() {
		let { noFilter = false } = this.props;

		return (
			<div className="ets-page-wrap">
				<MissionReportByPointsTable noFilter={noFilter}  data={this.props.selectedReportDataPoints || []} >
				</MissionReportByPointsTable>
			</div>
		);
	}
}

MissionReportByPoints.contextTypes = {
	flux: React.PropTypes.object,
};

export default connectToStores(MissionReportByPoints, ['missions']);
