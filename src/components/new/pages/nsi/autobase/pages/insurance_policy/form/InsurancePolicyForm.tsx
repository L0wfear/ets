import * as React from 'react';
import { compose } from 'recompose';
import { get } from 'lodash';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import ExtField from 'components/@next/@ui/renderFields/Field';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { insurancePolicyFormSchema } from 'components/new/pages/nsi/autobase/pages/insurance_policy/form/schema';

import { defaultSelectListMapper } from 'components/old/ui/input/ReactSelect/utils';
import { getDefaultInsurancePolicyElement } from 'components/new/pages/nsi/autobase/pages/insurance_policy/form/utils';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import {
  PropsInsurancePolicy,
  PropsInsurancePolicyWithForm,
} from 'components/new/pages/nsi/autobase/pages/insurance_policy/form/@types/InsurancePolicyForm';
import { InsurancePolicy } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { DivNone } from 'global-styled/global-styled';
import { FileField } from 'components/old/ui/input/fields';

import insurancePolicyPermissions from '../_config-data/permissions';
import { autobaseCreateInsurancePolicy, autobaseUpdateInsurancePolicy } from 'redux-main/reducers/modules/autobase/actions_by_type/insurance_policy/actions';
import { autobaseGetInsuranceType } from 'redux-main/reducers/modules/autobase/actions_by_type/insurance_type/actions';
import useCarActualOptions from 'components/new/utils/hooks/services/useOptions/useCarActualOptions';
import { carActualOptionLabelGarage } from 'components/@next/@utils/formatData/formatDataOptions';

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
  const carList = useCarActualOptions(props.page, props.path, { labelFunc: carActualOptionLabelGarage, }).options;

  React.useEffect(
    () => {
      props.dispatch(
        autobaseGetInsuranceType({}, props),
      ).then(
        ({ data }) => {
          setInsuranceTypeOptions(
            data.map(defaultSelectListMapper),
          );
        },
      );
    },
    [],
  );

  React.useEffect(
    () => {
      if (carList.length) {
        if (state.car_id) {
          const hasCar = carList.find(({ value }) => value === state.car_id);
          if (!hasCar) {
            setCarListOptions(carList.concat([{value: state.car_id, label: carActualOptionLabelGarage({gov_number: state.gov_number}), rowData: null}]));
          } else {
            setCarListOptions(carList);
          }
        }
      }
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
                label="Рег. номер ТС"
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
                hint="Выводится рег. номер ТС, актуальный на текущий день."
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

export default compose<PropsInsurancePolicy, PropsInsurancePolicyWithForm>(
  withForm<PropsInsurancePolicyWithForm, InsurancePolicy>({
    uniqField: 'id',
    createAction: autobaseCreateInsurancePolicy,
    updateAction: autobaseUpdateInsurancePolicy,
    mergeElement: (props) => {
      return getDefaultInsurancePolicyElement(props.element);
    },
    schema: insurancePolicyFormSchema,
    permissions: insurancePolicyPermissions,
  }),
)(InsurancePolicyForm);
