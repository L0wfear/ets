import React from 'react';
import { autobind } from 'core-decorators';
import { Glyphicon, ButtonToolbar, Dropdown, MenuItem as BootstrapMenuItem } from 'react-bootstrap';
import CheckableElementsList from 'components/CheckableElementsList.jsx';
import { connectToStores, staticProps, bindable } from 'utils/decorators';
import WaybillFormWrap from './WaybillFormWrap.jsx';
import WaybillPrintForm from './WaybillPrintForm.jsx';
import WaybillsTable from './WaybillsTable.jsx';

const MenuItem = bindable(BootstrapMenuItem);

@connectToStores(['waybills', 'objects', 'employees'])
@staticProps({
  entity: 'waybill',
  listName: 'waybillsList',
  tableComponent: WaybillsTable,
  formComponent: WaybillFormWrap,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
@autobind
export default class WaybillJournal extends CheckableElementsList {

  constructor(props, context) {
    super(props);

    this.removeElementAction = context.flux.getActions('waybills').deleteWaybill;

    this.state = Object.assign(this.state, {
      showPrintForm: false,
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
    this.setState({ showPrintForm: printNumber });
  }

  /**
   * @override
   */
  getButtons() {
    const buttons = super.getButtons();

    buttons.push(
      <ButtonToolbar key={buttons.length} className="waybill-button-toolbar">
        <Dropdown id="dropdown-print" pullRight>
          <Dropdown.Toggle noCaret bsSize="small">
            <Glyphicon glyph="download-alt" />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <MenuItem bindOnClick={1} onClick={this.showPrintForm}>Журнал путевых листов (ТМФ №8)</MenuItem>
            <MenuItem bindOnClick={2} onClick={this.showPrintForm}>Отчет по выработке ТС</MenuItem>
          </Dropdown.Menu>
        </Dropdown>
      </ButtonToolbar>
    );

    return buttons;
  }

  /**
   * @override
   */
  getForms() {
    const forms = super.getForms();

    forms.push(
      <WaybillPrintForm
        key={forms.length}
        show={this.state.showPrintForm}
        hide={() => this.setState({ showPrintForm: false })}
      />
    );

    return forms;
  }
}
