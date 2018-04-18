import * as React from 'react';
import { DropdownButton, MenuItem, Button as BootstrapButton, Glyphicon } from 'react-bootstrap';
import connectToStores from 'flummox/connect';
import * as queryString from 'query-string';
import { getToday9am } from 'utils/dates';

import { getToday0am, getToday2359 } from 'utils/dates';
import { FluxContext } from 'utils/decorators';
import { saveData } from 'utils/functions';
import { diffDates } from 'utils/dates.js';

import enhanceWithPermissions from 'components/util/RequirePermissions.jsx';
import Paginator from 'components/ui/Paginator.jsx';
import Div from 'components/ui/Div.jsx';

import OrdersDatepicker from 'components/directories/order/OrdersDatepicker';
import OrdersTable from 'components/directories/order/OrdersTable';
import OrderFormWrap from 'components/directories/order/OrderFormWrap';

import OrderAssignmentsList from 'components/directories/order/order_assignment/OrderAssignmentsList';
import HistoryOrderList from 'components/directories/order/order_history/HistoryOrderList';

import { getDefaultMission, getDefaultDutyMission } from 'stores/MissionsStore.js';

import { typeTemplate } from 'components/directories/order/forms/utils/constant';

const PaginatorTsx: any = Paginator;

const MAX_ITEMS_PER_PAGE = 15;

const TypeDownload = {
  old: '1',
  new: '2',
};
const marginLeft = { marginLeft: 10 };

const Button = enhanceWithPermissions(BootstrapButton);
const title: any = <Glyphicon glyph="download-alt" />;

/**
 * @todo
 * path to stateless component
 * - внешний state на redux
 * - композиция
 * - папка utils со всеми лишними функциями
 */
@FluxContext
class OrderList extends React.Component<any, any> {
  context: any;
  constructor(props) {
    super(props);
    const { location: { search } } = this.props;
    const {
      dateFrom = getToday0am(),
      dateTo = getToday2359(),
    } = queryString.parse(search);

    const { match: { params: { idOrder = '' } } } = this.props;

    this.state = {
      pageOptions: {
        page: 0,
        dateFrom,
        dateTo,
        sortBy: ['order_number:desc'],
        filter: {},
        haveMax: !idOrder,
      },
      selectedElementOrder: null,
      selectedElementAssignment: null,
      missionData: {},
      missionTemplateData: {},
      dutyMissionData: {},
      showHistoryComponent: false,
      historyOrder: [],
    };
  }
  componentDidMount() {
    const { flux } = this.context;
    flux.getActions('missions').getMissionSources();
    flux.getActions('employees').getEmployees({ active: true });
    flux.getActions('objects').getCars();

    const { match: { params: { idOrder = '' } } } = this.props;
    const outerIdFax = Number.parseInt(idOrder, 0);

    this.getOrders({ countPerPage: !!outerIdFax ? 10000 : MAX_ITEMS_PER_PAGE }).then(({ result = [] }) => {
      if (!isNaN(outerIdFax)) {
        const selectedElementOrder = result.find(({ id }) => id === outerIdFax);
        if (selectedElementOrder) {
          this.setState({
            ...this.state,
            selectedElementOrder,
          });
        }
      }
    });
  }
  async componentWillUpdate(nextProps, nextState) {
    const {
      pageOptions: {
        page: currPage,
        dateFrom: currDateFrom,
        dateTo: currDateTo,
        sortBy: currSortBy,
        filter: currFilter,
      },
    } = this.state;

    const {
      pageOptions: {
        page: nextPage,
        sortBy: nextSortBy,
        filter: nextFilter,
        haveMax,
      },
    } = nextState;

    if (
      nextPage !== currPage ||
      nextSortBy !== currSortBy ||
      nextFilter !== currFilter
    ) {
      const pageOffset = haveMax ? nextPage * MAX_ITEMS_PER_PAGE : 10000;

      const objects = await this.getOrders({
        countPerPage: MAX_ITEMS_PER_PAGE,
        page: pageOffset,
        sortBy: nextSortBy,
        filter: nextFilter,
        dateFrom: currDateFrom,
        dateTo: currDateTo,
      });

      const {
        total_count,
        result: {
          length: resultCount,
        },
      } = objects;

      if (resultCount === 0 && total_count > 0) {
        const offset = (Math.ceil(total_count / MAX_ITEMS_PER_PAGE) - 1) * MAX_ITEMS_PER_PAGE;
        this.getOrders({
          countPerPage: MAX_ITEMS_PER_PAGE,
          page: offset,
          sortBy: nextSortBy,
          filter: nextFilter,
          dateFrom: currDateFrom,
          dateTo: currDateTo,
        });
      }
    }
  }
  componentWillReceiveProps(props) {
    const { match: { params: { idOrder = '' } } } = this.props;

    const outerIdFax = Number.parseInt(idOrder, 0);

    if (outerIdFax) {
      const selectedElementOrder = this.props.OrdersList.find(({ id }) => id === outerIdFax) || null;
      this.setState({
        selectedElementOrder,
      });
    }
  }

