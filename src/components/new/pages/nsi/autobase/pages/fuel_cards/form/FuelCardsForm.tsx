import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { compose } from 'recompose';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { get } from 'lodash';

import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  PropsFuelCards,
  PropsFuelCardsWithForm,
  OwnFuelCardsProps,
  DispatchPropsFuelCards,
  StatePropsFuelCards,
} from 'components/new/pages/nsi/autobase/pages/fuel_cards/form/@types/FuelCardsForm';
import { FuelCard, FuelCardOnCars } from 'redux-main/reducers/modules/autobase/fuel_cards/@types/fuelcards.h';
import { DivNone } from 'global-styled/global-styled';
import { getSessionState } from 'redux-main/reducers/selectors';
import {
  getSessionCompanyOptions,
} from 'redux-main/reducers/modules/session/selectors';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';
import { getSessionStructuresParams } from 'redux-main/reducers/modules/session/selectors';

import fuelCardsPermissions from '../_config-data/permissions';
import { fuelCardsFormSchema } from './schema';
import { getDefaultFuelCardElement, usefuelTypeOptions } from './utils';

import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';

import { uniqKeyForParams } from 'components/new/pages/nsi/autobase/pages/fuel_cards/_config-data/registry-config';
import { validatePermissions } from 'components/@next/@utils/validate_permissions/validate_permissions';
import FuelCardsTabsMain from 'components/new/pages/nsi/autobase/pages/fuel_cards/form/fuelTabs/_FuelCardsTabsMain';

export const defaultFuelCardOnCarsItem: FuelCardOnCars = {
  gov_number: null,
  car_id: null,
  company_id: null,
  installed_at: null,
  uninstalled_at: null,
  is_used_in_waybill: false,
  id: null,
  fuel_card_id: null,
  number: null,
  garage_number: null,
  decouple_reason: null,
  // для таблички
  customId: null,
  isChecked: false,
  isHighlighted: false,
  isSelected: null,
  alredy_save: false,
};

