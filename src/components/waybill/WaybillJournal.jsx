import React from 'react';
import { autobind } from 'core-decorators';
import { Glyphicon, ButtonToolbar, Dropdown, MenuItem as BootstrapMenuItem } from 'react-bootstrap';
import CheckableElementsList from 'components/CheckableElementsList.jsx';
import Paginator from 'components/ui/Paginator.jsx';
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
      page: 0,
      sortBy: ['number:desc'],
      filter: {},
    });
  }

  componentDidMount() {
    super.componentDidMount();

    const { flux } = this.context;
    flux.getActions('waybills').getWaybills(15, 0, this.state.sortBy, this.state.filter);
    flux.getActions('employees').getEmployees();
    flux.getActions('employees').getDrivers();
    flux.getActions('objects').getCars();
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.page !== this.state.page || nextState.sortBy !== this.state.sortBy) {
      this.context.flux.getActions('waybills').getWaybills(15, nextState.page * 15, nextState.sortBy, nextState.filter);
    }
  }

  showPrintForm(printNumber) {
    this.setState({ showPrintForm: printNumber });
  }

  getAdditionalProps() {
    const { structures } = this.context.flux.getStore('session').getCurrentUser();
    const changeSort = (field, direction) => this.setState({ sortBy: `${field}:${direction ? 'asc' : 'desc'}` });
    const changeFilter = (filter) => {
      this.context.flux.getActions('waybills').getWaybills(15, this.state.page * 15, this.state.sortBy, filter);
      this.setState({ filter });
    }
    return { structures, changeSort, changeFilter, filterValues: this.state.filter };
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

  additionalRender() {
    return <Paginator currentPage={this.state.page} maxPage={Math.ceil(this.props.totalCount / 15)} setPage={page => this.setState({ page })} firstLastButtons />;
  }
}
