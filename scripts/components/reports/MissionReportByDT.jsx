import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import Table from '../ui/table/DataTable.jsx';
import ElementsList from '../ElementsList.jsx';
//78

let getTableMeta = (props) => {
	let tableMeta = {
		cols: [
	    {
	      name: 'dt_name',
	      caption: 'ДТ',
	      type: 'string',
	      filter: {
	        type: 'select',
	      },
	    },
	    {
	      name: 'route_check_value',
	      caption: 'Нужно пройти',
	      type: 'string',
				filter: false
	    },
			{
				name: 'traveled',
				caption: 'Пройдено с рабочей скоростью',
				type: 'string',
				filter: false
			},
			{
				name: 'left',
				caption: 'Осталось',
				type: 'string',
				filter: false
			},
			{
				name: 'left_percentage',
				caption: 'Осталось %',
				type: 'string',
				filter: false
			},
			{
				name: 'v_avg_max',
				caption: 'Максимальная скорость',
				type: 'string',
				filter: false
			},
		]
	};
	if (props.data && props.data[0] && props.data[0].route_check_unit) {
		tableMeta.cols.push({
			name: 'route_check_unit',
			caption: 'Единица измерения',
			type: 'string',
			filter: {
				type: 'select',
			},
		});
	}

	return tableMeta;
}


let MissionReportByDTTable = (props) => {

	let tableMeta = getTableMeta(props);

	const renderers = {
    left_percentage: ({data}) => <div>{ parseFloat(parseFloat(data) * 100).toFixed(2) + '%'}</div>,
    left: ({data}) => {
			return <div>{ parseFloat(data).toFixed(2)}</div>
		},
    traveled: ({data}) => <div>{ parseFloat(data).toFixed(2)}</div>,
    route_check_length: ({data}) => <div>{ parseFloat(data).toFixed(2)}</div>,
	};

	if (props.noFilter) {
		tableMeta.cols = tableMeta.cols.filter(c => c.name !== 'left_percentage' && c.name !== 'v_avg_max');
		delete renderers.left_percentage;
    renderers.left = (data) => <div>{parseFloat(data.data).toFixed(2)}<br/>{`(${parseFloat(parseFloat(data.rowData.left_percentage) * 100).toFixed(2) + '%'})`}</div>
	}

	return <Table title='Прохождение заданий по ДТ'
								tableMeta={tableMeta}
								results={props.data}
								renderers={renderers}
								{...props} />

}

class MissionReportByDT extends ElementsList {

	constructor(props) {
		super(props);

		this.selectField = 'dt_id';
    this.mainListName = 'selectedReportDataDTS';
	}

	async componentDidMount() {
		if (!this.props.noFilter) {
			await this.context.flux.getActions('missions').getMissionReportById(this.props.routeParams.id);
			this.context.flux.getActions('missions').getMissionReportByDTs(this.props.routeParams.index);
		}
	}

	selectElement(el) {
		super.selectElement(el);
		if (typeof this.props.onElementChange === 'function')
		this.props.onElementChange(el.props.data[this.selectField]);
	}

	render() {
		let { noFilter = false } = this.props;

		return (
			<div className="ets-page-wrap">
				<MissionReportByDTTable routeCheckValue={this.props.routeCheckValue} noFilter={noFilter} onRowSelected={this.selectElement.bind(this)} selected={this.state.selectedElement} selectField={this.selectField} data={this.props.selectedReportDataDTS || []} >
				</MissionReportByDTTable>
			</div>
		);
	}
}

MissionReportByDT.contextTypes = {
	flux: React.PropTypes.object,
};

export default connectToStores(MissionReportByDT, ['missions']);
