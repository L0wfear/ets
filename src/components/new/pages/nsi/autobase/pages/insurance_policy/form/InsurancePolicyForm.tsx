import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';
import * as Button from 'react-bootstrap/lib/Button';
import { ExtField } from 'components/ui/new/field/ExtField';
import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { insurancePolicyFormSchema } from 'components/new/pages/nsi/autobase/pages/insurance_policy/form/schema';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';

import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import { getDefaultInsurancePolicyElement } from 'components/new/pages/nsi/autobase/pages/insurance_policy/form/utils';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnInsurancePolicyProps,
  PropsInsurancePolicy,
  StatePropsInsurancePolicy,
  DispatchPropsInsurancePolicy,
  PropsInsurancePolicyWithForm,
} from 'components/new/pages/nsi/autobase/pages/insurance_policy/form/@types/InsurancePolicyForm';
import { InsurancePolicy } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { DivNone } from 'global-styled/global-styled';
import { FileField } from 'components/ui/input/fields';
import EtsModal from 'components/new/ui/modal/Modal';
import { get } from 'lodash';
import insurancePolicyPermissions from '../_config-data/permissions';

const InsurancePolicyForm: React.FC<PropsInsurancePolicy> = (props) => {
  const [insuranceTypeOptions, setInsuranceTypeOptions] = React.useState([]);
  const [carListOptions, setCarListOptions] = React.useState([]);
  const {
    formState: state,
    formErrors: errors,
    selectedCarData,

    page,
    path,
  } = props;
  const car_id = get(selectedCarData, 'asuods_id', null);
  const IS_CREATING = !state.id;

  const title = !IS_CREATING ? 'Изменение записи' : 'Создание записи';
  const isPermitted = (
    !IS_CREATING
      ? props.isPermittedToUpdate
      : props.isPermittedToCreate
    );

  React.useEffect(
    () => {
      props.autobaseGetInsuranceType({}, { page, path }).then(
        ({ payload: { data } }) => {
          setInsuranceTypeOptions(
            data.map(defaultSelectListMapper),
          );
        },
      );

      if (IS_CREATING && !car_id) {
        props.autobaseGetSetCar({}, { page, path }).then(
          ({ data }) => {
            setCarListOptions(
              data.map((rowData) => ({
                value: rowData.asuods_id,
                label: rowData.gov_number,
                rowData,
              })),
            );
          },
        );
      }
    },
    [],
  );

  return (
    <EtsModal
      id="modal-insurance-policy"
      show
      onHide={props.hideWithoutChanges}
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
        <Row>
          <Col md={12}>
            {IS_CREATING && !car_id && (
              <ExtField
                id="car_id"
                type="select"
                label="Номер транспортного средства"
                value={state.car_id}
                error={errors.car_id}
                options={carListOptions}
                emptyValue={null}
                onChange={props.handleChange}
                boundKeys="car_id"
                clearable={false}
                disabled={!isPermitted}
                modalKey={path}
              />
            )}
            <ExtField
              id="insurer"
              type="string"
              label="Страховая организация"
              value={state.insurer}
              error={errors.insurer}
              onChange={props.handleChange}
              boundKeys="insurer"
              disabled={!isPermitted}
              modalKey={path}
            />
            <ExtField
              id="insurance_type_id"
              type="select"
              label="Тип страхования"
              value={state.insurance_type_id}
              error={errors.insurance_type_id}
              options={insuranceTypeOptions}
              emptyValue={null}
              onChange={props.handleChange}
              boundKeys="insurance_type_id"
              clearable={false}
              disabled={!isPermitted}
              modalKey={path}
            />
            <ExtField
              id="seria"
              type="string"
              label="Серия"
              value={state.seria}
              error={errors.seria}
              onChange={props.handleChange}
              boundKeys="seria"
              disabled={!isPermitted}
              modalKey={path}
            />
            <ExtField
              id="number"
              type="string"
              label="Номер"
              value={state.number}
              error={errors.number}
              onChange={props.handleChange}
              boundKeys="number"
              disabled={!isPermitted}
              modalKey={path}
            />
            <ExtField
              id="date_start"
              type="date"
              label="Дата начала действия"
              date={state.date_start}
              time={false}
              error={errors.date_start}
              onChange={props.handleChange}
              boundKeys="date_start"
              disabled={!isPermitted}
              modalKey={path}
            />
            <ExtField
              id="date_end"
              type="date"
              label="Дата окончания действия"
              date={state.date_end}
              time={false}
              error={errors.date_end}
              onChange={props.handleChange}
              boundKeys="date_end"
              disabled={!isPermitted}
              modalKey={path}
            />
            <ExtField
              id="price"
              type="string"
              label="Стоимость, руб."
              value={state.price}
              error={errors.price}
              onChange={props.handleChange}
              boundKeys="price"
              disabled={!isPermitted}
              modalKey={path}
            />
            <ExtField
              id="note"
              type="text"
              label="Примечание"
              value={state.note}
              error={errors.note}
              onChange={props.handleChange}
              boundKeys="note"
              disabled={!isPermitted}
              modalKey={path}
            />
            <FileField
              label="Файл"
              id="files"
              value={state.files}
              error={errors.files}
              onChange={props.handleChange}
              boundKeys="files"
              disabled={!isPermitted}
              modalKey={path}
            />
          </Col>
        </Row>
      </ModalBodyPreloader>
      <Modal.Footer>
        {isPermitted ? ( // либо обновление, либо создание
          <Button
            disabled={!props.canSave}
            onClick={props.defaultSubmit}>
            Сохранить
          </Button>
        ) : (
          <DivNone />
        )}
      </Modal.Footer>
    </EtsModal>
  );
};

export default compose<PropsInsurancePolicy, OwnInsurancePolicyProps>(
  connect<StatePropsInsurancePolicy, DispatchPropsInsurancePolicy, OwnInsurancePolicyProps, ReduxState>(
    null,
    (dispatch: any, { page, path }) => ({
      autobaseGetInsuranceType: () => (
        dispatch(autobaseActions.autobaseGetInsuranceType({}, { page, path }))
      ),
      autobaseGetSetCar: (...arg) => (
        dispatch(autobaseActions.autobaseGetSetCar(...arg))
      ),
    }),
  ),
  withForm<PropsInsurancePolicyWithForm, InsurancePolicy>({
    uniqField: 'id',
    createAction: autobaseActions.autobaseCreateInsurancePolicy,
    updateAction: autobaseActions.autobaseUpdateInsurancePolicy,
    mergeElement: (props) => {
      return getDefaultInsurancePolicyElement(props.element);
    },
    schema: insurancePolicyFormSchema,
    permissions: insurancePolicyPermissions,
  }),
)(InsurancePolicyForm);
