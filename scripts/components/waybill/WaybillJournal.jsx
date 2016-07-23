import React, { Component } from 'react';
import { Button, Glyphicon, ButtonToolbar, Dropdown, MenuItem } from 'react-bootstrap';
import WaybillFormWrap from './WaybillFormWrap.jsx';
import WaybillPrintForm from './WaybillPrintForm.jsx';
import CheckableElementsList from 'components/CheckableElementsList.jsx';
import _ from 'lodash';
import { connectToStores, elementsList  } from 'utils/decorators';
import { WaybillsTable } from './WaybillsTable.jsx';

@connectToStores(['waybills', 'objects', 'employees'])
@elementsList({
	entity: 'waybill',
	listName: 'waybillsList',
	tableComponent: WaybillsTable,
	formComponent: WaybillFormWrap,
	operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE']
})
export default class WaybillJournal extends CheckableElementsList {

	constructor(props, context) {
		super(props);

    this.removeElementAction = context.flux.getActions('waybills').deleteWaybill;

    this.state = Object.assign(this.state, {
			showPrintForm: false
    });
	}

	componentDidMount() {
		super.componentDidMount();

		const { flux } = this.context;
		flux.getActions('waybills').getWaybills();
		flux.getActions('employees').getEmployees();
		flux.getActions('objects').getCars();
	}

	showPrintForm(printNumber) {
		this.setState({showPrintForm: printNumber})
	}

	getAdditionalButtons() {
		return (
			<ButtonToolbar className="waybill-button-toolbar">
				<Dropdown id="dropdown-print" pullRight>
					<Dropdown.Toggle noCaret bsSize="small">
						<Glyphicon glyph="download-alt" />
					</Dropdown.Toggle>
					<Dropdown.Menu>
						<MenuItem onClick={this.showPrintForm.bind(this, 1)}>Журнал путевых листов (ТМФ №8)</MenuItem>
						<MenuItem onClick={this.showPrintForm.bind(this, 2)}>Отчет по выработке ТС</MenuItem>
					</Dropdown.Menu>
				</Dropdown>
			</ButtonToolbar>
		);
	}

	getAdditionalForms() {
		return (
			<WaybillPrintForm
					show={this.state.showPrintForm}
					hide={() => this.setState({showPrintForm: false})}/>
		);
	}
}
