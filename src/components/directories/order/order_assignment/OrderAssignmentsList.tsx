import * as React from 'react';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  setMissionData,
  setDutyMissionData,
} from 'redux-main/reducers/modules/order/action-order';
import Div from 'components/ui/Div';
import connectToStores from 'flummox/connect';

import OrderAssignmentsInfoTable from 'components/directories/order/order_assignment/OrderAssignmentsInfoTable';
import OrderInfoTable from 'components/directories/order/order_assignment/OrderInfoTable';
import dutyMissionPermissions from 'components/new/pages/missions/duty_mission/_config-data/permissions';

import {
  ColOrderAssignmentHeaderTitleContainer,
  ButtonOrderAssignment,
  TitleText,
} from 'components/directories/order/order_assignment/styled/styled';
import missionPermissions from 'components/new/pages/missions/mission/_config-data/permissions';

const OrderAssignmentsList: React.FunctionComponent<any> = (props) => (
  <Div className="data-table data-other" hidden={props.hidden} >
    <Row>
      <ColOrderAssignmentHeaderTitleContainer md={8}>
        <TitleText>Расшифровка централизованного задания</TitleText>
        <div>
          <ButtonOrderAssignment permissions={missionPermissions.create} onClick={props.setMissionData} disabled={props.disabledAssignmentButtonMission}>Создать задание</ButtonOrderAssignment>
          <ButtonOrderAssignment permissions={dutyMissionPermissions.create} onClick={props.setDutyMissionData} disabled={props.disabledAssignmentButtonDutyMission}>Создать наряд-задание</ButtonOrderAssignment>
        </div>
      </ColOrderAssignmentHeaderTitleContainer>
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

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(
    {
      setMissionData,
      setDutyMissionData,
    },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectToStores(OrderAssignmentsList, ['missions']));
