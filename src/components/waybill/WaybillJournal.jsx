import React from 'react';
import { autobind } from 'core-decorators';
import { Glyphicon, ButtonToolbar, Dropdown, MenuItem as BootstrapMenuItem } from 'react-bootstrap';
import { get } from 'lodash';

import { getServerSortingField, extractTableMeta } from 'components/ui/table/utils';
import { MAX_ITEMS_PER_PAGE } from 'constants/ui';
import CheckableElementsList from 'components/CheckableElementsList.jsx';
import Paginator from 'components/ui/Paginator.jsx';
import { connectToStores, staticProps, bindable } from 'utils/decorators';
import { waybillClosingSchema } from 'models/WaybillModel';
import WaybillFormWrap from './WaybillFormWrap.jsx';
import WaybillPrintForm from './WaybillPrintForm.jsx';
import WaybillsTable, { getTableMeta } from './WaybillsTable.jsx';

const MenuItem = bindable(BootstrapMenuItem);

@connectToStores(['waybills', 'objects', 'employees'])
@staticProps({
  entity: 'waybill',
  listName: 'waybillsList',
  schema: waybillClosingSchema,
  tableComponent: WaybillsTable,
  tableMeta: extractTableMeta(getTableMeta()),
  formComponent: WaybillFormWrap,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
@autobind
export default class WaybillJournal extends CheckableElementsList {

  constructor(props, context) {
    super(props);

    this.removeElementAction = context.flux.getActions('waybills').deleteWaybill;
    this.removeElementCallback = this.removeElementCallback.bind(this);

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
    flux.getActions('waybills').getWaybills(MAX_ITEMS_PER_PAGE, 0, this.state.sortBy, this.state.filter);
    flux.getActions('employees').getEmployees();
    flux.getActions('employees').getDrivers();
    flux.getActions('objects').getCars();
  }

  async componentWillUpdate(nextProps, nextState) {
    if (
      nextState.page !== this.state.page ||
      nextState.sortBy !== this.state.sortBy ||
      nextState.filter !== this.state.filter
    ) {
      this.updateList(nextState);
    }
  }

  removeElementCallback() {
    return this.context.flux.getActions('waybills').getWaybills(MAX_ITEMS_PER_PAGE, 0, this.state.sortBy, this.state.filter);
  }

  async updateList(state) {
    const pageOffset = state.page * MAX_ITEMS_PER_PAGE;
    const waybills = await this.context.flux.getActions('waybills').getWaybills(MAX_ITEMS_PER_PAGE, pageOffset, state.sortBy, state.filter);

    const { total_count } = waybills;
    const resultCount = waybills.result.length;

    if (resultCount === 0 && total_count > 0) {
      const offset = (Math.ceil(total_count / MAX_ITEMS_PER_PAGE) - 1) * MAX_ITEMS_PER_PAGE;
      this.context.flux.getActions('waybills').getWaybills(MAX_ITEMS_PER_PAGE, offset, state.sortBy, state.filter);
    }
  }

  showPrintForm(printNumber) {
    this.setState({ showPrintForm: printNumber });
  }

  getAdditionalProps() {
    const { structures } = this.context.flux.getStore('session').getCurrentUser();
    const changeSort = (field, direction) =>
      this.setState({ sortBy: getServerSortingField(field, direction, get(this.tableMeta, [field, 'sort', 'serverFieldName'])) });
    const changeFilter = filter => this.setState({ filter });
    return {
      structures,
      changeSort,
      changeFilter,
      filterValues: this.state.filter,
      rowNumberOffset: this.state.page * MAX_ITEMS_PER_PAGE,
    };
  }

  printData = (action, state) => action(state, this.state.filter);

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
        printData={this.printData}
      />
    );

    return forms;
  }

  async formCallback() {
    await this.updateList(this.state);
    super.formCallback();
  }

  additionalRender() {
    return <Paginator currentPage={this.state.page} maxPage={Math.ceil(this.props.waybillstotalCount / MAX_ITEMS_PER_PAGE)} setPage={page => this.setState({ page })} firstLastButtons />;
  }
}
