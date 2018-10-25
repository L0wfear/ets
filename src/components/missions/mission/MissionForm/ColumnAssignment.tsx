import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Button from 'react-bootstrap/lib/Button';
import * as Col from 'react-bootstrap/lib/Col';
import * as Row from 'react-bootstrap/lib/Row';

import { ExtField } from 'components/ui/new/field/ExtField';

import ModalBody from 'components/ui/Modal';

interface carOption {
  value: number;
  label: string;
}

type ColumnAssignmentProps = {
  formState: any,
  hideColumnAssignment: () => void,
  ASSIGN_OPTIONS: any[],
  handleChange: (key: string, data: any) => void,
  handleSubmit: () => Promise<any>,
  CARS: carOption[],
};
type ColumnAssignmentState = {
  showBackButton: boolean,
};

class ColumnAssignment extends React.PureComponent<ColumnAssignmentProps, ColumnAssignmentState> {
  state = {
    showBackButton: false,
  }
  handleSubmit = async () => {
    try {
      await this.props.handleSubmit();
    } catch (e) {
      this.setState({ showBackButton: true });
    }
  }

  handleChange = (index, value) => {
    const { formState: { assign_to_waybill: [...assign_to_waybill] } } = this.props;
    assign_to_waybill[index] = value;
    this.props.handleChange('assign_to_waybill', assign_to_waybill);
  }

  render() {
    return (
      <Modal id="modal-column-assignment" show onHide={this.props.hideColumnAssignment}>
        <Modal.Header closeButton>
          <Modal.Title>Прикрепление заданий к ПЛ</Modal.Title>
        </Modal.Header>
        <ModalBody>
          <Row>
            <Col md={12}>
              <label>Транспортное средство</label>
            </Col>
          </Row>
          {
            this.props.formState.car_id.map((car_id, index) => (
              <Row key={car_id}>
                <Col md={6}>
                  <ExtField
                    id={`car-number-${index}`}
                    type="string"
                    value={this.props.CARS.find(({ value }) => value === car_id).label}
                    readOnly
                  />
                </Col>
                <Col md={6}>
                  <ExtField
                    id={`assign-to-waybill-${index}`}
                    type="select"
                    options={this.props.ASSIGN_OPTIONS}
                    value={this.props.formState.assign_to_waybill[index]}
                    clearable={false}
                    onChange={this.handleChange}
                    boundKeys={[index]}
                  />
                </Col>
              </Row>
            ))
          }
        </ModalBody>
        <Modal.Footer>
          <div className="pr-object-data">
            <div>
            {
              this.state.showBackButton && <Button id="m-back" onClick={this.props.hideColumnAssignment}>Назад</Button>
            }
            </div>
            <Button id="m-submit" onClick={this.handleSubmit}>Сохранить</Button>
          </div>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ColumnAssignment;