  componentWillUnmount() {
    this.context.flux.getActions('objects').resetOrder();
  }

  handleChange = (field, value) => {
    const { match: { params: { idOrder = '' } } } = this.props;

    if (!!idOrder) {
      this.props.history.push('/orders');
    }
    const pageOptions = {
      ...this.state.pageOptions,
      [field]: value,
    };

    this.getOrders({ [field]: value });
    const showHistoryComponent = false;

    this.setState({
      ...this.state,
      pageOptions,
      selectedElementOrder: null,
      selectedElementAssignment: null,
      showHistoryComponent,
    });
  }

  getOrders = ({
    countPerPage = MAX_ITEMS_PER_PAGE,
    page = this.state.pageOptions.page,
    sortBy = this.state.pageOptions.sortBy,
    filter = this.state.pageOptions.filter,
    dateFrom = this.state.pageOptions.dateFrom,
    dateTo = this.state.pageOptions.dateTo,
  }) => {
    this.setState({ selectedElementOrder: null });

    return this.context.flux.getActions('objects').getOrders(
      countPerPage,
      page,
      sortBy,
      filter,
      dateFrom,
      dateTo,
    );
  }
  getOrderHistory = id => this.context.flux.getActions('objects').getOrderHistoryById(id);
  showOrderHistory = ({ result: { rows = [] } = {} }) => {
    this.setState({
      showHistoryComponent: true,
      historyOrder: rows,
    });
  }

  onRowSelectedOrder = ({ props: { data: selectedElementOrder } }) => {
    const { id } = selectedElementOrder;
    this.getOrderHistory(id).then(this.showOrderHistory);
    this.setState({
      ...this.state,
      selectedElementOrder,
      selectedElementAssignment: null,
      showHistoryComponent: false,
    });
  }
  onRowSelectedAssignment = ({ props: { data: selectedElementAssignment } }) => {
    this.setState({
      selectedElementAssignment,
    });
  }

