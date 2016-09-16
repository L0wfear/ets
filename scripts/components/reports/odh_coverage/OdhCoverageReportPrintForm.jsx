import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';
import Datepicker from 'components/ui/DatePicker.jsx';
import Div from 'components/ui/Div.jsx';

export default class OdhCoverageReportPrintForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			date: new Date()
		}
	}

	export() {
		let payload = {date: this.state.date};
		console.log('ждем бэкенд', this.state.date)
	}

	render() {
		return <Modal show={this.props.showForm} bsSize="small">
			<Modal.Header>
				<Modal.Title id="contained-modal-title-lg">Печать ежедневного отчета</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<label>Выберите дату:</label>
				<Datepicker time={false} date={this.state.date} onChange={date => this.setState({date})} />
			</Modal.Body>
			<Modal.Footer>
				<Div className="inline-block">
					<Button onClick={::this.export}>ОК</Button>
					<Button onClick={this.props.onFormHide}>Отмена</Button>
				</Div>
			</Modal.Footer>
		</Modal>
	}
}
