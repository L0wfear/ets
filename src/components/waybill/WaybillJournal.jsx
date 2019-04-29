import React from 'react';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';
import * as Dropdown from 'react-bootstrap/lib/Dropdown';
import * as MenuItem from 'react-bootstrap/lib/MenuItem';
import * as Button from 'react-bootstrap/lib/Button';

import { get } from 'lodash';
import {
  ButtonCreateNew,
  ButtonReadNew,
  ButtonDeleteNew,
} from 'components/ui/buttons/CRUD';

import {
  getServerSortingField,
  extractTableMeta,
  toServerFilteringObject,
} from 'components/ui/table/utils';
import { MAX_ITEMS_PER_PAGE } from 'constants/ui';
import UNSAFE_CheckableElementsList from 'components/program_registry/UNSAFE_CheckableElementsList';
import Paginator from 'components/ui/new/paginator/Paginator';

import { connectToStores, staticProps } from 'utils/decorators';
import { waybillClosingSchema } from 'models/WaybillModel';
import WaybillFormWrap from 'components/waybill/WaybillFormWrap';
import WaybillPrintForm from 'components/waybill/WaybillPrintForm';
import WaybillsTable, { getTableMeta } from 'components/waybill/WaybillsTable';
import permissions from 'components/waybill/config-data/permissions';
import { compose } from 'recompose';
import { getSessionState } from 'redux-main/reducers/selectors';
import { connect } from 'react-redux';
import { DropdownWrap } from './styled';

