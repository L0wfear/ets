import * as React from 'react';
import { Button as BootstrapButton, Glyphicon } from 'react-bootstrap';
import connectToStores from 'flummox/connect';

import { getToday0am, getToday2359 } from 'utils/dates';
import { FluxContext } from 'utils/decorators';
import { saveData } from 'utils/functions';

import enhanceWithPermissions from 'components/util/RequirePermissions.jsx';
import Paginator from 'components/ui/Paginator.jsx';
import Div from 'components/ui/Div.jsx';

import OrdersDatepicker from 'components/directories/order/OrdersDatepicker';
import OrdersTable from 'components/directories/order/OrdersTable';
import OrderFormWrap from 'components/directories/order/OrderFormWrap';

import OrderAssignmentsList from 'components/directories/order/order_assignment/OrderAssignmentsList';
import HistoryOrderList from 'components/directories/order/order_history/HistoryOrderList';

import { getDefaultMission, getDefaultDutyMission } from 'stores/MissionsStore.js';

const PaginatorTsx: any = Paginator;

const MAX_ITEMS_PER_PAGE = 15;

const Button = enhanceWithPermissions(BootstrapButton);

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
    const {
      location: {
        query: {
          dateFrom = getToday0am(),
          dateTo = getToday2359(),
        } = {},
      } = {},
      routeParams: {
        idOrder = '',
      } = {},
    } = this.props;

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

    const {
      routeParams: {
        idOrder = '',
      } = {},
    } = this.props;

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
    const {
      routeParams: {
        idOrder = '',
      } = {},
    } = props;
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
    const {
      routeParams: {
        idOrder = '',
      } = {},
    } = this.props;
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
  }) =>
    this.context.flux.getActions('objects').getOrders(
      countPerPage,
      page,
      sortBy,
      filter,
      dateFrom,
      dateTo,
    )
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

    return !num_exec || status === 'cancelled';
  }
  checkDisabledCMЕtemplate = () => {
    const {
      status = 'cancelled',
      technical_operations = [],
    } = (this.state.selectedElementOrder || {});

    return status === 'cancelled' || !technical_operations.some(({ num_exec }) => num_exec > 0);
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
      selectedElementOrder: {
        id: faxogramm_id,
        order_date,
        order_date_to,
        order_number,
      },
    } = this.state;

    const { missionSourcesList = [] } = this.props;

    const mElement = {
      ...getDefaultMission(),
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

    this.setState({
      missionData,
    });
  }
  handleClickOnCMTemplate = () => {
    const { missionSourcesList = [] } = this.props;

    const missionTemplateData: any = {
      showForm: true,
      typeClick: 'missionTemplate',
      mission_source_id: (missionSourcesList.find(({ auto }) => auto) || {}).id,
    };

    const {
      selectedElementOrder: {
        technical_operations = [],
        order_date,
        order_date_to,
      },
    } = this.state;

    missionTemplateData.technical_operations = technical_operations;

    missionTemplateData.orderDates = {
      order_date,
      order_date_to,
    };

    this.setState({
      missionTemplateData,
    });
  }
  handleClickOnCDMTemplate = () => {
    const { missionSourcesList = [] } = this.props;

    const missionTemplateData: any = {
      showForm: true,
      typeClick: 'missionDutyTemplate',
      mission_source_id: (missionSourcesList.find(({ auto }) => auto) || {}).id,
    };

    const {
      selectedElementOrder: {
        technical_operations = [],
        order_date,
        order_date_to,
      },
    } = this.state;

    missionTemplateData.technical_operations = technical_operations;

    missionTemplateData.orderDates = {
      order_date,
      order_date_to,
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

    return !((work_type_name === null || work_type_name === 'Ручные' || work_type_name === 'Комбинированный') && num_exec > 0);
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
        order_operation_id, norm_id,
      },
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

  saveOrder = () => {
    const {
      selectedElementOrder: {
        id,
      },
    } = this.state;

    this.context.flux.getActions('objects').saveOrder(id)
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
      this.getOrders({ filter });
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
          <Button permissions={['mission.create']} onClick={this.handleClickOnCM} disabled={this.checkDisabledCM()}>Создать задание</Button>
          <Button permissions={['mission_template.create']} onClick={this.handleClickOnCMTemplate} disabled={this.checkDisabledCMЕtemplate()}>Создать задание по шаблону</Button>
          <Button permissions={['duty_mission.create']} onClick={this.handleClickOnCDM} disabled={this.checkDisabledCDM()}>Создать наряд-задание</Button>
          <Button permissions={['mission_template.create']} onClick={this.handleClickOnCDMTemplate} disabled={this.checkDisabledCDMTemplate()}>Создать наряд-задание по шаблону</Button>
          <Button onClick={this.saveOrder} disabled={faxSE === null}><Glyphicon glyph="download-alt" /></Button>
        </OrdersTable>
        <Div hidden={!haveMax} >
          <PaginatorTsx currentPage={this.state.pageOptions.page} maxPage={Math.ceil(this.props.ordersTotalCount / MAX_ITEMS_PER_PAGE)} setPage={this.setPageOrderTable} firstLastButtons />
        </Div>
        <Div hidden={!faxSE} >
          <OrderAssignmentsList
            seleted={assSE}
            dataSource={faxSE}
            onRowSelectedAssignment={this.onRowSelectedAssignment}
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
