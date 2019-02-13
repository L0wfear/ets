import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';
import * as Button from 'react-bootstrap/lib/Button';
import { ExtField } from 'components/ui/new/field/ExtField';
import insurancePolicyPermissions from 'components/directories/autobase/insurance_policy/config-data/permissions';
import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { insurancePolicyFormSchema } from 'components/directories/autobase/insurance_policy/InsurancePolicyForm/insurance-policy-from-schema';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';

import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import { getDefaultInsurancePolicyElement } from 'components/directories/autobase/insurance_policy/InsurancePolicyForm/utils';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnInsurancePolicyProps,
  PropsInsurancePolicy,
  StateInsurancePolicy,
  StatePropsInsurancePolicy,
  DispatchPropsInsurancePolicy,
  PropsInsurancePolicyWithForm,
} from 'components/directories/autobase/insurance_policy/InsurancePolicyForm/@types/InsurancePolicy.h';
import { InsurancePolicy } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { DivNone } from 'global-styled/global-styled';
import { FileField } from 'components/ui/input/fields';
import EtsModal from 'components/new/ui/modal/Modal';

class InsurancePolicyForm extends React.PureComponent<
  PropsInsurancePolicy,
  StateInsurancePolicy
> {
  state = {
    insuranceTypeOptions: [],
    carListOptions: [],
  };

  componentDidMount() {
    this.loadInsuranceType();

    const IS_CREATING = !this.props.formState.id;

    if (IS_CREATING && !this.props.car_id) {
      this.loadCars();
    }
  }
  async loadInsuranceType() {
    const {
      payload: { data },
    } = await this.props.autobaseGetInsuranceType();

    this.setState({ insuranceTypeOptions: data.map(defaultSelectListMapper) });
  }
  async loadCars() {
    const { page, path } = this.props;
    const { data } = await this.props.autobaseGetSetCar({}, { page, path });

    this.setState({
      carListOptions: data.map(({ asuods_id, gov_number, ...other }) => ({
        value: asuods_id,
        label: gov_number,
        rowData: {
          asuods_id,
          gov_number,
          ...other,
        },
      })),
    });
  }

  render() {
    const {
      formState: state,
      formErrors: errors,
      car_id,
      page,
      path,
    } = this.props;
    const { insuranceTypeOptions, carListOptions } = this.state;

    const IS_CREATING = !state.id;

    const title = !IS_CREATING ? 'Изменение записи' : 'Создание записи';
    const isPermitted = !IS_CREATING
      ? this.props.isPermittedToUpdate
      : this.props.isPermittedToCreate;

    return (
      <EtsModal
        id="modal-insurance-policy"
        show
        deepLvl={this.props.deepLvl}
        onHide={this.props.hideWithoutChanges}
        backdrop="static">
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
                  onChange={this.props.handleChange}
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
                onChange={this.props.handleChange}
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
                onChange={this.props.handleChange}
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
                onChange={this.props.handleChange}
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
                onChange={this.props.handleChange}
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
                onChange={this.props.handleChange}
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
                onChange={this.props.handleChange}
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
                onChange={this.props.handleChange}
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
                onChange={this.props.handleChange}
                boundKeys="note"
                disabled={!isPermitted}
                modalKey={path}
              />
              <FileField
                label="Файл"
                id="files"
                value={state.files}
                error={errors.files}
                onChange={this.props.handleChange}
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
              disabled={!this.props.canSave}
              onClick={this.props.defaultSubmit}>
              Сохранить
            </Button>
          ) : (
            <DivNone />
          )}
        </Modal.Footer>
      </EtsModal>
    );
  }
}

export default compose<PropsInsurancePolicy, OwnInsurancePolicyProps>(
  connect<
    StatePropsInsurancePolicy,
    DispatchPropsInsurancePolicy,
    OwnInsurancePolicyProps,
    ReduxState
  >(
    null,
    (dispatch: any, { page, path }) => ({
      autobaseGetInsuranceType: () =>
        dispatch(autobaseActions.autobaseGetInsuranceType({}, { page, path })),
      autobaseGetSetCar: (...arg) =>
        dispatch(autobaseActions.autobaseGetSetCar(...arg)),
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
