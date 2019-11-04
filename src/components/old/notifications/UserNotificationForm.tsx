import * as React from 'react';
import { connect } from 'react-redux';
import * as queryString from 'query-string';
import { get } from 'lodash';
import { bindActionCreators } from 'redux';

import { withRequirePermission } from 'components/@next/@common/hoc/require_permission/withRequirePermission';

import ModalBody from 'components/old/ui/Modal';
import UNSAFE_Form from 'components/old/compositions/UNSAFE_Form';

import employeePermissions from 'components/new/pages/nsi/employee/_config-data/permissions';

import carActualListConfig from 'components/new/pages/nsi/autobase/pages/car_actual/_config-data';
import employeeListConfig from 'components/new/pages/nsi/employee/_config-data';

import {
  insurancePolicy,
  techInspection,
  techMaintenance,
  repair as repairTabData,
} from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/formConfig';
import carActualPermissions from 'components/new/pages/nsi/autobase/pages/car_actual/_config-data/permissions';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { makeReactMessage } from 'utils/helpMessangeWarning';
import { makeDateFormated } from 'components/@next/@utils/dates/dates';
import { getSessionCompanyIndex } from 'redux-main/reducers/modules/session/selectors';
import { actionsGetCarByAsuodsId as actionsGetCarByAsuodsIdOr } from 'redux-main/reducers/modules/autobase/car/actions';
import { getErrorNotification } from 'utils/notifications';
import { ReduxState } from 'redux-main/@types/state';

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

const MainVehicleDesc = ({
  linkText,
  textInfo,
  handleClick,
  car_id,
  companyIndex,
  actionsGetCarByAsuodsId,
}) => {
  const handleLinkToCarFormWithPermittedByCompany = React.useCallback(async () => {
    let isPermitted = false;

    if (car_id) {
      try {
        const carData = await actionsGetCarByAsuodsId(car_id, {});
        const company_id = get(carData, 'company_id');
        if (company_id && company_id in companyIndex) {
          isPermitted = true;
        } else {
          global.NOTIFICATION_SYSTEM.notify(
            getErrorNotification(
              'Операция запрещена. ТС перенесено в другую организацию',
            ),
          );
        }
      } catch {
        //
      }
    }

    if (isPermitted) {
      handleClick();
    }
  }, [car_id, actionsGetCarByAsuodsId, companyIndex, handleClick]);
  return (
    <div>
      <b>Совет:</b> пройдите по ссылке ниже, чтобы посмотреть карточку ТС и
      добавить информацию <span>{textInfo}</span> прямо сейчас
      <LinkA
        linkText={linkText}
        handleClick={handleLinkToCarFormWithPermittedByCompany}
      />
    </div>
  );
};

const MainEmployeeDesc = ({ linkText, handleClick }) => (
  <div>
    <b>Совет:</b> пройдите по ссылке ниже, чтобы посмотреть карточку водителя и
    добавить информацию по медицинской справке прямо сейчас
    <LinkA linkText={linkText} handleClick={handleClick} />
  </div>
);

const insurance_policy = withRequirePermission({
  withIsPermittedProps: true,
  permissions: carActualPermissions.list,
})(
  ({
    gov_number,
    car_id,
    handleClick,
    companyIndex,
    actionsGetCarByAsuodsId,
    isPermitted,
  }: any) => (
    <MainVehicleDesc
      linkText={gov_number}
      car_id={car_id}
      companyIndex={companyIndex}
      actionsGetCarByAsuodsId={actionsGetCarByAsuodsId}
      textInfo="по страхованию"
      handleClick={() =>
        handleClick(
          `${carActualListConfig.path}/${car_id}/${insurancePolicy.tabKey}`,
          {},
          isPermitted,
        )
      }
    />
  ),
);

const tech_inspection = withRequirePermission({
  withIsPermittedProps: true,
  permissions: carActualPermissions.list,
})(
  ({
    car_gov_number,
    car_id,
    handleClick,
    companyIndex,
    actionsGetCarByAsuodsId,
    isPermitted,
  }: any) => {
    return (
      <MainVehicleDesc
        linkText={car_gov_number}
        car_id={car_id}
        companyIndex={companyIndex}
        actionsGetCarByAsuodsId={actionsGetCarByAsuodsId}
        textInfo="о государственном техосмотре"
        handleClick={() =>
          handleClick(
            `${carActualListConfig.path}/${car_id}/${techInspection.tabKey}`,
            {},
            isPermitted,
          )
        }
      />
    );
  },
);

