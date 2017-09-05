import React from 'react';
import { Modal, Row, Col } from 'react-bootstrap';

import ModalBody from 'components/ui/Modal';
import { connectToStores } from 'utils/decorators';
import DateFormatter from 'components/ui/DateFormatter.jsx';
import Form from 'components/compositions/Form.jsx';
import { CAR_TAB_INDEX } from 'components/directories/cars/CarForm';

const LinkA = ({ linkText, handleClick }) =>
  <a style={{ marginLeft: 5, cursor: 'pointer' }} onClick={handleClick}>{linkText}</a>;

const MainVehicleDesc = ({ linkText, textInfo, handleClick }) =>
  <div>
    <b>Совет:</b> пройдите по ссылке ниже,
    чтобы посмотреть карточку ТС и добавить информацию <span>{textInfo}</span> прямо сейчас
    <LinkA
      linkText={linkText}
      handleClick={handleClick}
    />
  </div>;

const MainEmployeeDesc = ({ linkText, handleClick }) =>
  <div>
    <b>Совет:</b> пройдите по ссылке ниже,
    чтобы посмотреть карточку водителя и добавить информацию по медицинской справке прямо сейчас
    <LinkA
      linkText={linkText}
      handleClick={handleClick}
    />
  </div>;

const insurance_policy = ({ data: { car_gov_number, car_id }, handleClick }) =>
  <MainVehicleDesc
    linkText={car_gov_number}
    textInfo="по страхованию"
    handleClick={() => handleClick('cars', {
      asuods_id: car_id,
      active_tab: CAR_TAB_INDEX.insurance_policy,
    })}
  />;

const tech_inspection = ({ data: { tech_inspection_reg_number, car_id }, handleClick }) =>
  <MainVehicleDesc
    linkText={tech_inspection_reg_number}
    textInfo="о государственном техосмотре"
    handleClick={() => handleClick('cars', {
      asuods_id: car_id,
      active_tab: CAR_TAB_INDEX.tech_inspection,
    })}
  />;

const tech_maintenance = ({ data: { car_gov_number, car_id }, handleClick }) =>
  <MainVehicleDesc
    linkText={car_gov_number}
    textInfo="о техническом обслуживании"
    handleClick={() => handleClick('cars', {
      asuods_id: car_id,
      active_tab: CAR_TAB_INDEX.tech_inspection,
    })}
  />;

const repair = ({ data: { car_gov_number, car_id }, handleClick }) =>
  <MainVehicleDesc
    linkText={car_gov_number}
    textInfo="о ремонте"
    handleClick={() => handleClick('cars', {
      asuods_id: car_id,
      active_tab: CAR_TAB_INDEX.tech_inspection,
    })}
  />;

const medical_certificate = ({ data: { employee_fio, employee_id }, handleClick }) =>
  <MainEmployeeDesc
    linkText={employee_fio}
    handleClick={() => handleClick('employees', {
      employee_id,
    })}
  />;

const notificationComponents = {
  insurance_policy,
  tech_inspection,
  tech_maintenance,
  repair,
  medical_certificate,
};

@connectToStores(['userNotifications'])
export default class UserNotificationForm extends Form {
  componentDidMount() {
    const state = this.props.formState;

    if (!state.is_read) {
      this.context.flux.getActions('userNotifications').markAsRead([state.id], false);
    }
  }
  handleClick = (pathComponent, query) => {
    this.props.history.replaceState(null, `/${pathComponent}`, query);
  }
  render() {
    const state = this.props.formState;
    const NotificationDesc = notificationComponents[state.type_code] || 'div';

    return (
      <Modal {...this.props} backdrop="static">
        <Modal.Header closeButton>
          <div style={{ fontWeight: 'bold' }}>
            <span>{state.title}</span>
            <span style={{ marginRight: 10 }} className="pull-right">
              <DateFormatter date={state.created_at} />
            </span>
          </div>
        </Modal.Header>
        <ModalBody>
          <Row>
            <Col md={12}>
              {state.description}
            </Col>
            <Col md={12} style={{ marginTop: 10 }}>
              <NotificationDesc
                data={state.data}
                handleClick={this.handleClick}
              />
            </Col>
          </Row>
        </ModalBody>
        <Modal.Footer>

        </Modal.Footer>
      </Modal>
    );
  }
}