@connectToStores(['waybills', 'objects', 'employees'])
@staticProps({
  entity: 'waybill',
  permissions,
  listName: 'waybillsList',
  schema: waybillClosingSchema,
  tableComponent: WaybillsTable,
  tableMeta: extractTableMeta(getTableMeta()),
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
class WaybillJournal extends UNSAFE_CheckableElementsList {
  constructor(props, context) {
    super(props);

    this.removeElementAction = context.flux.getActions(
      'waybills',
    ).deleteWaybill;
    this.removeElementCallback = this.removeElementCallback.bind(this);

    this.state = Object.assign(this.state, {
      showPrintForm: false,
      page: 0,
      sortBy: ['number:desc'],
      filter: {},
    });
  }

  init() {
    this.updateList();

    this.setState({
      readPermission: [
        permissions.read,
        permissions.departure_and_arrival_values,
      ].some((pName) => this.props.userData.permissionsSet.has(pName)),
    });
  }

  loadDependecyData = () => {
    const { flux } = this.context;
    flux.getActions('employees').getEmployees();
    flux.getActions('employees').getDrivers();
    flux.getActions('objects').getWaybillSomeCars();
    flux.getActions('objects').getWorkMode();
  };

  componentDidUpdate(nextProps, prevState) {
    if (
      prevState.page !== this.state.page
      || prevState.sortBy !== this.state.sortBy
      || prevState.filter !== this.state.filter
    ) {
      this.updateList();
    }
  }

  removeElementCallback = () => {
    const { page } = this.state;
    if (page !== 0) {
      this.setState({ page: 0 });
    } else {
      this.updateList();
      this.changeWaybillListAction();
    }
  };

  updateList = async (state = this.state) => {
    const filter = toServerFilteringObject(state.filter, this.tableMeta);

    const pageOffset = state.page * MAX_ITEMS_PER_PAGE;
    const waybills = await this.context.flux
      .getActions('waybills')
      .getWaybills(MAX_ITEMS_PER_PAGE, pageOffset, state.sortBy, filter);

    const { total_count } = waybills;
    const resultCount = waybills.result.length;

    if (resultCount === 0 && total_count > 0) {
      this.setState({ page: Math.ceil(total_count / MAX_ITEMS_PER_PAGE) - 1 });
    }
  };

  showPrintForm = (showPrintForm) => this.setState({ showPrintForm });

  changeFilter = (filter) => this.setState({ filter });

  changeSort = (field, direction) =>
    this.setState({
      sortBy: getServerSortingField(
        field,
        direction,
        get(this.tableMeta, [field, 'sort', 'serverFieldName']),
      ),
    });

  getAdditionalProps = () => {
    const { structures } = this.props.userData;

    return {
      structures,
      changeSort: this.changeSort,
      changeFilter: this.changeFilter,
      filterValues: this.state.filter,
      rowNumberOffset: this.state.page * MAX_ITEMS_PER_PAGE,
      useServerFilter: true,
      useServerSort: true,
      loadDependecyData: this.loadDependecyData,
    };
  };

  printData = (action, state) => action(state, this.state.filter);

  /**
   * @override
   */
  getButtons = () => {
    // Операции, заданные в статической переменной operations класса-наследника
    const operations = this.constructor.operations || [];
    const buttons = [];

    if (operations.indexOf('CREATE') > -1) {
      buttons.push(
        <ButtonCreateNew
          key="button-create"
          buttonName="Создать"
          onClick={this.createElement}
          permission={this.permissions.create}
        />,
      );
    }
    if (operations.indexOf('READ') > -1) {
      buttons.push(
        <ButtonReadNew
          key="button-read"
          buttonName="Просмотреть"
          onClick={this.showForm}
          permissions={[
            this.permissions.read,
            this.permissions.departure_and_arrival_values,
          ]}
          disabled={this.checkDisabledRead()}
        />,
      );
    }
    if (operations.indexOf('DELETE') > -1) {
      buttons.push(
        <ButtonDeleteNew
          key="button-delete"
          buttonName="Удалить"
          onClick={this.removeCheckedElements}
          permission={this.permissions.delete}
          disabled={this.checkDisabledDelete()}
        />,
      );
    }
    if (this.props.exportable) {
      buttons.push(
        <Button key={buttons.length} bsSize="small" onClick={this.handleExport}>
          <Glyphicon glyph="download-alt" />
        </Button>,
      );
    }

    buttons.push(
      <DropdownWrap key="print" id="dropdown-print" pullRight>
        <Dropdown.Toggle noCaret bsSize="small">
          <Glyphicon glyph="download-alt" />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <MenuItem eventKey={1} onSelect={this.showPrintForm}>
            Журнал путевых листов (ТМФ №8)
          </MenuItem>
          <MenuItem eventKey={2} onSelect={this.showPrintForm}>
            Отчет по выработке ТС
          </MenuItem>
        </Dropdown.Menu>
      </DropdownWrap>,
    );

    return buttons;
  };

  onHideWaybillPrintForm = () => this.setState({ showPrintForm: false });

  /**
   * @override
   */
  getForms = () => {
    const forms = [];

    if (this.state.showForm) {
      forms.push(
        <WaybillFormWrap
          key="WaybillFormWrap"
          onFormHide={this.onFormHide}
          element={this.state.selectedElement}
          setNewSelectedElement={this.setNewSelectedElement}
          entity={this.entity}
          selectField={this.selectField}
          onCallback={this.formCallback}
          meta={this.constructor.formMeta}
          renderers={this.constructor.formRenderers}
          permissions={[`${this.entity}.read`]}
          flux={this.context.flux}
          {...this.getAdditionalFormProps()}
          {...this.props}
        />,
      );
    }

    forms.push(
      <WaybillPrintForm
        key="waybill-print-from"
        show={this.state.showPrintForm}
        onHide={this.onHideWaybillPrintForm}
        printData={this.printData}
      />,
    );

    return forms;
  };

  // call create/update/delete waybill
  changeWaybillListAction = () => {
    const { flux } = this.context;
    flux.getActions('objects').getWaybillSomeCars();
  };

  formCallback = async (flags) => {
    const showWaybillFormWrap = get(flags, 'showWaybillFormWrap', false);

    await this.updateList(this.state);
    this.changeWaybillListAction();
    if (!showWaybillFormWrap) {
      this.onFormHide();
    }
  };

  additionalRender = () => {
    const additionalRender = [
      <Paginator
        key="pagination"
        currentPage={this.state.page}
        maxPage={Math.ceil(this.props.waybillstotalCount / MAX_ITEMS_PER_PAGE)}
        setPage={(page) => this.setState({ page })}
        firstLastButtons
      />,
    ];

    return additionalRender;
  };
}

export default compose(
  connect((state) => ({
    userData: getSessionState(state).userData,
  })),
)(WaybillJournal);
