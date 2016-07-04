import React, { Component } from 'react';
import _ from 'lodash';
import Div from '../ui/Div.jsx';
import FormWrap from '../compositions/FormWrap.jsx';
import { Modal, Row, Col, FormControls, Button, DropdownButton, Dropdown, Glyphicon, MenuItem, Input } from 'react-bootstrap';
import Field from '../ui/Field.jsx';
import { saveData } from 'utils/functions';

class WaybillPrintForm extends Component {

	constructor(props) {
		super(props);

    this.state = {
      month: new Date().getMonth(),
      year: new Date().getYear()+1900
    }
	}

  async handleSubmit() {

		let MONTHS = ['Январь','Февраль','Март','Апрель','Май','Июнь',
      'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
		await this.context.flux.getActions('waybills')
			.getWaybillJournalReport(this.state)
			.then(blob => {saveData(blob, `Отчет по журналу ПЛ за ${MONTHS[this.state.month]} ${this.state.year}.xls`)});

		this.setState({
      month: new Date().getMonth(),
      year: new Date().getYear()+1900
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
    			<Modal {...this.props} bsSize="small">

            <Modal.Header>
              <Modal.Title id="contained-modal-title-lg">Печать журнала ПЛ</Modal.Title>
            </Modal.Header>

    	      <Modal.Body>
              <span style={{marginBottom: 15, display: "block"}}>Выберите период:</span>
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
