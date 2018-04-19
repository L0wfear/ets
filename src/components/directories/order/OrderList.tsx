import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  getOrders,
  setMInMissionTemplateData,
  setDMInMissionTemplateData,
  resetOrder,
} from 'redux/modules/order/action-order';
import { DropdownButton, MenuItem, Button as BootstrapButton, Glyphicon } from 'react-bootstrap';
import connectToStores from 'flummox/connect';
import * as queryString from 'query-string';

import { FluxContext } from 'utils/decorators';

import enhanceWithPermissions from 'components/util/RequirePermissions.jsx';

import OrdersDatepicker from 'components/directories/order/OrdersDatepicker';
import OrdersTable from 'components/directories/order/OrdersTable';
import OrderFormWrap from 'components/directories/order/OrderFormWrap';

import OrderAssignmentsList from 'components/directories/order/order_assignment/OrderAssignmentsList';
import HistoryOrderList from 'components/directories/order/order_history/HistoryOrderList';
import Paginator from 'components/directories/order/Paginator';
import { TypeDownload } from 'components/directories/order/constant-order';
import { getBlobOrder } from 'components/directories/order/utils-order';

const marginLeft = { marginLeft: 10 };

const Button = enhanceWithPermissions(BootstrapButton);
const title: any = <Glyphicon glyph="download-alt" />;

@FluxContext
class OrderList extends React.Component<any, any> {
  context: any;

  componentDidMount() {
    const { flux } = this.context;
    flux.getActions('missions').getMissionSources();
    flux.getActions('employees').getEmployees({ active: true });
    flux.getActions('objects').getCars();

    const {
      location: { search },
      match: { params: { idOrder = '' } },
    } = this.props;

    const outerIdFax = Number.parseInt(idOrder, 0);

    const {
      date_start,
      date_end,
    } = queryString.parse(search);

    const newPartPageOptions = {
      limit: !!outerIdFax ? 10000 : 15,
      date_start,
      date_end,
      haveMax: !outerIdFax,
    }

    this.props.getOrders(newPartPageOptions)
      .then(({ payload: { OrdersList } }) => {
        if (!isNaN(outerIdFax)) {
          const selectedElementOrder = OrdersList.find(({ id }) => id === outerIdFax);

          if (selectedElementOrder) {
            this.props.setSelectedElementOrder(selectedElementOrder);
          }
        }
      });
  }

  componentWillReceiveProps(props) {
    const { match: { params: { idOrder = '' } } } = this.props;

    const outerIdFax = Number.parseInt(idOrder, 0);

    if (outerIdFax) {
      const selectedElementOrder = this.props.OrdersList.find(({ id }) => id === outerIdFax) || null;
      this.props.setSelectedElementOrder(selectedElementOrder);
    }
  }

  componentWillUnmount() {
    this.props.resetOrder();
  }

  handleClickOnCMTemplate = () => this.props.setMInMissionTemplateData({ mission_source_id: (this.props.missionSourcesList.find(({ auto }) => auto) || {}).id })
  handleClickOnCDMTemplate = () => this.props.setDMInMissionTemplateData({ mission_source_id: (this.props.missionSourcesList.find(({ auto }) => auto) || {}).id })

  seclectDownload = eventName => getBlobOrder(this.props.selectedElementOrder, eventName)

  render() {
    const {
      selectedElementOrder: faxSE,
    } = this.props;

    return (
      <div className="ets-page-wrap">
        <OrdersDatepicker />
        <OrdersTable>
          <Button permissions={['mission_template.create']} onClick={this.handleClickOnCMTemplate} disabled={this.props.disabledOrderButtonTemplateMission}>Создать задание по шаблону</Button>
          <Button permissions={['mission_template.create']} onClick={this.handleClickOnCDMTemplate} disabled={this.props.disabledOrderButtonTemplateDutyMission}>Создать наряд-задание по шаблону</Button>
          <div style={marginLeft} >
            <DropdownButton onSelect={this.seclectDownload} pullRight title={title} id="bg-nested-dropdown">
              <MenuItem eventKey={TypeDownload.old} disabled={faxSE === null}>Скан-копия факсограммы</MenuItem>
              <MenuItem eventKey={TypeDownload.new} disabled={faxSE === null}>Расшифровка централизованного задания</MenuItem>
            </DropdownButton>
          </div>
        </OrdersTable>
        <Paginator />

        <OrderAssignmentsList/>
        <HistoryOrderList />
        <OrderFormWrap />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  OrdersList: state.order.OrdersList,
  selectedElementOrder: state.order.selectedElementOrder,

  disabledOrderButtonTemplateMission: state.order.disabledOrderButton.templateMission,
  disabledOrderButtonTemplateDutyMission: state.order.disabledOrderButton.templateDutyMission,
});
const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      getOrders,
      resetOrder,
      setMInMissionTemplateData,
      setDMInMissionTemplateData,
    },
    dispatch,
  ),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectToStores(OrderList, ['objects', 'missions']));
