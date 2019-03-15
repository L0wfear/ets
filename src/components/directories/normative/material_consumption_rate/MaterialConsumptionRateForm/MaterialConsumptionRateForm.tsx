import * as React from 'react';

import * as Modal from 'react-bootstrap/lib/Modal';
import * as Button from 'react-bootstrap/lib/Button';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';

import { ExtField } from 'components/ui/new/field/ExtField';

import { defaultSelectListMapper, DefaultSelectOption } from 'components/ui/input/ReactSelect/utils';

import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { get } from 'lodash';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import {
  materialConsumptionRateCreate,
  materialConsumptionRateUpdate,
} from 'redux-main/reducers/modules/material_consumption_rate/actions-materialConsumptionRate';

import {
  OwnMaterialConsumptionRateProps,
  PropsMaterialConsumptionRate,
  PropsMaterialConsumptionRateWithForm,
  StatePropsMaterialConsumptionRate,
  DispatchPropsMaterialConsumptionRate,
} from 'components/directories/normative/material_consumption_rate/MaterialConsumptionRateForm/@types/MaterialConsumptionRate.h';

import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';

import { getDefaultMaterialConsumptionRateElement } from 'components/directories/normative/material_consumption_rate/MaterialConsumptionRateForm/utils';
import { materialConsumptionRateSchema } from 'components/directories/normative/material_consumption_rate/MaterialConsumptionRateForm/schema';
import { IMaterialConsumptionRateUpd } from 'redux-main/reducers/modules/material_consumption_rate/@types/materialConsumptionRate.h';
import MaterialConsumptionRatePermissions from 'components/directories/normative/material_consumption_rate/config-data/permissions';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import { getSomeUniqState } from 'redux-main/reducers/selectors';

const makeOptionsMemoList = (inputList: any[], selectListMapper) => {
  const optionList = inputList.map(selectListMapper);
  return optionList;
};

const consumptionRateMateriaListMapper = <R extends any>(rowData: R): DefaultSelectOption<R['id'], R['name'], R> => ({
  value: rowData.id,
  label: rowData.consumable_material_name,
  rowData,
});

export const MaterialConsumptionRateForm: React.FunctionComponent<
  PropsMaterialConsumptionRate
> = (props) => {
  const {
    page,
    path,
    formState: state,
    formErrors: errors,

    technicalOperationRegistryList = [],
    consumptionRateMaterialList = [],
    cleanCategoriesList = [],
  } = props;

  React.useEffect(() => {
    props.actionGetAndSetInStoreTechnicalOperationRegistry({}, { page, path });
    props.actionGetAndSetInStoreConsumptionRateMaterial({}, { page, path });
    props.actionGetAndSetInStoreCleanCategories({}, { page, path });

    return () => {
      props.actionResetTechnicalOperationRegistry();
      props.actionResetConsumptionRateMaterial();
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
    () => makeOptionsMemoList(technicalOperationRegistryList, defaultSelectListMapper),
    [technicalOperationRegistryList],
  );
  const CONSUMABLE_MATERIALS = React.useMemo(
    () => makeOptionsMemoList(consumptionRateMaterialList, consumptionRateMateriaListMapper),
    [consumptionRateMaterialList],
  );
  const CATEGORIES = React.useMemo(
    () => makeOptionsMemoList(cleanCategoriesList, defaultSelectListMapper),
    [cleanCategoriesList],
  );
  const SUBCATEGORIES = React.useMemo(
    () => makeOptionsMemoList(subcategories, defaultSelectListMapper),
    [subcategories],
  );
  const handleChangeCategory = React.useCallback((value) => {
    props.handleChange({
      clean_subcategory_id: null,
      clean_category_id: value,
    });
  }, []);
  const title = IS_CREATING
      ? 'Добавление нормы на расход расходных материалов'
      : 'Изменение нормы на расход расходных материалов';

  return (
    <Modal
      id="modal-consumption-rate"
      show
      onHide={props.hideWithoutChanges}
      backdrop="static"
      bsSize="large">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
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
              label="Расходный материал"
              error={errors.consumable_material_id}
              options={CONSUMABLE_MATERIALS}
              value={state.consumable_material_id}
              onChange={props.handleChange}
              boundKeys="consumable_material_id"
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
              disabled={!isPermitted || SUBCATEGORIES.length === 0}
              options={SUBCATEGORIES}
              value={state.clean_subcategory_id}
              onChange={props.handleChange}
              boundKeys="clean_subcategory_id"
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

export default compose<PropsMaterialConsumptionRate, OwnMaterialConsumptionRateProps>(
  connect<
    StatePropsMaterialConsumptionRate,
    DispatchPropsMaterialConsumptionRate,
    OwnMaterialConsumptionRateProps,
    ReduxState
  >(
    (state) => ({
      technicalOperationRegistryList: getSomeUniqState(state)
        .technicalOperationRegistryList,
      consumptionRateMaterialList: getSomeUniqState(state).consumptionRateMaterialList,
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
      actionGetAndSetInStoreConsumptionRateMaterial: (...arg) =>
        dispatch(someUniqActions.actionGetAndSetInStoreConsumptionRateMaterial(...arg)),
      actionResetConsumptionRateMaterial: () =>
        dispatch(someUniqActions.actionResetConsumptionRateMaterial()),
      actionGetAndSetInStoreCleanCategories: (...arg) =>
        dispatch(someUniqActions.actionGetAndSetInStoreCleanCategories(...arg)),
      actionResetCleanCategories: () =>
        dispatch(someUniqActions.actionResetCleanCategories()),
    }),
  ),
  withForm<PropsMaterialConsumptionRateWithForm, IMaterialConsumptionRateUpd>({
    uniqField: 'id',
    createAction: materialConsumptionRateCreate,
    updateAction: materialConsumptionRateUpdate,
    mergeElement: (props) => {
      const elementWithType = {
        type: props.type,
        ...props.element,
      };
      return getDefaultMaterialConsumptionRateElement(elementWithType);
    },
    schema: materialConsumptionRateSchema,
    permissions: MaterialConsumptionRatePermissions,
  }),
)(MaterialConsumptionRateForm);
