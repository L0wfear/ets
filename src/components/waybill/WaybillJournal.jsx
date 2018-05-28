import React from 'react';
import { autobind } from 'core-decorators';
import { Glyphicon, ButtonToolbar, Dropdown, MenuItem } from 'react-bootstrap';
import { get } from 'lodash';

import { getServerSortingField, extractTableMeta } from 'components/ui/table/utils';
import { MAX_ITEMS_PER_PAGE } from 'constants/ui';
import CheckableElementsList from 'components/CheckableElementsList.jsx';
import Paginator from 'components/ui/Paginator.jsx';
import { connectToStores, staticProps } from 'utils/decorators';
import { waybillClosingSchema } from 'models/WaybillModel';
import WaybillFormWrap from './WaybillFormWrap.jsx';
import WaybillPrintForm from './WaybillPrintForm.jsx';
import WaybillsTable, { getTableMeta } from './WaybillsTable.jsx';
import permissions from 'components/waybill/config-data/permissions';
@connectToStores(['waybills', 'objects', 'employees'])
@staticProps({
  entity: 'waybill',
  permissions,
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
    flux.getActions('objects').getWorkMode();
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

  showPrintForm = showPrintForm => this.setState({ showPrintForm });
  changeFilter = filter => this.setState({ filter });
  changeSort = (field, direction) =>
    this.setState({ sortBy: getServerSortingField(field, direction, get(this.tableMeta, [field, 'sort', 'serverFieldName'])) });

  getAdditionalProps() {
    const { structures } = this.context.flux.getStore('session').getCurrentUser();
    return {
      structures,
      changeSort: this.changeSort,
      changeFilter: this.changeFilter,
      filterValues: this.state.filter,
      rowNumberOffset: this.state.page * MAX_ITEMS_PER_PAGE,
      useServerFilter: true,
      useServerSort: true,
    };
  }

  printData = (action, state) => action(state, this.state.filter);

  /**
   * @override
   */
  getButtons() {
    const buttons = super.getButtons();

    buttons.push(
      <ButtonToolbar key={'print-waybil-group'} className="waybill-button-toolbar">
        <Dropdown id="dropdown-print" pullRight>
          <Dropdown.Toggle noCaret bsSize="small">
            <Glyphicon glyph="download-alt" />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <MenuItem eventKey={1} onSelect={this.showPrintForm}>Журнал путевых листов (ТМФ №8)</MenuItem>
            <MenuItem eventKey={2} onSelect={this.showPrintForm}>Отчет по выработке ТС</MenuItem>
          </Dropdown.Menu>
        </Dropdown>
      </ButtonToolbar>
    );

    return buttons;
  }

  onHideWaybillPrintForm = () => this.setState({ showPrintForm: false });

  /**
   * @override
   */
  getForms() {
    const forms = super.getForms();

    forms.push(
      <WaybillPrintForm
        key={'waybill-print-from'}
        show={this.state.showPrintForm}
        onHide={this.onHideWaybillPrintForm}
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
