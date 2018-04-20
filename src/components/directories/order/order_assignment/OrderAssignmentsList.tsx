import * as React from 'react';
import { Row, Col, Button as BootstrapButton } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  setMissionData,
  setDutyMissionData,
} from 'redux/modules/order/action-order';
import Div from 'components/ui/Div.jsx';
import connectToStores from 'flummox/connect';
import { missionTemplateListPermission } from 'components/directories/order/constant-order';
import enhanceWithPermissions from 'components/util/RequirePermissions.jsx';

import OrderAssignmentsInfoTable from 'components/directories/order/order_assignment/OrderAssignmentsInfoTable';
import OrderInfoTable from 'components/directories/order/order_assignment/OrderInfoTable';

const Button = enhanceWithPermissions(BootstrapButton);
const style: any = { marginLeft: 20, fontWeight: 'bold' };

const OrderAssignmentsList: React.SFC<any> = props => (
  <Div hidden={props.hidden} >
    <Row>
      <Col md={8} className="flex-space-beetwen">
        <h4 style={style}>Расшифровка централизованного задания</h4>
        <div className="flex-button-group">
          <Button permisspions={missionTemplateListPermission.mission} onClick={props.handleClickOnCM} disabled={props.disabledAssignmentButtonMission}>Создать задание</Button>
          <Button permissions={missionTemplateListPermission.dutyMission} onClick={props.handleClickOnCDM} disabled={props.disabledAssignmentButtonDutyMission}>Создать наряд-задание</Button>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectToStores(OrderAssignmentsList, ['missions']));
