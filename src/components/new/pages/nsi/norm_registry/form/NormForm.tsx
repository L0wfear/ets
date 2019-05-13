import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';
import * as Button from 'react-bootstrap/lib/Button';
import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';

import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnNormProps,
  PropsNorm,
  StatePropsNorm,
  DispatchPropsNorm,
  PropsNormWithForm,
} from 'components/new/pages/nsi/norm_registry/form/@types';
import { DivNone } from 'global-styled/global-styled';
import normPermissions from '../_config-data/permissions';
import { Norm } from 'redux-main/reducers/modules/norm_registry/@types';
import { ExtField } from 'components/ui/new/field/ExtField';
import { getDefaultNormElement } from './utils';
import { normFormSchema } from './schema';
import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';
import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';
import normRegistryActions from 'redux-main/reducers/modules/norm_registry/actions';

const SEASONS = [
  { value: 1, label: 'Лето' },
  { value: 2, label: 'Зима' },
  { value: 3, label: 'Всесезон' },
];

const NormForm: React.FC<PropsNorm> = (props) => {
  // const [workKindOptions, setWorkKindOptions] = React.useState([]);
  const [technicalOperationObjectsOptions, setTechnicalOperationObjectsOptions] = React.useState([]);
  const [technicalOperationTypeOptions, setTechnicalOperationTypeOptions] = React.useState([]);
  const [carTypeOptions, setCarTypeOptions] = React.useState([]);
  const [sensorTypeOptions, setSensorTypeOptions] = React.useState([]);

  const {
    formState: state,
    formErrors: errors,
    page,
    path,
  } = props;

  React.useEffect(
    () => {
      /*
      props.actionGetWorkKind({}, { page, path }).then((workKindList) => {
        setWorkKindOptions(workKindList.map(defaultSelectListMapper));
        console.log(workKindOptions);
      });
      */
      props.actionGetTechnicalOperationObjects({}, { page, path }).then(
        (technicalOperationsObjectsList) => {
          setTechnicalOperationObjectsOptions(
            technicalOperationsObjectsList.map(
              ({ id, full_name }) => ({ value: id, label: full_name }),
            ),
          );
        },
      );
      props.actionGetTechnicalOperationTypes({}, { page, path }).then(
        (technicalOperationsTypesList) => {
          setTechnicalOperationTypeOptions(
            technicalOperationsTypesList.map(({ key, name }) => ({
              value: key, label: name,
            })),
          );
        },
      );
      props.autobaseGetSetCarFuncTypes({}, { page, path }).then(
        ({ data }) => {
          setCarTypeOptions(
            data.map(({ asuods_id, full_name }) => ({
              value: asuods_id,
              label: full_name,
            })),
          );
        },
      );
      props.actionGetSensorType({}, { page, path }).then(
        (sensorTypeList) => {
          setSensorTypeOptions(
            sensorTypeList.map(defaultSelectListMapper),
          );
        },
      );
    },
    [],
  );

  const conditionValue = (
    state.period_interval_name
      ? `${state.norm_period} в ${state.period_interval_name}`
      : state.norm_period
  );
  const IS_CREATING = !state.id;

  const title = !IS_CREATING ? 'Тех. операция' : 'Тех. операция';
  const isPermitted = !IS_CREATING ? props.isPermittedToUpdate : props.isPermittedToCreate;
  const isPermittedHardcode = false;

  return (
    <Modal id="modal-technical-operation" show onHide={props.hideWithoutChanges} bsSize="large" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{ title }</Modal.Title>
      </Modal.Header>
      <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
        <Row>
          <Col md={3}>
            <ExtField
              id="name"
              type="string"
              label="Наименование"
              value={state.name}
              onChange={props.handleChange}
              boundKeys="name"
              disabled={!isPermittedHardcode}
              error={errors.name}
            />
          </Col>
          <Col md={3}>
            <ExtField
              id="elements_text"
              type="string"
              label="Элемент"
              value={state.elements_text}
              onChange={props.handleChange}
              boundKeys="elements_text"
              error={errors.elements_text}
              disabled={!isPermittedHardcode}
            />
          </Col>
          <Col md={3}>
            <ExtField
              id="season_id"
              type="select"
              label="Сезон"
              value={state.season_id}
              options={SEASONS}
              onChange={props.handleChange}
              boundKeys="season_id"
              error={errors.season_id}
              disabled={!isPermittedHardcode}
            />
          </Col>
          <Col md={3}>
            <ExtField
              type="string"
              label="Способ выполнения"
              value={state.kind_task_names}
              onChange={props.handleChange}
              boundKeys="kind_task_names"
              error={errors.kind_task_names}
              disabled={!isPermittedHardcode}
            />
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            <ExtField
              id="work_type_name"
              type="string"
              label="Способ уборки"
              value={state.work_type_name}
              onChange={props.handleChange}
              boundKeys="work_type_name"
              error={errors.work_type_name}
              disabled={!isPermittedHardcode}
            />
          </Col>

          <Col md={3}>
            <ExtField
              id="conditions"
              type="string"
              label="Условия"
              value={state.conditions}
              onChange={props.handleChange}
              boundKeys="conditions"
              error={errors.conditions}
              disabled={!isPermittedHardcode}
            />
          </Col>

          <Col md={3}>
            <ExtField
              id="norm_period"
              type="string"
              label="Число операций в сутки (норматив)"
              value={conditionValue}
              onChange={props.handleChange}
              boundKeys="norm_period"
              disabled={!isPermittedHardcode}
            />
          </Col>
          <Col md={3}>
            <ExtField
              id="check_types"
              label="Тип проверки"
              type="select"
              multi
              options={technicalOperationTypeOptions}
              value={state.check_types}
              onChange={props.handleChange}
              boundKeys="check_types"
              disabled={!isPermittedHardcode}
            />
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            <ExtField
              id="objects_ids"
              type="select"
              label="Объект"
              multi
              value={state.objects_ids}
              options={technicalOperationObjectsOptions}
              onChange={props.handleChange} // заставь бэк адаптироваться или умереть
              boundKeys="objects_ids"
              disabled={!isPermittedHardcode}
            />
          </Col>
          <Col md={3}>
            <ExtField
              id="use_in_report"
              type="boolean"
              label="Учёт в отчетах"
              checked={!!state.use_in_report}
              onChange={props.handleChangeBoolean}
              boundKeys="use_in_report"
              disabled={!isPermittedHardcode}
            />
          </Col>
        </Row>
        <Row>
        <Col md={3}>
          <ExtField
            id="car_func_types_ids"
            type="select"
            label="Типы ТС"
            multi
            value={state.car_func_types_ids}
            options={carTypeOptions}
            onChange={props.handleChange} // заставь бэк адаптироваться или умереть
            boundKeys="car_func_types_ids"
            disabled={!isPermittedHardcode}
          />
        </Col>
        <Col md={3}>
          <ExtField
            id="sensor_type_ids"
            type="select"
            label="Типы навесного оборудования"
            multi
            value={state.sensor_type_ids}
            options={sensorTypeOptions}
            onChange={props.handleChange}
            boundKeys="sensor_type_ids"
            disabled={!isPermitted && false}
          />
        </Col>
        </Row>
      </ModalBodyPreloader>
      <Modal.Footer>
      {
        isPermitted || true // либо обновление, либо создание
          ? (
            <Button id="save_norm" disabled={!props.canSave} onClick={props.defaultSubmit}>Сохранить</Button>
          )
          : (
            <DivNone />
          )
      }
      </Modal.Footer>
    </Modal>
  );
};