const FuelCardsForm: React.FC<PropsFuelCards> = React.memo(
  (props) => {

    const addNewBatteryOnCar = React.useCallback(() => {
      const newCarId = getNumberValueFromSerch(props.match.params[uniqKeyForParams]); // ???
      const actualBatteriesOnCarId = props.match.params[uniqKeyForParams];
      if ( newCarId && actualBatteriesOnCarId === 'create') {
        const customId = props.formState.fuel_card_on_cars.length + 1;
        props.handleChange(
          'fuel_card_on_cars',
          [
            {
              ...defaultFuelCardOnCarsItem,
              car_id: newCarId,
              customId,
            },
            ...props.formState.fuel_card_on_cars,
          ],
        );
      }
    }, [props.match.params, props.formState, props.handleChange, ]);

    React.useEffect(() => {
      addNewBatteryOnCar();
    }, []);

    const {
      formState: state,
      formErrors: errors,
      page,
      path,
      companyOptions,
      userCompanyId,
      isPermitted,
    } = props;

    const IS_CREATING = !state.id;
    const title = (
      !IS_CREATING
        ? 'Изменение записи'
        : 'Создание записи'
    );

    const companiesFieldIsDisable = companyOptions.length <= 1;

    const companiesDefaultValue
      = IS_CREATING && companiesFieldIsDisable ? userCompanyId : state.company_id;
    
    const isPermittedToUpdateCards = validatePermissions(fuelCardsPermissions.update_cars, props.permissionsSet);
    const filteredFuelTypeOptions = usefuelTypeOptions(); // <<< 1 сделать через отдлеьный хук DITETS20A-134, URL: /fuel_type/, /fuel_type/<id>/ | GET
    const IS_GPN_CARD = state.source_type_id === 2;

    return (
      <EtsBootstrap.ModalContainer
        id="modal-fuel-cards"
        show
        onHide={props.hideWithoutChanges}
        bsSize={'large'}
      >
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>{title}</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={4}>
              <ExtField
                type="string"
                label="Номер"
                value={state.number}
                error={errors.number}
                onChange={props.handleChange}
                boundKeys="number"
                disabled={!isPermitted || state.is_used_in_waybill}
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={4}>
              <ExtField
                type="string"
                label="Статус"
                value={state.status_text}
                error={errors.status_text}
                onChange={props.handleChange}
                boundKeys="status_text"
                disabled={true}
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={4}>
              <ExtField
                type="select"
                label="Тип топлива"
                error={errors.fuel_types}
                options={filteredFuelTypeOptions}
                value={state.fuel_types}
                multi
                onChange={props.handleChange}
                boundKeys="fuel_types"
                disabled={!isPermitted}
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={4}>
              <ExtField
                type="date"
                label="Дата выпуска"
                value={state.released_at}
                time={false}
                makeGoodFormat
                makeGoodFormatInitial
                onChange={props.handleChange}
                error={errors.released_at}
                boundKeys="released_at"
                disabled={!props.isPermitted || state.is_used_in_waybill || IS_GPN_CARD}
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={4}>
              <ExtField
                type="date"
                label="Дата окончания срока действия"
                value={state.date_end}
                time={false}
                makeGoodFormat
                makeGoodFormatInitial
                onChange={props.handleChange}
                error={errors.date_end}
                boundKeys="date_end"
                disabled={!props.isPermitted || state.is_used_in_waybill || IS_GPN_CARD}
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={4}>
              <ExtField
                type="select"
                label="Организация"
                error={errors.company_id}
                options={companyOptions}
                value={companiesDefaultValue}
                onChange={props.handleChange}
                boundKeys="company_id"
                disabled={!isPermitted || companiesFieldIsDisable}
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={4}>
              <ExtField
                type="string"
                label="Способ создания"
                value={state.source_type_text}
                error={errors.source_type_text}
                onChange={props.handleChange}
                boundKeys="source_type_text"
                disabled={true}
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          <FuelCardsTabsMain
            formErrors={errors}
            //
            handleChange={props.handleChange}
            formState={state}
            page={page}
            path={path}
            isPermitted={isPermitted || isPermittedToUpdateCards}
            isPermittedToUpdateCards={isPermittedToUpdateCards}
          />
        </ModalBodyPreloader>
        <EtsBootstrap.ModalFooter>
          {
            Boolean(isPermitted || isPermittedToUpdateCards)
              ? (
                <EtsBootstrap.Button
                  disabled={!props.canSave}
                  onClick={props.defaultSubmit}
                >
                    Сохранить
                </EtsBootstrap.Button>
              ) : (
                <DivNone />
              )
          }
          <EtsBootstrap.Button onClick={props.hideWithoutChanges}>Отменить</EtsBootstrap.Button>
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  },
);

export default compose<PropsFuelCards, OwnFuelCardsProps>(
  connect<StatePropsFuelCards, DispatchPropsFuelCards, OwnFuelCardsProps, ReduxState>((state) => ({
    companyOptions: getSessionCompanyOptions(state),
    userCompanyId: getSessionState(state).userData.company_id,
    STRUCTURE_FIELD_VIEW: getSessionStructuresParams(state)
      .STRUCTURE_FIELD_VIEW,
    userStructureId: getSessionState(state).userData.structure_id,
    permissionsSet: getSessionState(state).userData.permissionsSet,
  })),
  withForm<PropsFuelCardsWithForm, FuelCard>({
    uniqField: 'id',
    createAction: autobaseActions.autobaseCreateFuelCard,
    updateAction: autobaseActions.fuelCardsUpdate,
    getRecordAction: autobaseActions.actionLoadFuelCardById,
    mergeElement: (props) => {
      const { companyOptions, userData } = props;
      const userCompanyId = userData.company_id;

      const IS_CREATING = !get(props, 'element.id', null);
      const companiesFieldIsDisable = companyOptions.length <= 1;
      
      const companiesDefaultValue
        = IS_CREATING && companiesFieldIsDisable
          ? userCompanyId
          : props.element.company_id;

      const newElement: Partial<FuelCard> = {
        ...props.element,
        company_id: companiesDefaultValue,
        origin_fuel_card_on_cars: get(props, 'element.fuel_card_on_cars'),
      };

      return getDefaultFuelCardElement(newElement);
    },
    schema: fuelCardsFormSchema,
    permissions: fuelCardsPermissions,
  }),
)(FuelCardsForm);
