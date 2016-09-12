import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';
import { Button, Glyphicon, Row, Col } from 'react-bootstrap';
import EtsSelect from 'components/ui/EtsSelect.jsx';
import Div from 'components/ui/Div.jsx';
import Field from 'components/ui/Field.jsx';
import Datepicker from 'components/ui/DatePicker.jsx';
import { getGeozoneTypeLabel} from 'utils/labelFunctions';
import { getToday9am, getTomorrow9am, getToday0am, getToday2359, getFormattedDateTime, createValidDateTime } from 'utils/dates';
import { getReportNotReadyNotification2 } from 'utils/notifications';
import { isEmpty } from 'utils/functions';
import CarFuncTypeUsageReportHeader from './CarFuncTypeUsageReportHeader.jsx';
import { FluxContext, connectToStores, exportable, staticProps } from 'utils/decorators';

let tableMeta = {
	cols: [
		{
			name: 'company_name',
			displayName: 'Учреждение',
			type: 'string',
			filter: {
				type: 'select',
			}
		},
		{
			name: 'func_type',
			displayName: 'Тип техники',
			type: 'string',
			filter: {
        type: 'select',
			},
		},
		{
			name: 'total_cars_count',
			displayName: 'Кол-во техники указанного типа',
			type: 'number',
			filter: {
        type: 'select',
			},
		},
		{
			name: 'technical_operation',
			displayName: 'Технологическая операция',
			type: 'string',
			filter: {
        type: 'select',
			},
		},
		{
			name: 'cars_count',
			displayName: 'Задействованная техника',
			type: 'number',
			filter: {
        type: 'select',
			},
		},
	]
}

let CarFuncTypeUsageReportsTable = (props) => {

	const renderers = {
    rowNumber: (meta) => <div>{meta.rowData.hidden ? '' : meta.data}</div>,
    company_name: (meta) => <div>{meta.rowData.hidden ? '' : meta.data}</div>,
    func_type: (meta) => <div>{meta.rowData.hidden ? '' : meta.data}</div>,
    total_cars_count: (meta) => <div>{meta.rowData.hidden ? '' : meta.data}</div>,
	};

	return <Table title='Статистика выхода техники за период'
								tableMeta={tableMeta}
								results={props.data}
								renderers={renderers}
								enableSort={false}
								{...props} />

}

@connectToStores(['reports'])
@FluxContext
@staticProps({
  entity: 'car_func_type_usage_report'
})
@exportable
export default class CarFuncTypeUsageReports extends Component {

	constructor(props) {
		super(props);

    let [date_start, date_end] = [getToday9am(), getTomorrow9am()];

		this.state = {
      date_start,
      date_end,
      geozone_type: 'odh',
      company_id: null
		};
	}

  handleChange(field, value) {
		this.setState({[field]: value});
	}

	getCleanState(state) {
		return {
			...state,
			date_start: createValidDateTime(state.date_start),
			date_end: createValidDateTime(state.date_end)
		};
	}

  createDailyCleaningReportETS() {
		const { flux } = this.context;
		flux.getActions('reports').getCarFuncTypeUsageReports(this.state);
  }

	render() {

		const { carFuncTypeUsageReportsList = [] } = this.props;
    let currentCombination;
    _.each(carFuncTypeUsageReportsList, el => {
      if (!currentCombination || currentCombination !== `${el.company_name}${el.func_type}`) {
        currentCombination = `${el.company_name}${el.func_type}`;
      } else {
        el.hidden = true;
      }
    });

		return (
			<div className="ets-page-wrap">
  			<CarFuncTypeUsageReportHeader
            handleChange={this.handleChange.bind(this)}
            onClick={this.createDailyCleaningReportETS.bind(this)}
            {...this.state}/>
				<CarFuncTypeUsageReportsTable
            data={carFuncTypeUsageReportsList}>
					<Button disabled={!carFuncTypeUsageReportsList.length} bsSize="small" onClick={() => this.export(this.getCleanState(this.state))}><Glyphicon glyph="download-alt" /></Button>
				</CarFuncTypeUsageReportsTable>
			</div>
		);

	}
}
