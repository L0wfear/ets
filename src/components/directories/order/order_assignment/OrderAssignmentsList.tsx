import * as React from 'react';
import { Row, Col, Button as BootstrapButton } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  setMissionData,
  setDutyMissionData,
} from 'redux-main/modules/order/action-order';
import Div from 'components/ui/Div';
import connectToStores from 'flummox/connect';
import enhanceWithPermissions from 'components/util/RequirePermissionsNew';
import permissions_mission from 'components/missions/mission/config-data/permissions';
import permissions_duty_mission from 'components/missions/duty_mission/config-data/permissions';

import OrderAssignmentsInfoTable from 'components/directories/order/order_assignment/OrderAssignmentsInfoTable';
import OrderInfoTable from 'components/directories/order/order_assignment/OrderInfoTable';

const Button = enhanceWithPermissions({})(BootstrapButton);
const style: any = { marginLeft: 20, fontWeight: 'bold' };

const OrderAssignmentsList: React.SFC<any> = props => (
  <Div className="data-table data-other" hidden={props.hidden} >
    <Row>
      <Col md={8} className="flex-space-beetwen">
        <h4 style={style}>Расшифровка централизованного задания</h4>
        <div className="flex-button-group">
          <Button permission={permissions_mission.create} onClick={props.handleClickOnCM} disabled={props.disabledAssignmentButtonMission}>Создать задание</Button>
          <Button permission={permissions_duty_mission.create} onClick={props.handleClickOnCDM} disabled={props.disabledAssignmentButtonDutyMission}>Создать наряд-задание</Button>
        </div>
      </Col>
      <Col md={8}>
        <OrderAssignmentsInfoTable />
      </Col>
      <Col md={4}>
        <OrderInfoTable />
      </Col>
    </Row>
  </Div>
);

const mapStateToProps = (state) => ({
  hidden: !state.order.selectedElementOrder,
  disabledAssignmentButtonMission: state.order.disabledAssignmentButton.mission,
  disabledAssignmentButtonDutyMission: state.order.disabledAssignmentButton.dutyMission,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      setMissionData,
      setDutyMissionData,
    },
    dispatch,
  ),
})

const mergeProps = (stateProps, dispatchProps, { order_mission_source_id: mission_source_id }) => ({
  ...stateProps,
  handleClickOnCM: () => dispatchProps.setMissionData({ mission_source_id }),
  handleClickOnCDM: () => dispatchProps.setDutyMissionData({ mission_source_id }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(connectToStores(OrderAssignmentsList, ['missions']));
