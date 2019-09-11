import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';

import ExtField from 'components/@next/@ui/renderFields/Field';

import { defaultSelectListMapper, DefaultSelectOption } from 'components/old/ui/input/ReactSelect/utils';

import { compose } from 'recompose';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { get } from 'lodash';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
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
 } from 'components/new/pages/nsi/regulatory_indicator/pages/material_consumption_rate/form/@types/MaterialConsumptionRateForm';

import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';

import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import { MaterialConsumptionRate } from 'redux-main/reducers/modules/material_consumption_rate/@types/materialConsumptionRate.h';
import { materialConsumptionRateSchema } from './schema';
import { getDefaultMaterialConsumptionRateElement } from './utils';
import materialConsumptionRatePermissions from '../_config-data/permissions';
import { actionGetAndSetInStoreConsumptionRateMaterial, actionResetConsumptionRateMaterial } from 'redux-main/reducers/modules/some_uniq/material_consumption_rate/actions';
import { actionGetAndSetInStoreCleanCategories, actionResetCleanCategories } from 'redux-main/reducers/modules/some_uniq/clean_categories/actions';

const makeOptionsMemoList = (inputList: any[], selectListMapper) => {
  const optionList = inputList.map(selectListMapper);
  return optionList;
};

const consumptionRateMateriaListMapper = <R extends any>(rowData: R): DefaultSelectOption<R['id'], R['name'], R> => ({
  value: rowData.id,
  label: rowData.consumable_material_name,
  rowData,
});

export const MaterialConsumptionRateForm: React.FC<PropsMaterialConsumptionRate> = (props) => {
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
    <EtsBootstrap.ModalContainer
      id="modal-consumption-rate"
      show
      onHide={props.hideWithoutChanges}
      bsSize="large"
    >
      <EtsBootstrap.ModalHeader closeButton>
        <EtsBootstrap.ModalTitle>{title}</EtsBootstrap.ModalTitle>
      </EtsBootstrap.ModalHeader>

      <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={12}>
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
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={12}>
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
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={3}>
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
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={3}>
            <ExtField
              type="select"
              label="Категория"
              error={errors.clean_category_id}
              options={CATEGORIES}
              value={state.clean_category_id}
              onChange={handleChangeCategory}
              disabled={!isPermitted}
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={3}>
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
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={3}>
            <ExtField
              type="string"
              label="Норма"
              error={errors.value}
              value={state.value}
              onChange={props.handleChange}
              boundKeys="value"
              disabled={!isPermitted}
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
      </ModalBodyPreloader>
      <EtsBootstrap.ModalFooter>
        <EtsBootstrap.Button
          disabled={!props.canSave || !isPermitted}
          onClick={props.defaultSubmit}>
          Сохранить
        </EtsBootstrap.Button>
      </EtsBootstrap.ModalFooter>
    </EtsBootstrap.ModalContainer>
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
        dispatch(actionGetAndSetInStoreConsumptionRateMaterial(...arg)),
      actionResetConsumptionRateMaterial: () =>
        dispatch(actionResetConsumptionRateMaterial()),
      actionGetAndSetInStoreCleanCategories: (...arg) =>
        dispatch(actionGetAndSetInStoreCleanCategories(...arg)),
      actionResetCleanCategories: () =>
        dispatch(actionResetCleanCategories()),
    }),
  ),
  withForm<PropsMaterialConsumptionRateWithForm, MaterialConsumptionRate>({
    uniqField: 'id',
    createAction: materialConsumptionRateCreate,
    updateAction: materialConsumptionRateUpdate,
    mergeElement: (props) => {
      return getDefaultMaterialConsumptionRateElement(props.element);
    },
    schema: materialConsumptionRateSchema,
    permissions: materialConsumptionRatePermissions,
  }),
)(MaterialConsumptionRateForm);
