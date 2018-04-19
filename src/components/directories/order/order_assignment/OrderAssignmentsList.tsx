import * as React from 'react';
import { Row, Col, Button as BootstrapButton } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  setSelectedElementAssignment,
  setMissionData,
  setDutyMissionData,
} from 'redux/modules/order/action-order';
import Div from 'components/ui/Div.jsx';
import connectToStores from 'flummox/connect';

import enhanceWithPermissions from 'components/util/RequirePermissions.jsx';

import OrderAssignmentsInfoTable from 'components/directories/order/order_assignment/OrderAssignmentsInfoTable';
import OrderInfoTable from 'components/directories/order/order_assignment/OrderInfoTable';

const Button = enhanceWithPermissions(BootstrapButton);

class OrderAssignmentsList extends React.Component<any, any> {
  handleClickOnCM = () => this.props.setMissionData({ mission_source_id: (this.props.missionSourcesList.find(({ auto }) => auto) || {}).id })
  handleClickOnCDM = () => this.props.setDutyMissionData({ mission_source_id: (this.props.missionSourcesList.find(({ auto }) => auto) || {}).id })
  
  render() {
    const {
      seleted = null,
      dataSource,
    } = this.props;

    const {
      technical_operations: data = [],
      order_info = [],
    } = dataSource || {};

    return (
      <Div hidden={this.props.hidden} >
        <Row>
          <Col md={8} className="flex-space-beetwen">
            <h4 style={{ marginLeft: 20, fontWeight: 'bold' }}>Расшифровка централизованного задания</h4>
            <div className="flex-button-group">
              <Button permissions={['mission.create']} onClick={this.handleClickOnCM} disabled={this.props.disabledAssignmentButtonMission}>Создать задание</Button>
              <Button permissions={['duty_mission.create']} onClick={this.handleClickOnCDM} disabled={this.props.disabledAssignmentButtonDutyMission}>Создать наряд-задание</Button>
          </div>
          </Col>
          <Col md={8}>
            <OrderAssignmentsInfoTable
              noHeader
              preventNoDataMessage
              selected={seleted}
              selectField={'order_operation_id'}
              onRowSelected={this.props.onRowSelectedAssignment}
              data={data}
            />
          </Col>
          <Col md={4}>
            <OrderInfoTable
              noHeader
              preventNoDataMessage
              data={[{ id: 0, order_info }]}
            />
          </Col>
        </Row>
      </Div>
    );
  }
}

const mapStateToProps = (state) => ({
  hidden: !state.order.selectedElementOrder,
  seleted: state.order.selectedElementAssignment,
  dataSource: state.order.selectedElementOrder,
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
  onRowSelectedAssignment: ({ props: { data: selectedElementAssignment } }) => dispatch(setSelectedElementAssignment(selectedElementAssignment)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectToStores(OrderAssignmentsList, ['missions']));
