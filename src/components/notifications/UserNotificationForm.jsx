import React from 'react';
import { Modal, Row, Col } from 'react-bootstrap';

import ModalBody from 'components/ui/Modal';
import { connectToStores } from 'utils/decorators';
import DateFormatter from 'components/ui/DateFormatter.jsx';
import Form from 'components/compositions/Form.jsx';
import { CAR_TAB_INDEX } from 'components/directories/cars/CarForm';

const MainVehicleDesc = ({ carId, linkText, activeTab, textInfo }) =>
  <div>
    <b>Совет:</b> пройдите по ссылке ниже,
    чтобы посмотреть карточку ТС и добавить информацию <span>{textInfo}</span> прямо сейчас
    <a style={{ marginLeft: 5 }} href={`/#/cars?asuods_id=${carId}&active_tab=${activeTab}`}>{linkText}</a>
  </div>;

const insurance_policy = ({ data: { car_gov_number, car_id } }) =>
  <MainVehicleDesc
    carId={car_id}
    linkText={car_gov_number}
    activeTab={CAR_TAB_INDEX.insurance_policy}
    textInfo="по страхованию"
  />;

const tech_inspection = ({ data: { tech_inspection_reg_number, car_id } }) =>
  <MainVehicleDesc
    carId={car_id}
    linkText={tech_inspection_reg_number}
    activeTab={CAR_TAB_INDEX.tech_inspection}
    textInfo="о государственном техосмотре"
  />;

const tech_maintenance = ({ data: { car_gov_number, car_id } }) =>
  <MainVehicleDesc
    carId={car_id}
    linkText={car_gov_number}
    activeTab={CAR_TAB_INDEX.tech_maintenance}
    textInfo="о техническом обслуживании"
  />;

const repair = ({ data: { car_gov_number, car_id } }) =>
  <MainVehicleDesc
    carId={car_id}
    linkText={car_gov_number}
    activeTab={CAR_TAB_INDEX.repair}
    textInfo="о ремонте"
  />;

const medical_certificate = ({ data: { employee_fio, employee_id } }) =>
  <div>
    <b>Совет:</b> пройдите по ссылке ниже,
    чтобы посмотреть карточку водителя и добавить информацию по медицинской справке прямо сейчас
    <a style={{ marginLeft: 5 }} href={`/#/employees?employee_id=${employee_id}`}>{employee_fio}</a>
  </div>;


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
              <NotificationDesc data={state.data} />
            </Col>
          </Row>
        </ModalBody>
        <Modal.Footer>

        </Modal.Footer>
      </Modal>
    );
  }
}