  checkDisabledCM = () => {
    const sEF = this.state.selectedElementOrder;
    const sEA = this.state.selectedElementAssignment;

    if (!sEA || !sEF) {
      return true;
    }
    const {
      status = 'cancelled',
    } = sEF;
    const {
      num_exec = 0,
    } = sEA;
    const dateTo = sEA.date_to || sEF.order_date_to;

    return !num_exec || diffDates(new Date(), dateTo) > 0 || status === 'cancelled';
  }
  checkDisabledCMЕtemplate = () => {
    const {
      status = 'cancelled',
      technical_operations = [],
      order_date_to = null,
    } = (this.state.selectedElementOrder || {});

    return status === 'cancelled' || diffDates(new Date(), order_date_to, 'minutes') > 0 || !technical_operations.some(({ num_exec }) => num_exec > 0);
  }
  checkDisabledCDMTemplate = () => {
    const {
      technical_operations = [],
    } = (this.state.selectedElementOrder || {});
    return this.checkDisabledCMЕtemplate() || !(technical_operations.some(({ num_exec, work_type_name }) => (num_exec > 0) && (work_type_name === 'Ручные' || work_type_name === 'Комбинированный')));
  }
  handleClickOnCM = () => {
    const missionData: any = {
      showForm: true,
    };
    const {
      selectedElementAssignment: {
        num_exec: passes_count,
        id: technical_operation_id,
        date_from,
        date_to,
        municipal_facility_id,
        order_operation_id,
        norm_id,
      },
      selectedElementOrder: order,
      selectedElementOrder: {
        id: faxogramm_id,
        order_date,
        order_date_to,
        order_number,
      },
    } = this.state;

    const { missionSourcesList = [] } = this.props;

    const mElement = {
      ...getDefaultMission(getToday9am()),
      technical_operation_id,
      municipal_facility_id,
      faxogramm_id,
      order_number,
      order_operation_id,
      passes_count,
      norm_id,
      date_start: date_from || order_date,
      date_end: date_to || order_date_to,
      mission_source_id: (missionSourcesList.find(({ auto }) => auto) || {}).id,
    };

    const initMission = { ...mElement };

    missionData.mElement = mElement;
    missionData.initMission = initMission;
    missionData.order = order;

    this.setState({
      missionData,
    });
  }
  handleClickOnCMTemplate = () => {
    const { missionSourcesList = [] } = this.props;

    const missionTemplateData: any = {
      showForm: true,
      typeClick: typeTemplate.missionTemplate,
      mission_source_id: (missionSourcesList.find(({ auto }) => auto) || {}).id,
    };

    const {
      selectedElementOrder: {
        technical_operations = [],
        order_date,
        order_date_to,
        id: faxogramm_id,
      },
    } = this.state;

    missionTemplateData.technical_operations = technical_operations;

    missionTemplateData.orderDates = {
      order_date,
      order_date_to,
      faxogramm_id,
    };

    this.setState({
      missionTemplateData,
    });
  }
  handleClickOnCDMTemplate = () => {
    const { missionSourcesList = [] } = this.props;

    const missionTemplateData: any = {
      showForm: true,
      typeClick: typeTemplate.missionDutyTemplate,
      mission_source_id: (missionSourcesList.find(({ auto }) => auto) || {}).id,
    };

    const {
      selectedElementOrder: {
        technical_operations = [],
        order_date,
        order_date_to,
        id: faxogramm_id,
      },
    } = this.state;

    missionTemplateData.technical_operations = technical_operations;

    missionTemplateData.orderDates = {
      order_date,
      order_date_to,
      faxogramm_id,
    };

    this.setState({
      missionTemplateData,
    });
  }

  onHideCM = () =>
    this.setState({
      missionData: {
        showForm: false,
      },
    })
    onHideCMTemplate = () =>
    this.setState({
      missionTemplateData: {
        showForm: false,
      },
    })

  checkDisabledCDM = () => {
    const sEA = this.state.selectedElementAssignment;
    if (!sEA) {
      return true;
    }

    const {
      work_type_name = null,
      num_exec,
    } = sEA;
    const dateTo = sEA.date_to || this.state.selectedElementOrder.order_date_to;

    return !((work_type_name === null || work_type_name === 'Ручные' || work_type_name === 'Комбинированный') && num_exec > 0) || diffDates(new Date(), dateTo) > 0;
  }

  handleClickOnCDM = () => {
    const dutyMissionData: any = {
      showForm: true,
    };
    const {
      selectedElementAssignment: {
        id: technical_operation_id,
        date_from,
        date_to,
        municipal_facility_id,
        order_operation_id,
        norm_id,
      },
      selectedElementOrder: order,
      selectedElementOrder: {
        id: faxogramm_id,
        order_date,
        order_date_to,
        order_number,
      },
    } = this.state;

    const { missionSourcesList = [] } = this.props;

    const dmElement = {
      ...getDefaultDutyMission(),
      technical_operation_id,
      municipal_facility_id,
      order_operation_id,
      faxogramm_id,
      order_number,
      norm_id,
      plan_date_start: date_from || order_date,
      plan_date_end: date_to || order_date_to,
      mission_source_id: (missionSourcesList.find(({ auto }) => auto) || {}).id,
      status: 'not_assigned',
    };
    const initDutyMission = { ...dmElement };

    dutyMissionData.dmElement = dmElement;
    dutyMissionData.initDutyMission = initDutyMission;
    dutyMissionData.order = order;

    this.setState({
      ...this.state,
      dutyMissionData,
    });
  }
  onHideCDM = () =>
    this.setState({
      ...this.state,
      dutyMissionData: {
        showForm: false,
      },
    })

