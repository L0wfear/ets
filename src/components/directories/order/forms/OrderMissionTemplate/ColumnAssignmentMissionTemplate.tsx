import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Button from 'react-bootstrap/lib/Button';
import * as Col from 'react-bootstrap/lib/Col';
import * as Row from 'react-bootstrap/lib/Row';

import { ExtField } from 'components/ui/new/field/ExtField';

import ModalBody from 'components/ui/Modal';
import { MissionTemplate } from 'redux-main/reducers/modules/missions/mission_template/@types/index.h';
import { cloneDeep } from 'lodash';

import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const makeCarOptionLabel = (car: Car | null) => (
  car
    ? (
      `${car.gov_number} [${car.model_name || ''}${car.model_name ? '/' : ''}${car.special_model_name || ''}${car.type_name ? '/' : ''}${car.type_name || ''}]`
    )
    : (
      ''
    )
);

type ColumnAssignmentMissionTemplateProps = {
  assign_to_waybill: {
    [missionId: string]: {
      [car_id: string]: string;
    };
  };
  missions: {
    [id: string]: MissionTemplate;
  };
  hideColumnAssignmentMissionTemplate: () => void,
  ASSIGN_OPTIONS: any[],
  handleChange: (key: string, data: any) => void,
  handleSubmit: () => Promise<any>,
  carsList: Car[],
};
type ColumnAssignmentMissionTemplateState = {
  showBackButton: boolean,
};

class ColumnAssignmentMissionTemplate extends React.PureComponent<ColumnAssignmentMissionTemplateProps, ColumnAssignmentMissionTemplateState> {
  state = {
    showBackButton: false,
  };

  handleSubmit = async () => {
    try {
      await this.props.handleSubmit();
      this.props.hideColumnAssignmentMissionTemplate();
    } catch (e) {
      console.log(e); // tslint:disable-line:no-console
      this.setState({ showBackButton: true });
    }
  }

  handleChange = (index, car_id, value) => {
    const assign_to_waybill = cloneDeep(this.props.assign_to_waybill);

    assign_to_waybill[index][car_id] = value;
    this.props.handleChange('assign_to_waybill', assign_to_waybill);
  }

  render() {
    return (
      <Modal id="modal-column-assignment" show onHide={this.props.hideColumnAssignmentMissionTemplate}>
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
            Object.values(this.props.missions).map(({ id, car_ids }) => (
              <div key={id}>
                {
                  car_ids.map((car_id, index) => (
                    <Row key={car_id}>
                      <Col md={6}>
                        <ExtField
                          id={`car-number-${index}`}
                          type="string"
                          value={makeCarOptionLabel(this.props.carsList.find(({ asuods_id }) => asuods_id === car_id))}
                          readOnly
                        />
                      </Col>
                      <Col md={6}>
                        <ExtField
                          id={`assign-to-waybill-${index}`}
                          type="select"
                          options={this.props.ASSIGN_OPTIONS}
                          value={this.props.assign_to_waybill[id][car_id]}
                          clearable={false}
                          onChange={this.handleChange}
                          boundKeys={[id, car_id]}
                        />
                      </Col>
                    </Row>
                  ))
                }
              </div>
            ))
          }
        </ModalBody>
        <Modal.Footer>
          <div className="pr-object-data">
            <div>
            {
              this.state.showBackButton && <Button id="m-back" onClick={this.props.hideColumnAssignmentMissionTemplate}>Назад</Button>
            }
            </div>
            <Button id="m-submit" onClick={this.handleSubmit}>Сохранить</Button>
          </div>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ColumnAssignmentMissionTemplate;
