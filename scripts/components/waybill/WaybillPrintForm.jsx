import React, { Component } from 'react';
import _ from 'lodash';
import Div from 'components/ui/Div.jsx';
import FormWrap from '../compositions/FormWrap.jsx';
import { Modal, Row, Col, FormControls, Button, DropdownButton, Dropdown, Glyphicon, MenuItem, Input } from 'react-bootstrap';
import Field from 'components/ui/Field.jsx';
import Datepicker from 'components/ui/DatePicker.jsx';
import { getToday9am, getTomorrow9am, makeDate } from 'utils/dates';
import { saveData } from 'utils/functions';

class WaybillPrintForm extends Component {

	constructor(props) {
		super(props);

    this.state = {
      month: new Date().getMonth(),
      year: new Date().getYear()+1900,
			date_from: getToday9am(),
			date_to: getTomorrow9am()
    }
	}

  async handleSubmit() {
		if (this.props.show === 1) {
			let MONTHS = ['Январь','Февраль','Март','Апрель','Май','Июнь',
	      'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
			await this.context.flux.getActions('waybills')
				.getWaybillJournalReport(this.state)
				.then(blob => {saveData(blob, `Отчет по журналу ПЛ за ${MONTHS[this.state.month]} ${this.state.year}.xls`)});
		} else {
			await this.context.flux.getActions('waybills')
				.getWaybillsReport(this.state)
				.then(blob => {saveData(blob, `Отчет по выработке ТС за ${makeDate(this.state.date_from)} - ${makeDate(this.state.date_to)}.xls`)});
		}
		this.setState({
      month: new Date().getMonth(),
      year: new Date().getYear()+1900,
			date_from: getToday9am(),
			date_to: getTomorrow9am()
    }, () => this.props.hide());
  }

  handleChange(field, value) {
    this.setState({[field]:value});
  }

	render() {

    let MONTHS = ['Январь','Февраль','Март','Апрель','Май','Июнь',
      'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'].map((m, i) => ({label: m, value: i}));
    let YEARS = Array.from({length: 11}, (y,i) => ({label: i+2016+'', value: i+2016}));

		return (
    			<Modal {...this.props} show={!!this.props.show} bsSize="small">

            <Modal.Header>
              <Modal.Title id="contained-modal-title-lg">Печать журнала ПЛ</Modal.Title>
            </Modal.Header>

    	      <Modal.Body>
              <span style={{marginBottom: 15, display: "block"}}>Выберите период:</span>
							{this.props.show === 1 ?
								<div>
									<Field type="select" label="Месяц"
											options={MONTHS}
											value={this.state.month}
											clearable={false}
											onChange={this.handleChange.bind(this, 'month')}/>
									<br/>
									<Field type="select" label="Год"
											options={YEARS}
											value={this.state.year}
											clearable={false}
											onChange={this.handleChange.bind(this, 'year')}/>
								</div>
								:
									<div>
										<Div className="inline-block reports-date">
											<Datepicker time={false} date={this.state.date_from} onChange={this.handleChange.bind(this, 'date_from')}/>
										</Div>
										<Div className="inline-block reports-date">
											<Datepicker time={false} date={this.state.date_to} onChange={this.handleChange.bind(this, 'date_to')}/>
										</Div>
									</div>
							}
    	      </Modal.Body>

    	      <Modal.Footer>
    					<Div className="inline-block">
    		      	<Button onClick={this.handleSubmit.bind(this)}>ОК</Button>
    		      	<Button onClick={this.props.hide}>Отмена</Button>
    					</Div>
    	      </Modal.Footer>
    			</Modal>
    		)

	}

}

WaybillPrintForm.contextTypes = {
	flux: React.PropTypes.object,
};

export default WaybillPrintForm;
