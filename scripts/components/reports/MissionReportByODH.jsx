import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import Table from '../ui/table/DataTable.jsx';
import ElementsList from '../ElementsList.jsx';
//78

let getTableMeta = (props) => {
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
			// {
			// 	name: 'traveled_percentage',
			// 	caption: 'Пройдено с рабочей скоростью %',
			// 	type: 'string',
			// 	filter: false
			// },
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


let MissionReportByODHTable = (props) => {

	let tableMeta = getTableMeta(props);

	const renderers = {
    left_percentage: ({data}) => <div>{ parseFloat(parseFloat(data) * 100).toFixed(2) + '%'}</div>,
		traveled_percentage: ({data}) => <div>{ parseFloat(parseFloat(data) * 100).toFixed(2) + '%'}</div>,
    left: ({data}) => {
			return <div>{ parseFloat(data).toFixed(2)}</div>
		},
    traveled: ({data}) => <div>{ parseFloat(data).toFixed(2)}</div>,
    route_check_length: ({data}) => <div>{ data }</div>,
    route_check_value: ({data}) => <div>{ data }</div>,
	};

	if (props.noFilter) {
		tableMeta.cols = tableMeta.cols.filter(c => c.name !== 'left_percentage' && c.name !== 'v_avg_max' && c.name != 'traveled_percentage');
		delete renderers.left_percentage;
		delete renderers.traveled_percentage;
    renderers.left = (data) => <div>{parseFloat(data.data).toFixed(2)}<br/>{`(${parseFloat(parseFloat(data.rowData.left_percentage) * 100).toFixed(0) + '%'})`}</div>
	renderers.traveled = (data) => <div>{parseFloat(data.data).toFixed(2)}<br/>{`(${parseFloat(parseFloat(data.rowData.traveled_percentage) * 100).toFixed(0) + '%'})`}</div>
	}

	return <Table title='Прохождение заданий по ОДХ'
								tableMeta={tableMeta}
								results={props.data}
								renderers={renderers}
								{...props} />

}

class MissionReportByODH extends ElementsList {

	constructor(props) {
		super(props);

		this.selectField = 'odh_id';
    this.mainListName = 'selectedReportDataODHS';
	}

	async componentDidMount() {
		if (!this.props.noFilter) {
			await this.context.flux.getActions('missions').getMissionReportById(this.props.routeParams.id);
			this.context.flux.getActions('missions').getMissionReportByODHs(this.props.routeParams.index);
		}
	}

	selectElement(el) {
		super.selectElement(el);
		if (typeof this.props.onElementChange === 'function')
		this.props.onElementChange(el.props.data[this.selectField]);
	}

	render() {
		return (
			<div className="ets-page-wrap">
				<MissionReportByODHTable onRowSelected={this.selectElement.bind(this)} selected={this.state.selectedElement} selectField={this.selectField} data={this.props.selectedReportDataODHS || []} {...this.props}>
				</MissionReportByODHTable>
			</div>
		);
	}
}

export default connectToStores(MissionReportByODH, ['missions']);
