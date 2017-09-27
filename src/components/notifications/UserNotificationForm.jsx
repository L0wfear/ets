import React from 'react';
import { Modal, Row, Col } from 'react-bootstrap';

import ModalBody from 'components/ui/Modal';
import { connectToStores } from 'utils/decorators';
import DateFormatter from 'components/ui/DateFormatter.jsx';
import Form from 'components/compositions/Form.jsx';
import { CAR_TAB_INDEX } from 'components/directories/cars/CarForm';

const TYPE_CODE = {
  carITR: [
    'insurance_policy',
    'tech_maintenance',
    'repair',
  ],
  carT: [ 'tech_inspection' ],
  med: ['medical_certificate'],
};

const LinkA = ({ linkText, handleClick }) =>
  <a style={{ marginLeft: 5, cursor: 'pointer' }} onClick={handleClick}>{linkText || 'перейти'}</a>;

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

const insurance_policy = ({ gov_number, car_id, handleClick }) =>
  <MainVehicleDesc
    linkText={gov_number}
    textInfo="по страхованию"
    handleClick={() => handleClick('cars', {
      asuods_id: car_id,
      active_tab: CAR_TAB_INDEX.insurance_policy,
    })}
  />;

const tech_inspection = ({ tech_inspection_reg_number, car_id, handleClick }) =>
  <MainVehicleDesc
    linkText={tech_inspection_reg_number}
    textInfo="о государственном техосмотре"
    handleClick={() => handleClick('cars', {
      asuods_id: car_id,
      active_tab: CAR_TAB_INDEX.tech_inspection,
    })}
  />;

const tech_maintenance = ({ gov_number, car_id, handleClick }) =>
  <MainVehicleDesc
    linkText={gov_number}
    textInfo="о техническом обслуживании"
    handleClick={() => handleClick('cars', {
      asuods_id: car_id,
      active_tab: CAR_TAB_INDEX.tech_inspection,
    })}
  />;

const repair = ({ gov_number, car_id, handleClick }) =>
  <MainVehicleDesc
    linkText={gov_number}
    textInfo="о ремонте"
    handleClick={() => handleClick('cars', {
      asuods_id: car_id,
      active_tab: CAR_TAB_INDEX.tech_inspection,
    })}
  />;

const medical_certificate = ({ employee_fio, employee_id, handleClick }) =>
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
      this.context.flux.getActions('userNotifications').markAsRead(
        'dec',
        [state.id],
        false,
      );
    }
  }
  handleClick = (pathComponent, query) => {
    this.props.history.replaceState(null, `/${pathComponent}`, query);
  }
  getDataForUserNotification(type, state) {
    if (TYPE_CODE.carITR.includes(type)) {
      return {
        gov_number: state.gov_number,
        car_id: state.data.car_id,
      };
    }
    if (TYPE_CODE.carT.includes(type)) {
      return {
        tech_inspection_reg_number: state.data.tech_inspection_reg_number,
        car_id: state.data.car_id,
      };
    }
    if (TYPE_CODE.med.includes(type)) {
      return {
        employee_fio: state.data.employee_fio,
        employee_id: state.data.employee_id,
      }
    }
    console.warn('addTypeDate in userNotificationForm');
    return {};
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
                {...this.getDataForUserNotification(state.type_code, state)}
                handleClick={this.handleClick}
              />
            </Col>
          </Row>
        </ModalBody>
        <Modal.Footer />
      </Modal>
    );
  }
}
