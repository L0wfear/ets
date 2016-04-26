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
			filter: false
		},
		{
			name: 'car_gov_number',
			caption: 'Госномер',
			type: 'text',
			filter: false
		},
		{
			name: 'car_garage_number',
			caption: 'Гаражный номер ТС',
			type: 'text',
			filter: false
		},
		{
			name: 'odometr_start',
			caption: 'Одометр.Выезд',
			type: 'number',
			filter: false
		},
		{
			name: 'odometr_end',
			caption: 'Одометр.Возврат',
			type: 'number',
			filter: false
		},
		{
			name: 'odometr_diff',
			caption: 'Одометр.Пробег',
			type: 'number',
			filter: false
		},
    {
      name: 'motohours_start',
      caption: 'Счетчик моточасов.Выезд',
      type: 'number',
      filter: false
    },
    {
      name: 'motohours_end',
      caption: 'Счетчик моточасов.Возврат',
      type: 'number',
      filter: false
    },
    {
      name: 'motohours_diff',
      caption: 'Счетчик моточасов.Пробег',
      type: 'number',
      filter: false
    },
    {
      name: 'motohours_equip_start',
      caption: 'Счетчик оборудования моточасов.Выезд',
      type: 'number',
      filter: false
    },
    {
      name: 'motohours_equip_end',
      caption: 'Счетчик оборудования моточасов.Возврат',
      type: 'number',
      filter: false
    },
    {
      name: 'motohours_equip_diff',
      caption: 'Счетчик оборудования моточасов.Пробег',
      type: 'number',
      filter: false
    },
    {
      name: 'fuel_type_name',
      caption: 'Тип топлива',
      type: 'text',
      filter: false
    },
    {
      name: 'fuel_start',
      caption: 'Топливо.Выезд',
      type: 'number',
      filter: false
    },
    {
      name: 'fuel_given',
      caption: 'Топливо.Выдано',
      type: 'number',
      filter: false
    },
    {
      name: 'fuel_end',
      caption: 'Топливо.Возврат',
      type: 'number',
      filter: false
    },
    {
      name: 'fuel_fact',
      caption: 'Топливо.Фактическое',
      type: 'number',
      filter: false
    },
    {
      name: 'fuel_rate',
      caption: 'Топливо.Норма',
      type: 'number',
      filter: false
    },
    {
      name: 'fuel_diff',
      caption: 'Топливо.Разница',
      type: 'number',
      filter: false
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
								{...props} />

}

class FuelReport extends Component {

	constructor(props) {
		super(props);

    let [date_start, date_end] = [getToday9am(), getTomorrow9am()];

		this.state = {
      date_start,
      date_end,
      fuel_types: [],
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

    fuelReport = [
      {
        //Транспортное средство
        car_model_name: 'Камаз/Крутой камаз', // Модель ТС - car_special_model / car_model
        car_gov_number: 'а123аа', // Госномер
        car_garage_number: 'b12312', // Гаражный номер тс
        // КМ (одометр)
        odometr_start: 123,
        odometr_end: 123,
        odometr_diff: 0,
        // МЧ
        motohours_start: 123,
        motohours_end: 123,
        motohours_diff: 0,
        // М/Ч ОБ
        motohours_equip_start: 123,
        motohours_equip_end: 123,
        motohours_equip_diff: 0,
        // Расход топлива
        fuel_type_name: 'ДТ',
        fuel_start: 0,
        fuel_given: 123,
        fuel_end: 46,
        fuel_fact: 77, // fuel_start + fuel_given - fuel_end
        fuel_rate: 3, // Норма
        fuel_diff: 74 // fuel_rate - fuel_fact
      }
    ]
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
