import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';

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
      <EtsBootstrap.ModalContainer id="modal-column-assignment" show onHide={this.props.hideColumnAssignmentMissionTemplate}>
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>Прикрепление заданий к ПЛ</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBody>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
              <label>Транспортное средство</label>
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          {
            Object.values(this.props.missions).map(({ id, car_ids }) => (
              <div key={id}>
                {
                  car_ids.map((car_id, index) => (
                    <EtsBootstrap.Row key={car_id}>
                      <EtsBootstrap.Col md={6}>
                        <ExtField
                          id={`car-number-${index}`}
                          type="string"
                          value={makeCarOptionLabel(this.props.carsList.find(({ asuods_id }) => asuods_id === car_id))}
                          readOnly
                        />
                      </EtsBootstrap.Col>
                      <EtsBootstrap.Col md={6}>
                        <ExtField
                          id={`assign-to-waybill-${index}`}
                          type="select"
                          options={this.props.ASSIGN_OPTIONS}
                          value={this.props.assign_to_waybill[id][car_id]}
                          clearable={false}
                          onChange={this.handleChange}
                          boundKeys={[id, car_id]}
                        />
                      </EtsBootstrap.Col>
                    </EtsBootstrap.Row>
                  ))
                }
              </div>
            ))
          }
        </ModalBody>
        <EtsBootstrap.ModalFooter>
          {
            this.state.showBackButton && <EtsBootstrap.Button id="m-back" onClick={this.props.hideColumnAssignmentMissionTemplate}>Назад</EtsBootstrap.Button>
          }
          <EtsBootstrap.Button id="m-submit" onClick={this.handleSubmit}>Сохранить</EtsBootstrap.Button>
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  }
}

export default ColumnAssignmentMissionTemplate;
