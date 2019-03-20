import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Button from 'react-bootstrap/lib/Button';
import * as Col from 'react-bootstrap/lib/Col';
import * as Row from 'react-bootstrap/lib/Row';
import { get } from 'lodash';

import { ExtField } from 'components/ui/new/field/ExtField';

import ModalBody from 'components/ui/Modal';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { makeCarOptionLabel } from './utils';
import EtsModal from 'components/new/ui/modal/Modal';

type ColumnAssignmentProps = {
  formState: any;
  hideColumnAssignment: () => void;
  ASSIGN_OPTIONS: any[];
  handleChange: (key: string, data: any) => void;
  handleSubmit: () => Promise<any>;
  carsList: Car[];
  show: boolean;
  deepLvl: number;
};
type ColumnAssignmentState = {
  showBackButton: boolean;
};

class ColumnAssignment extends React.Component<
  ColumnAssignmentProps,
  ColumnAssignmentState
> {
  state = {
    showBackButton: false,
  };

  handleSubmit = async () => {
    try {
      await this.props.handleSubmit();
    } catch (e) {
      this.setState({ showBackButton: true });
    }
  };

  handleChange = (index, value) => {
    const {
      formState: {
        assign_to_waybill: [...assign_to_waybill],
      },
    } = this.props;
    assign_to_waybill[index] = value;

    this.props.handleChange('assign_to_waybill', assign_to_waybill);
  };

  render() {
    if (!this.props.show) {
      return null;
    }

    const car_ids = get(this.props.formState, 'car_id', []);

    return (
      <EtsModal
        id="modal-column-assignment"
        show
        deepLvl={this.props.deepLvl}
        onHide={this.props.hideColumnAssignment}>
        <Modal.Header closeButton>
          <Modal.Title>Прикрепление заданий к ПЛ</Modal.Title>
        </Modal.Header>
        <ModalBody>
          <Row>
            <Col md={12}>
              <label>Транспортное средство</label>
            </Col>
          </Row>
          {car_ids.map((car_id, index) => (
            <Row key={car_id}>
              <Col md={6}>
                <ExtField
                  id={`car-number-${index}`}
                  type="string"
                  value={makeCarOptionLabel(
                    this.props.carsList.find(
                      ({ asuods_id }) => asuods_id === car_id,
                    ),
                  )}
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
                  boundKeys={index}
                />
              </Col>
            </Row>
          ))}
        </ModalBody>
        <Modal.Footer>
          <div className="pr-object-data">
            <div>
              {this.state.showBackButton && (
                <Button id="m-back" onClick={this.props.hideColumnAssignment}>
                  Назад
                </Button>
              )}
            </div>
            <Button id="m-submit" onClick={this.handleSubmit}>
              Сохранить
            </Button>
          </div>
        </Modal.Footer>
      </EtsModal>
    );
  }
}

export default ColumnAssignment;
