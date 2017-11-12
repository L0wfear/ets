import * as React from 'react';
import { Row, Col } from 'react-bootstrap';

import OrderAssignmentsInfoTable from 'components/directories/order/order_assignment/OrderAssignmentsInfoTable';
import OrderInfoTable from 'components/directories/order/order_assignment/OrderInfoTable';

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
        <h4 style={{ marginLeft: 20, fontWeight: 'bold' }}>Расшифровка централизованного задания</h4>
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
