import React, { Component, PropTypes } from 'react';
import connectToStores from 'flummox/connect';
import Table from 'components/ui/table/DataTable.jsx';
import ElementsList from 'components/ElementsList.jsx';
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
	      caption: `Нужно пройти (${props.data[0].route_check_unit})`,
	      type: 'string',
				filter: false
	    },
			{
				name: 'traveled',
				caption: `Пройдено в рабочем режиме (${props.data[0].route_check_unit})*`,
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
				caption: `Осталось (${props.data[0].route_check_unit})`,
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
			{
				name: 'route_with_speed',
				caption: 'Контроль (км)**',
				type: 'string',
				filter: false
			},
			{
				name: 'route_check_unit',
				caption: 'Единица измерения',
				type: 'string',
				display: props.data && props.data[0] && props.data[0].route_check_unit ? true : false,
				filter: {
					type: 'select',
				},
			}
		]
	};

	return tableMeta;
}


let MissionReportByDTTable = (props) => {

	let tableMeta = getTableMeta(props);

	const renderers = {
    left_percentage: ({data}) => <div>{ parseFloat(parseFloat(data) * 100).toFixed(0) + '%'}</div>,
		traveled_percentage: ({data}) => <div>{ parseFloat(parseFloat(data) * 100).toFixed(0) + '%'}</div>,
		left: (meta) => <div>{ parseFloat(meta.data).toFixed(2) + ' ' + meta.rowData.route_check_unit }</div>,
    traveled: (meta) => <div>{ parseFloat(meta.data).toFixed(2) + ' ' + meta.rowData.route_check_unit }</div>,
    route_check_length: ({data}) => <div>{ data }</div>,
    route_check_value: (meta) => <div>{ meta.data + ' ' + meta.rowData.route_check_unit }</div>,
	};

	if (props.renderOnly) {
		const hiddenFields = ['left_percentage', 'v_avg_max',
			'traveled_percentage', 'route_check_unit'];
		tableMeta.cols = tableMeta.cols.filter(c => hiddenFields.indexOf(c.name) === -1);
		delete renderers.left_percentage;
		delete renderers.traveled_percentage;
		renderers.left = (data) => <div>
			{parseFloat(data.data).toFixed(2) + ' ' + data.rowData.route_check_unit}
			<br/>
			{`(${parseFloat(parseFloat(data.rowData.left_percentage) * 100).toFixed(0) + '%'})`}
		</div>
		renderers.traveled = (data) => <div>
			{parseFloat(data.data).toFixed(2) + ' ' + data.rowData.route_check_unit}
			<br/>
			{`(${parseFloat(parseFloat(data.rowData.traveled_percentage) * 100).toFixed(0) + '%'})`}
		</div>
	} else {
		tableMeta.cols = tableMeta.cols.filter(c => c.name !== 'route_with_speed');
	}

	return <Table title='Прохождение заданий по ДТ'
								tableMeta={tableMeta}
								results={props.data}
								renderers={renderers}
								{...props} />

}

class MissionReportByDT extends ElementsList {

	static propTypes = {
		renderOnly: PropTypes.bool,
		onElementChange: PropTypes.func
	}

	constructor(props) {
		super(props);

		this.selectField = 'dt_id';
    this.mainListName = 'selectedReportDataDTS';
	}

	async componentDidMount() {
		if (!this.props.renderOnly) {
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
		const { renderOnly = false } = this.props;

		return (
			<div className="ets-page-wrap">
				<MissionReportByDTTable noHeader={renderOnly} onRowSelected={this.selectElement.bind(this)} selected={this.state.selectedElement} selectField={this.selectField} data={this.props.selectedReportDataDTS || []} {...this.props} >
				</MissionReportByDTTable>
			</div>
		);
	}
}

export default connectToStores(MissionReportByDT, ['missions']);
