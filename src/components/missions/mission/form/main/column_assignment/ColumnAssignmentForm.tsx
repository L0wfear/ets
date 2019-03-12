import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Button from 'react-bootstrap/lib/Button';
import * as Col from 'react-bootstrap/lib/Col';
import * as Row from 'react-bootstrap/lib/Row';

import ModalBody from 'components/ui/Modal';
import EtsModal from 'components/new/ui/modal/Modal';
import FieldAssignToWaybillMissionWithCarId from './inside_fields/assign_to_waybill/FieldAssignToWaybillMissionWithCarId';
import { PropsColumnAssignmentForm } from './@types/index.h';
import { DivNone } from 'global-styled/global-styled';

class ColumnAssignmentForm extends React.PureComponent<PropsColumnAssignmentForm, { showBackButton: boolean }> {
  state = {
    showBackButton: false,
  };
  handleSubmit = async () => {
    const response = await this.props.handleSubmit();
    if (!response) {
      this.setState({ showBackButton: true });
    }
  }
  handleChange = (index, value) => {
    this.props.handleChangeAssignToWaybill(
      this.props.assign_to_waybill.map((assign_to_waybill, assign_to_waybill_index) => {
        if (assign_to_waybill_index === index) {
          return value;
        }

        return assign_to_waybill;
      }),
    );
  }

  render() {
    return (
      <EtsModal
        id="modal-column-assignment"
        show
        onHide={this.props.hideColumnAssignment}
      >
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
            this.props.car_ids.map((car_id, index) => (
              <FieldAssignToWaybillMissionWithCarId
                key={car_id}
                car_id={car_id}
                index={index}
                value={this.props.assign_to_waybill[index]}
                onChange={this.handleChange}

                page={this.props.page}
              />
            ))
          }
        </ModalBody>
        <Modal.Footer>
          <div className="pr-object-data">
            {
              this.state.showBackButton
                ? (
                  <div>
                    <Button id="m-back" onClick={this.props.hideColumnAssignment}>
                      Назад
                    </Button>
                  </div>
                )
                : (
                  <DivNone />
                )
            }
            <Button id="m-submit" onClick={this.handleSubmit}>
              Сохранить
            </Button>
          </div>
        </Modal.Footer>
      </EtsModal>
    );
  }
}

export default ColumnAssignmentForm;
