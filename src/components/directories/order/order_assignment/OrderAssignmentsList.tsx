import * as React from 'react';
import { Row, Col, Button as BootstrapButton } from 'react-bootstrap';

import enhanceWithPermissions from 'components/util/RequirePermissions.jsx';

import OrderAssignmentsInfoTable from 'components/directories/order/order_assignment/OrderAssignmentsInfoTable';
import OrderInfoTable from 'components/directories/order/order_assignment/OrderInfoTable';

const Button = enhanceWithPermissions(BootstrapButton);

class OrderAssignmentsList extends React.Component<any, any> {
  render() {
    const {
      seleted = null,
      dataSource: {
        technical_operations: data = [],
        order_info,
      },
    } = this.props;

    return (
      <Row>
        <Col md={8} className="flex-space-beetwen">
          <h4 style={{ marginLeft: 20, fontWeight: 'bold' }}>Расшифровка централизованного задания</h4>
          <div className="flex-button-group">
            <Button permissions={['mission.create']} onClick={this.props.handleClickOnCM} disabled={this.props.checkDisabledCM()}>Создать задание</Button>
            <Button permissions={['duty_mission.create']} onClick={this.props.handleClickOnCDM} disabled={this.props.checkDisabledCDM()}>Создать наряд-задание</Button>
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
    );
  }
}

export default OrderAssignmentsList;
