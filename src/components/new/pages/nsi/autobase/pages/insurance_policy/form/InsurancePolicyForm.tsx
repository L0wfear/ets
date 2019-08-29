import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import { compose } from 'recompose';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { insurancePolicyFormSchema } from 'components/new/pages/nsi/autobase/pages/insurance_policy/form/schema';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';

import { defaultSelectListMapper } from 'components/old/ui/input/ReactSelect/utils';
import { getDefaultInsurancePolicyElement } from 'components/new/pages/nsi/autobase/pages/insurance_policy/form/utils';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
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
import { FileField } from 'components/old/ui/input/fields';

import { get } from 'lodash';
import insurancePolicyPermissions from '../_config-data/permissions';

const InsurancePolicyForm: React.FC<PropsInsurancePolicy> = (props) => {
  const [insuranceTypeOptions, setInsuranceTypeOptions] = React.useState([]);
  const [carList, setCarList] = React.useState([]);
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

      if (!car_id) {
        props.autobaseGetSetCar({}, { page, path }).then(
          ({ data }) => {
            setCarList(
              data,
            );
          },
        );
      }
    },
    [],
  );

  const carListOptions = React.useMemo(
    () => {
      const options = carList.map((rowData) => ({
        value: rowData.asuods_id,
        label: rowData.gov_number,
      }));

      if (state.car_id) {
        const hasCar = options.find(({ value }) => value === state.car_id);
        if (!hasCar) {
          options.push({
            value: state.car_id,
            label: state.gov_number,
          });
        }
      }

      return options;
    },
    [carList, state.car_id, state.gov_number],
  );

  return (
    <EtsBootstrap.ModalContainer
      id="modal-insurance-policy"
      show
      onHide={props.hideWithoutChanges}
    >
      <EtsBootstrap.ModalHeader closeButton>
        <EtsBootstrap.ModalTitle>{title}</EtsBootstrap.ModalTitle>
      </EtsBootstrap.ModalHeader>
      <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={12}>
            {!car_id && (
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
                value_string={state.gov_number}
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
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
      </ModalBodyPreloader>
      <EtsBootstrap.ModalFooter>
        {isPermitted ? ( // либо обновление, либо создание
          <EtsBootstrap.Button
            disabled={!props.canSave}
            onClick={props.defaultSubmit}>
            Сохранить
          </EtsBootstrap.Button>
        ) : (
          <DivNone />
        )}
      </EtsBootstrap.ModalFooter>
    </EtsBootstrap.ModalContainer>
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