const tech_maintenance = withRequirePermission({
  withIsPermittedProps: true,
  permissions: carActualPermissions.list,
})(
  ({
    gov_number,
    car_id,
    handleClick,
    companyIndex,
    actionsGetCarByAsuodsId,
    isPermitted,
  }: any) => (
    <MainVehicleDesc
      linkText={gov_number}
      car_id={car_id}
      companyIndex={companyIndex}
      actionsGetCarByAsuodsId={actionsGetCarByAsuodsId}
      textInfo="о техническом обслуживании"
      handleClick={() =>
        handleClick(
          `${carActualListConfig.path}/${car_id}/${techMaintenance.tabKey}`,
          {},
          isPermitted,
        )
      }
    />
  ),
);

const repair = withRequirePermission({
  withIsPermittedProps: true,
  permissions: carActualPermissions.list,
})(
  ({
    gov_number,
    car_id,
    handleClick,
    companyIndex,
    actionsGetCarByAsuodsId,
    isPermitted,
  }: any) => (
    <MainVehicleDesc
      linkText={gov_number}
      car_id={car_id}
      companyIndex={companyIndex}
      actionsGetCarByAsuodsId={actionsGetCarByAsuodsId}
      textInfo="о ремонте"
      handleClick={() =>
        handleClick(
          `${carActualListConfig.path}/${car_id}/${repairTabData.tabKey}`,
          {},
          isPermitted,
        )
      }
    />
  ),
);

const medical_certificate = withRequirePermission({
  withIsPermittedProps: true,
  permissions: employeePermissions.list,
})(({ employee_fio, employee_id, handleClick, isPermitted }: any) => (
  <MainEmployeeDesc
    linkText={employee_fio}
    handleClick={() =>
      handleClick(`${employeeListConfig.path}/${employee_id}`, {}, isPermitted)
    }
  />
));

const notificationComponents = {
  insurance_policy,
  tech_inspection,
  tech_maintenance,
  repair,
  medical_certificate,
};
class UserNotificationForm extends UNSAFE_Form<any, any> {
  handleClick = (pathComponent, query, isPermitted) => {
    if (isPermitted) {
      this.props.history.push(
        `${pathComponent}?${queryString.stringify(query)}`,
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
        car_gov_number: state.data.car_gov_number,
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

    console.warn('addTypeDate in userNotificationForm'); // tslint:disable-line:no-console
    return {};
  }

  render() {
    const state = this.props.formState;
    const NotificationDesc = notificationComponents[state.type_code] || 'div';
    const otherProps: any = {};
    if (NotificationDesc !== 'div') {
      otherProps.handleClick = this.handleClick;
    }

    return (
      <EtsBootstrap.ModalContainer
        id="user_notification_form"
        show={this.props.show}
        onHide={this.props.onHide}>
        <EtsBootstrap.ModalHeader closeButton>
          <div style={{ fontWeight: 'bold' }}>
            <span>{state.title}</span>
            <span
              style={{ marginRight: 10, marginLeft: 4 }}
              className="pull-right">
              {makeDateFormated(state.created_at)}
            </span>
          </div>
        </EtsBootstrap.ModalHeader>
        <ModalBody>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
              {makeReactMessage(state.description || '')}
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={12} style={{ marginTop: 10 }}>
              <NotificationDesc
                {...this.getDataForUserNotification(state.type_code, state)}
                {...otherProps}
                companyIndex={this.props.companyIndex}
                actionsGetCarByAsuodsId={this.props.actionsGetCarByAsuodsId}
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
        </ModalBody>
        <EtsBootstrap.ModalFooter />
      </EtsBootstrap.ModalContainer>
    );
  }
}

type OwnProps = {
  [k: string]: any;
};

export default connect<any, any, OwnProps, ReduxState>(
  (state) => ({
    companyIndex: getSessionCompanyIndex(state),
  }),
  (dispatch) => ({
    actionsGetCarByAsuodsId: bindActionCreators(
      actionsGetCarByAsuodsIdOr,
      dispatch,
    ),
  }),
)(UserNotificationForm);
