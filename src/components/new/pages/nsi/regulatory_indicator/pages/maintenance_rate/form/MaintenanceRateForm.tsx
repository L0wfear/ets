import * as React from 'react';

import * as Modal from 'react-bootstrap/lib/Modal';
import * as Button from 'react-bootstrap/lib/Button';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';

import { ExtField } from 'components/ui/new/field/ExtField';

import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';

import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { get } from 'lodash';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import {
  maintenanceRateCreate,
  maintenanceRateUpdate,
} from 'redux-main/reducers/modules/maintenance_rate/actions-maintenanceRate';

import {
  OwnMaintenanceRateProps,
  PropsMaintenanceRate,
  PropsMaintenanceRateWithForm,
  StatePropsMaintenanceRate,
  DispatchPropsMaintenanceRate,
} from 'components/new/pages/nsi/regulatory_indicator/pages/maintenance_rate/form/@types/MaintenanceRateForm';

import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';

import { MaintenanceRate } from 'redux-main/reducers/modules/maintenance_rate/@types/maintenanceRate.h';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import { getDefaultMaintenanceRateElement } from './utils';
import { maintenanceRateSchema } from './schema';
import maintenanceRatePermissions from '../_config-data/permissions';

const makeOptionsMemoList = (inputList: any[]) => {
  const optionList = inputList.map(defaultSelectListMapper);
  return optionList;
};

export const MaintenanceRateForm: React.FC<
  PropsMaintenanceRate
