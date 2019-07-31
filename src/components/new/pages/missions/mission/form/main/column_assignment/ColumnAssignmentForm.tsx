import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import FieldAssignToWaybillMissionWithCarId from './inside_fields/assign_to_waybill/FieldAssignToWaybillMissionWithCarId';
import { PropsColumnAssignmentForm } from './@types/index.h';
import { DivNone } from 'global-styled/global-styled';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';

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
      <EtsBootstrap.ModalContainer
        id="modal-column-assignment"
        show
        onHide={this.props.hideColumnAssignment}
      >
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>Прикрепление заданий к ПЛ</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBodyPreloader page={this.props.page} path={this.props.path} typePreloader="mainpage">
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
              <label>Транспортное средство</label>
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
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
        </ModalBodyPreloader>
        <EtsBootstrap.ModalFooter>
          {
            this.state.showBackButton
              ? (
                <div>
                  <EtsBootstrap.Button id="m-back" onClick={this.props.hideColumnAssignment}>
                    Назад
                  </EtsBootstrap.Button>
                </div>
              )
              : (
                <DivNone />
              )
          }
          <EtsBootstrap.Button id="m-submit" onClick={this.handleSubmit}>
            Сохранить
          </EtsBootstrap.Button>
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  }
}

export default ColumnAssignmentForm;
