import * as React from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';

import ModalBody from 'components/ui/Modal';

type ColumnAssignmentProps = {

};
type ColumnAssignmentState = {
  modalVisibility: boolean;
};

class ColumnAssignment extends React.PureComponent<ColumnAssignmentProps, ColumnAssignmentState> {
  state: ColumnAssignmentState = {
    modalVisibility: false,
  };

  handleModalClose = () => {
  }
  render() {
    return (
      <Modal onHide={this.handleModalClose}>
        <ModalBody>
          <Row>
            <Col>
              <Button>123</Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    );
  }
}

export default ColumnAssignment;
