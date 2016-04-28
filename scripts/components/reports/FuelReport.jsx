import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import Table from '../ui/table/DataTable.jsx';
import { Button, Glyphicon, Row, Col } from 'react-bootstrap';
import EtsSelect from '../ui/EtsSelect.jsx';
import Div from '../ui/Div.jsx';
import Field from '../ui/Field.jsx';
import Datepicker from '../ui/DatePicker.jsx';
import { datePickerFunction } from 'utils/labelFunctions';
import { getToday9am, getTomorrow9am, getToday0am, getToday2359, getFormattedDateTimeSeconds } from 'utils/dates';
import { getReportNotReadyNotification2 } from 'utils/notifications';
import { isEmpty } from 'utils/functions';
import FuelReportHeader from "./FuelReportHeader.jsx";

let tableMeta = {
	cols: [
		{
			name: 'car_model_name',
			caption: 'Модель ТС',
			type: 'text',
			cssClassName: "width-fuel-report-large",
			filter: false
		},
		{
			name: 'car_gov_number',
			caption: 'Госномер',
			type: 'text',
			cssClassName: "width-fuel-report-large",
			filter: false
		},
		{
			name: 'car_garage_number',
			caption: 'Гаражный номер ТС',
			type: 'text',
			cssClassName: "width-fuel-report-large",
			filter: false
		},
		{
			name: 'odometr_start',
			caption: 'Одометр. Выезд',
			type: 'number',
			cssClassName: "width-fuel-report-small",
			filter: false
		},
		{
			name: 'odometr_end',
			caption: 'Одометр. Возврат',
			type: 'number',
			cssClassName: "width-fuel-report-small",
			filter: false
		},
		{
			name: 'odometr_diff',
			caption: 'Одометр. Пробег',
			type: 'number',
			cssClassName: "width-fuel-report-small",
			filter: false
		},
    {
      name: 'motohours_start',
      caption: 'Счетчик моточасов. Выезд',
      type: 'number',
			cssClassName: "width-fuel-report-small",
      filter: false
    },
    {
      name: 'motohours_end',
      caption: 'Счетчик моточасов. Возврат',
      type: 'number',
			cssClassName: "width-fuel-report-small",
      filter: false
    },
    {
      name: 'motohours_diff',
      caption: 'Счетчик моточасов. Пробег',
      type: 'number',
			cssClassName: "width-fuel-report-small",
      filter: false
    },
    {
      name: 'motohours_equip_start',
      caption: 'Счет. обор. моточасов. Выезд',
      type: 'number',
			cssClassName: "width-fuel-report-small",
      filter: false
    },
    {
      name: 'motohours_equip_end',
      caption: 'Счет. обор. моточасов. Возврат',
      type: 'number',
			cssClassName: "width-fuel-report-small",
      filter: false
    },
    {
      name: 'motohours_equip_diff',
      caption: 'Счет. обор. моточасов. Пробег',
      type: 'number',
			cssClassName: "width-fuel-report-small",
      filter: false
    },
    {
      name: 'fuel_type_name',
      caption: 'Тип топлива',
      type: 'text',
			cssClassName: "width-fuel-report-small",
      filter: false
    },
    {
      name: 'fuel_start',
      caption: 'Топливо. Выезд',
      type: 'number',
			cssClassName: "width-fuel-report-small",
      filter: false
    },
    {
      name: 'fuel_given',
      caption: 'Топливо. Выдано',
      type: 'number',
			cssClassName: "width-fuel-report-small",
      filter: false
    },
    {
      name: 'fuel_end',
      caption: 'Топливо. Возврат',
      type: 'number',
			cssClassName: "width-fuel-report-small",
      filter: false
    },
    {
      name: 'fuel_fact',
      caption: 'Топливо. Факт.',
      type: 'number',
			cssClassName: "width-fuel-report-small",
      filter: false
    },
    {
      name: 'fuel_rate',
      caption: 'Топливо. Норма',
      type: 'number',
			cssClassName: "width-fuel-report-small",
      filter: false
    },
    {
      name: 'fuel_diff',
      caption: 'Топливо. Разница',
      type: 'number',
      filter: false,
			cssClassName: "width-fuel-report-small",
    },
	]
}

let FuelReportTable = (props) => {

	const renderers = {

	};

	return <Table title='Отчет по топливу'
								tableMeta={tableMeta}
								results={props.data}
								renderers={renderers}
								enumerated={false}
								{...props} />

}

class FuelReport extends Component {

	constructor(props) {
		super(props);

    let [date_from, date_to] = [getToday9am(), getTomorrow9am()];

		this.state = {
      date_from,
      date_to,
      fuel_type_id: null,
		};
	}

  handleChange(field, value) {
		this.setState({[field]: value});
	}

  createReport() {
    const { flux } = this.context;
		flux.getActions('reports').getFuelReport(this.state);
  }

	render() {

    console.log('state is', this.state);

		let { fuelReport = [] } = this.props;

		return (
			<div className="ets-page-wrap">
  			<FuelReportHeader handleChange={this.handleChange.bind(this)} onClick={this.createReport.bind(this)} {...this.state} />
				<FuelReportTable data={fuelReport} />
			</div>
		);

	}
}

FuelReport.contextTypes = {
  history: React.PropTypes.object,
	flux: React.PropTypes.object,
};

export default connectToStores(FuelReport, ['reports']);
