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
import permissions_mission from 'components/missions/mission/config-data/permissions';
import permissions_duty_mission from 'components/missions/duty_mission/config-data/permissions';

import OrderAssignmentsInfoTable from 'components/directories/order/order_assignment/OrderAssignmentsInfoTable';
import OrderInfoTable from 'components/directories/order/order_assignment/OrderInfoTable';

import {
  ColOrderAssignmentHeaderTitleContainer,
  ButtonOrderAssignment,
  TitleText,
} from 'components/directories/order/order_assignment/styled/styled';

const OrderAssignmentsList: React.SFC<any> = (props) => (
  <Div className="data-table data-other" hidden={props.hidden} >
    <Row>
      <ColOrderAssignmentHeaderTitleContainer md={8}>
        <TitleText>Расшифровка централизованного задания</TitleText>
        <div>
          <ButtonOrderAssignment permission={permissions_mission.create} onClick={props.handleClickOnCM} disabled={props.disabledAssignmentButtonMission}>Создать задание</ButtonOrderAssignment>
          <ButtonOrderAssignment permission={permissions_duty_mission.create} onClick={props.handleClickOnCDM} disabled={props.disabledAssignmentButtonDutyMission}>Создать наряд-задание</ButtonOrderAssignment>
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
