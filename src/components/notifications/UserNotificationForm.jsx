import React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';

import * as queryString from 'query-string';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';

import ModalBody from 'components/ui/Modal';
import DateFormatter from 'components/ui/DateFormatter';
import Form from 'components/compositions/Form';
import { CAR_TAB_INDEX } from 'components/directories/autobase/cars/CarForm';

import carPermissions from 'components/directories/autobase/cars/config-data/permissions';
import employeePermissions from 'components/directories/employees/config-data/permissions';
import { connect } from 'react-redux';
import { getUserNotificationsState } from 'redux-main/reducers/selectors';

const TYPE_CODE = {
  carITR: ['insurance_policy', 'tech_maintenance', 'repair'],
  carT: ['tech_inspection'],
  med: ['medical_certificate'],
};

const LinkA = ({ linkText, handleClick }) => (
  <a style={{ marginLeft: 5, cursor: 'pointer' }} onClick={handleClick}>
    {linkText || 'перейти'}
  </a>
);

const MainVehicleDesc = ({ linkText, textInfo, handleClick }) => (
  <div>
    <b>Совет:</b> пройдите по ссылке ниже, чтобы посмотреть карточку ТС и
    добавить информацию <span>{textInfo}</span> прямо сейчас
    <LinkA linkText={linkText} handleClick={handleClick} />
  </div>
);

const MainEmployeeDesc = ({ linkText, handleClick }) => (
  <div>
    <b>Совет:</b> пройдите по ссылке ниже, чтобы посмотреть карточку водителя и
    добавить информацию по медицинской справке прямо сейчас
    <LinkA linkText={linkText} handleClick={handleClick} />
  </div>
);

const insurance_policy = withRequirePermissionsNew({
  withIsPermittedProps: true,
  permissions: carPermissions.list,
})(({ gov_number, car_id, handleClick, isPermitted }) => (
  <MainVehicleDesc
    linkText={gov_number}
    textInfo="по страхованию"
    handleClick={() =>
      handleClick(
        'cars',
        {
          asuods_id: car_id,
          active_tab: CAR_TAB_INDEX.insurance_policy,
        },
        isPermitted,
      )
    }
  />
));

const tech_inspection = withRequirePermissionsNew({
  withIsPermittedProps: true,
  permissions: carPermissions.list,
})(({ tech_inspection_reg_number, car_id, handleClick, isPermitted }) => (
  <MainVehicleDesc
    linkText={tech_inspection_reg_number}
    textInfo="о государственном техосмотре"
    handleClick={() =>
      handleClick(
        'cars',
        {
          asuods_id: car_id,
          active_tab: CAR_TAB_INDEX.tech_inspection,
        },
        isPermitted,
      )
    }
  />
));

const tech_maintenance = withRequirePermissionsNew({
  withIsPermittedProps: true,
  permissions: carPermissions.list,
})(({ gov_number, car_id, handleClick, isPermitted }) => (
  <MainVehicleDesc
    linkText={gov_number}
    textInfo="о техническом обслуживании"
    handleClick={() =>
      handleClick(
        'cars',
        {
          asuods_id: car_id,
          active_tab: CAR_TAB_INDEX.tech_inspection,
        },
        isPermitted,
      )
    }
  />
));

const repair = withRequirePermissionsNew({
  withIsPermittedProps: true,
  permissions: carPermissions.list,
})(({ gov_number, car_id, handleClick, isPermitted }) => (
  <MainVehicleDesc
    linkText={gov_number}
    textInfo="о ремонте"
    handleClick={() =>
      handleClick(
        'cars',
        {
          asuods_id: car_id,
          active_tab: CAR_TAB_INDEX.tech_inspection,
        },
        isPermitted,
      )
    }
  />
));

const medical_certificate = withRequirePermissionsNew({
  withIsPermittedProps: true,
  permissions: employeePermissions.list,
})(({ employee_fio, employee_id, handleClick, isPermitted }) => (
  <MainEmployeeDesc
    linkText={employee_fio}
    handleClick={() => handleClick(`employees/${employee_id}`, {}, isPermitted)}
  />
));

const notificationComponents = {
  insurance_policy,
  tech_inspection,
  tech_maintenance,
  repair,
  medical_certificate,
};
class UserNotificationForm extends Form {
  handleClick = (pathComponent, query, isPermitted) => {
    if (isPermitted) {
      this.props.history.push(
        `/${pathComponent}?${queryString.stringify(query)}`,
      );
    } else {
      global.NOTIFICATION_SYSTEM.notify(
        'У вас нет прав для просмотра этой страницы',
        'warning',
        'tr',
      );
    }
  };

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
      };
    }
    if (type === 'order') {
      return {};
    }
    if (type === 'administrator') {
      return {};
    }

    if (type === 'manual_update') {
      return {};
    }

    console.warn('addTypeDate in userNotificationForm'); // eslint-disable-line
    return {};
  }

  render() {
    const state = this.props.formState;
    const NotificationDesc = notificationComponents[state.type_code] || 'div';
    const otherProps = {};
    if (NotificationDesc !== 'div') {
      otherProps.handleClick = this.handleClick;
    }

    return (
      <Modal
        show={this.props.show}
        onHide={this.props.onHide}
        backdrop="static">
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
            <Col md={12}>{state.description}</Col>
            <Col md={12} style={{ marginTop: 10 }}>
              <NotificationDesc
                {...this.getDataForUserNotification(state.type_code, state)}
                {...otherProps}
              />
            </Col>
          </Row>
        </ModalBody>
        <Modal.Footer />
      </Modal>
    );
  }
}

export default connect(getUserNotificationsState)(UserNotificationForm);
