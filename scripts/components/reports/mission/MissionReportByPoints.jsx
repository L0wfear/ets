import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import Table from 'components/ui/table/DataTable.jsx';

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
				labelFunction: (data) => data === 'fail' ? 'Не пройден' : 'Пройден'
      },
    },
	]
}

let MissionReportByPointsTable = (props) => {

	const renderers = {
    status: ({data}) => <div>{data === 'fail' ? 'Не пройден' : 'Пройден'}</div>,
	};

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

	selectElement(el) {
		if (typeof this.props.onElementChange === 'function')
		this.props.onElementChange(el.props.data[this.selectField]);
	}

	render() {
		return (
			<div className="ets-page-wrap">
				<MissionReportByPointsTable onRowSelected={this.selectElement.bind(this)} data={this.props.selectedReportDataPoints || []} {...this.props} >
				</MissionReportByPointsTable>
			</div>
		);
	}
}

MissionReportByPoints.contextTypes = {
	flux: React.PropTypes.object,
};

export default connectToStores(MissionReportByPoints, ['missions']);