  saveOrder = typeSave => {
    const {
      selectedElementOrder: {
        id,
      },
    } = this.state;

    const payload: any = {};
    if (typeSave === TypeDownload.new) {
      payload.format = 'xls';
    }

    this.context.flux.getActions('objects').saveOrder(id, payload)
      .then(({ blob, fileName }) => saveData(blob, fileName));
  }

  setPageOrderTable = page => {
    const pageOptions = {
      ...this.state.pageOptions,
      page,
    };

    this.setState({
      ...this.state,
      pageOptions,
    });
  }

  changeSort = (field, direction) =>
    this.setState({
      ...this.state,
      pageOptions: {
        ...this.state.pageOptions,
        sortBy: `${field}:${direction ? 'asc' : 'desc'}`,
      },
    })
  changeFilter = filter => {
      this.setState({
        ...this.state,
        pageOptions: {
          ...this.state.pageOptions,
          filter,
        },
      });
    }
  getAdditionalProps = () => {
    const {
      pageOptions: {
        filter: filterValues,
        haveMax,
      },
    } = this.state;

    return {
      changeSort: this.changeSort,
      changeFilter: this.changeFilter,
      filterValues,
      haveMax,
    };
  }

  seclectDownload = eventName => {
    switch (eventName) {
      case TypeDownload.old:
        this.saveOrder(TypeDownload.old);
        return;
      case TypeDownload.new:
        this.saveOrder(TypeDownload.new);
        return;
    }

    return undefined;
  }

  render() {
    const {
      pageOptions: {
        dateFrom,
        dateTo,
        haveMax,
      },
      selectedElementOrder: faxSE,
      selectedElementAssignment: assSE,
      missionData = {},
      dutyMissionData = {},
      missionTemplateData = {},
      showHistoryComponent,
      historyOrder,
    } = this.state;

    const {
      OrdersList = [],
    } = this.props;

    return (
      <div className="ets-page-wrap">
        <OrdersDatepicker
          dateFrom={dateFrom}
          dateTo={dateTo}
          handleChange={this.handleChange}
        />
        <OrdersTable
          data={OrdersList}
          onRowSelected={this.onRowSelectedOrder}
          selected={faxSE}
          selectField={'id'}
          {...this.props}
          {...this.getAdditionalProps()}
        >
          <Button permissions={['mission_template.create']} onClick={this.handleClickOnCMTemplate} disabled={this.checkDisabledCMЕtemplate()}>Создать задание по шаблону</Button>
          <Button permissions={['mission_template.create']} onClick={this.handleClickOnCDMTemplate} disabled={this.checkDisabledCDMTemplate()}>Создать наряд-задание по шаблону</Button>
          <div style={marginLeft} >
            <DropdownButton onSelect={this.seclectDownload} pullRight title={title} id="bg-nested-dropdown">
              <MenuItem eventKey={TypeDownload.old} disabled={faxSE === null}>Скан-копия факсограммы</MenuItem>
              {<MenuItem eventKey={TypeDownload.new} disabled={faxSE === null}>Расшифровка централизованного задания</MenuItem>}
            </DropdownButton>
          </div>
        </OrdersTable>
        <Div hidden={!haveMax} >
          <PaginatorTsx currentPage={this.state.pageOptions.page} maxPage={Math.ceil(this.props.ordersTotalCount / MAX_ITEMS_PER_PAGE)} setPage={this.setPageOrderTable} firstLastButtons />
        </Div>
        <Div hidden={!faxSE} >
          <OrderAssignmentsList
            seleted={assSE}
            dataSource={faxSE}
            onRowSelectedAssignment={this.onRowSelectedAssignment}
            handleClickOnCM={this.handleClickOnCM}
            handleClickOnCDM={this.handleClickOnCDM}
            checkDisabledCM={this.checkDisabledCM}
            checkDisabledCDM={this.checkDisabledCDM}
          />
        </Div>
        <Div hidden={!showHistoryComponent || !faxSE}>
          <HistoryOrderList
            data={historyOrder}
          />
        </Div>
        <OrderFormWrap
          missionData={missionData}
          missionTemplateData={missionTemplateData}
          dutyMissionData={dutyMissionData}
          onHideCM={this.onHideCM}
          onHideCDM={this.onHideCDM}
          onHideCMTemplate={this.onHideCMTemplate}
        />
      </div>
    );
  }
}

export default connectToStores(OrderList, ['objects', 'missions']);