> = (props) => {
  const {
    page,
    path,
    formState: state,
    formErrors: errors,

    type,
    technicalOperationRegistryList = [],
    maintenanceWorkList = [],
    cleanCategoriesList = [],
  } = props;

  React.useEffect(() => {
    props.actionGetAndSetInStoreTechnicalOperationRegistry({}, { page, path });
    props.actionGetAndSetInStoreMaintenanceWork({}, { page, path });
    props.actionGetAndSetInStoreCleanCategories({}, { page, path });

    return () => {
      props.actionResetTechnicalOperationRegistry();
      props.actionResetMaintenanceWork();
      props.actionResetCleanCategories();
    };
  }, []);

  const IS_CREATING = !state.id;
  const isPermitted = !IS_CREATING
    ? props.isPermittedToUpdate
    : props.isPermittedToCreate;

  const subcategories = get(
    cleanCategoriesList.find(({ id }) => state.clean_category_id === id),
    'subcategories',
    [],
  );

  const TECH_OPERATIONS = React.useMemo(
    () => makeOptionsMemoList(technicalOperationRegistryList),
    [technicalOperationRegistryList],
  );
  const MAINTENANCE_WORK = React.useMemo(
    () => makeOptionsMemoList(maintenanceWorkList),
    [maintenanceWorkList],
  );
  const CATEGORIES = React.useMemo(
    () => makeOptionsMemoList(cleanCategoriesList),
    [cleanCategoriesList],
  );
  const SUBCATEGORIES = React.useMemo(
    () => makeOptionsMemoList(subcategories),
    [subcategories],
  );

  const handleChangeCategory = React.useCallback((value) => {
    props.handleChange({
      clean_subcategory_id: null,
      clean_category_id: value,
    });
  }, []);

  return (
    <Modal
      id="modal-maintenance-rate"
      show
      onHide={props.hideWithoutChanges}
      backdrop="static"
      bsSize="large">
      <Modal.Header closeButton>
        <Modal.Title>
          {!state.id ? 'Добавление' : 'Изменение'} нормы на содержание{' '}
          {type === 'odh' ? 'ОДХ' : 'ДТ'}
        </Modal.Title>
      </Modal.Header>

      <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
        <Row>
          <Col md={12}>
            <ExtField
              type="select"
              label="Технологическая операция"
              error={errors.technical_operation_id}
              options={TECH_OPERATIONS}
              value={state.technical_operation_id}
              onChange={props.handleChange}
              boundKeys="technical_operation_id"
              disabled={!isPermitted}
            />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <ExtField
              type="select"
              label="Наименование регламентной работы"
              error={errors.maintenance_work_id}
              options={MAINTENANCE_WORK}
              value={state.maintenance_work_id}
              onChange={props.handleChange}
              boundKeys="maintenance_work_id"
              disabled={!isPermitted}
            />
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            <ExtField
              type="select"
              label="Сезон"
              error={errors.season_id}
              options={[
                { value: 2, label: 'Зима' },
                { value: 1, label: 'Лето' },
              ]}
              value={state.season_id}
              onChange={props.handleChange}
              boundKeys="season_id"
              disabled={!isPermitted}
            />
          </Col>
          <Col md={3}>
            <ExtField
              type="select"
              label="Категория"
              error={errors.clean_category_id}
              options={CATEGORIES}
              value={state.clean_category_id}
              onChange={handleChangeCategory}
              disabled={!isPermitted}
            />
          </Col>
          <Col md={3}>
            <ExtField
              type="select"
              label="Подкатегория"
              error={errors.clean_subcategory_id}
              options={SUBCATEGORIES}
              value={state.clean_subcategory_id}
              onChange={props.handleChange}
              boundKeys="clean_subcategory_id"
              disabled={!isPermitted || SUBCATEGORIES.length === 0}
            />
          </Col>
          <Col md={3}>
            <ExtField
              type="string"
              label="Норма"
              error={errors.value}
              value={state.value}
              onChange={props.handleChange}
              boundKeys="value"
              disabled={!isPermitted}
            />
          </Col>
        </Row>
      </ModalBodyPreloader>
      <Modal.Footer>
        <Button
          disabled={!props.canSave || !isPermitted}
          onClick={props.defaultSubmit}>
          Сохранить
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default compose<PropsMaintenanceRate, OwnMaintenanceRateProps>(
  connect<
    StatePropsMaintenanceRate,
    DispatchPropsMaintenanceRate,
    OwnMaintenanceRateProps,
    ReduxState
  >(
    (state) => ({
      technicalOperationRegistryList: getSomeUniqState(state)
        .technicalOperationRegistryList,
      maintenanceWorkList: getSomeUniqState(state).maintenanceWorkList,
      cleanCategoriesList: getSomeUniqState(state).cleanCategoriesList,
    }),
    (dispatch: any) => ({
      actionGetAndSetInStoreTechnicalOperationRegistry: (...arg) =>
        dispatch(
          someUniqActions.actionGetAndSetInStoreTechnicalOperationRegistry(
            ...arg,
          ),
        ),
      actionResetTechnicalOperationRegistry: () =>
        dispatch(someUniqActions.actionResetTechnicalOperationRegistry()),
      actionGetAndSetInStoreMaintenanceWork: (...arg) =>
        dispatch(someUniqActions.actionGetAndSetInStoreMaintenanceWork(...arg)),
      actionResetMaintenanceWork: () =>
        dispatch(someUniqActions.actionResetMaintenanceWork()),
      actionGetAndSetInStoreCleanCategories: (...arg) =>
        dispatch(someUniqActions.actionGetAndSetInStoreCleanCategories(...arg)),
      actionResetCleanCategories: () =>
        dispatch(someUniqActions.actionResetCleanCategories()),
    }),
  ),
  withForm<PropsMaintenanceRateWithForm, MaintenanceRate>({
    uniqField: 'id',
    createAction: maintenanceRateCreate,
    updateAction: maintenanceRateUpdate,
    mergeElement: (props) => {
      const elementWithType = {
        type: props.type,
        ...props.element,
      };
      return getDefaultMaintenanceRateElement(elementWithType);
    },
    schema: maintenanceRateSchema,
    permissions: maintenanceRatePermissions,
  }),
)(MaintenanceRateForm);