export default compose<PropsNorm, OwnNormProps>(
  connect<StatePropsNorm, DispatchPropsNorm, OwnNormProps, ReduxState>(
    null,
    (dispatch: any) => ({
      actionGetWorkKind: (...arg) => (
        dispatch(
          someUniqActions.actionGetWorkKind(...arg),
        )
      ),
      actionGetTechnicalOperationObjects: (...arg) => (
        dispatch(
          someUniqActions.actionGetTechnicalOperationObjects(...arg),
        )
      ),
      actionGetTechnicalOperationTypes: (...arg) => (
        dispatch(
          someUniqActions.actionGetTechnicalOperationTypes(...arg),
        )
      ),
      autobaseGetSetCarFuncTypes: (...arg) => (
        dispatch(
          autobaseActions.autobaseGetSetCarFuncTypes(...arg),
        )
      ),
      actionGetSensorType: (...arg) => (
        dispatch(
          someUniqActions.actionGetSensorType(...arg),
        )
      ),
    }),
  ),
  withForm<PropsNormWithForm, Norm>({
    updateAction: normRegistryActions.actionUpdateNorm,
    uniqField: 'id',
    mergeElement: (props) => {
      return getDefaultNormElement(props.element);
    },
    schema: normFormSchema,
    permissions: normPermissions,
  }),
)(NormForm);
