import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import { compose } from 'recompose';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { get } from 'lodash';

import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnFuelCardsProps,
  PropsFuelCards,
  StatePropsFuelCards,
  DispatchPropsFuelCards,
  PropsFuelCardsWithForm,
} from 'components/new/pages/nsi/autobase/pages/fuel_cards/form/@types/FuelCardsForm';
import { FuelCard } from 'redux-main/reducers/modules/autobase/fuel_cards/@types/fuelcards.h';
import { DivNone } from 'global-styled/global-styled';
import { getSessionState } from 'redux-main/reducers/selectors';
import {
  getSessionCompanyOptions,
  getSessionFuelTypeOptions,
} from 'redux-main/reducers/modules/session/selectors';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';
import { getSessionStructuresParams } from 'redux-main/reducers/modules/session/selectors';

import fuelCardsPermissions from '../_config-data/permissions';
import { fuelCardsFormSchema } from './schema';
import { getDefaultFuelCardElement } from './utils';
import useCarActualOptions from 'components/new/utils/hooks/services/useOptions/useCarActualOptions';
import { carActualOptionLabelGarage } from 'components/@next/@utils/formatData/formatDataOptions';

const FuelCardsForm: React.FC<PropsFuelCards> = React.memo(
  (props) => {

    const carActualListOptions = useCarActualOptions(props.page, props.path, { labelFunc: carActualOptionLabelGarage, });

    const handleSubmit = React.useCallback(
      async () => {
        const {
          formState,
          userStructureId,
        } = props;

        if (
          formState.structure_id !== userStructureId
          && userStructureId
        ) {
          try {
            await global.confirmDialog({
              title: 'Внимание',
              body: 'При сохранении карточки Вам не будет больше доступна данная топливная карта. Продолжить?',
              okName: 'Да',
              cancelName: 'Нет',
            });
          } catch (e) {
            return;
          }
        }

        props.defaultSubmit();
      },
      [],
    );

    const {
      formState: state,
      formErrors: errors,
      page,
      path,
      companyOptions,
      userCompanyId,
      fuelTypeOptions,
      isPermitted,
    } = props;

    const IS_CREATING = !state.id;
    const title = (
      !IS_CREATING
        ? 'Изменение записи'
        : 'Создание записи'
    );

    const companiesFieldIsDisable = companyOptions.length <= 1 ? true : false;

    const companiesDefaultValue =
      IS_CREATING && companiesFieldIsDisable ? userCompanyId : state.company_id;

    return (
      <EtsBootstrap.ModalContainer
        id="modal-fuel-cards"
        show
        onHide={props.hideWithoutChanges}
       >
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>{title}</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
              <ExtField
                type="string"
                label="Номер"
                value={state.number}
                error={errors.number}
                onChange={props.handleChange}
                boundKeys="number"
                disabled={!isPermitted}
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={12}>
              <ExtField
                type="date"
                time={true}
                label="Дата выпуска"
                value={state.released_at}
                makeGoodFormat
                onChange={props.handleChange}
                error={errors.released_at}
                boundKeys="released_at"
                disabled={!props.isPermitted}
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={12}>
              <ExtField
                type="date"
                time={true}
                label="Дата окончания срока действия"
                value={state.date_end}
                makeGoodFormat
                onChange={props.handleChange}
                error={errors.date_end}
                boundKeys="date_end"
                disabled={!props.isPermitted}
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={12}>
              <ExtField
                type="select"
                label="Тип топлива"
                error={errors.fuel_type}
                options={fuelTypeOptions}
                value={state.fuel_type}
                onChange={props.handleChange}
                boundKeys="fuel_type"
                disabled={!isPermitted}
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={12}>
              <ExtField
                type="select"
                label="Рег. номер ТС"
                error={errors.car_id}
                options={carActualListOptions.options}
                value={state.car_id}
                onChange={props.handleChange}
                boundKeys="car_id"
                disabled={!isPermitted}
                etsIsLoading={carActualListOptions.isLoading}
                placeholder="Резерв"
              />
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
        </ModalBodyPreloader>
        <EtsBootstrap.ModalFooter>
            {
              isPermitted
                ? (
                  <EtsBootstrap.Button
                    disabled={!props.canSave}
                    onClick={handleSubmit}
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
    fuelTypeOptions: getSessionFuelTypeOptions(state),
    STRUCTURE_FIELD_VIEW: getSessionStructuresParams(state)
      .STRUCTURE_FIELD_VIEW,
    userStructureId: getSessionState(state).userData.structure_id,
  })),
  withForm<PropsFuelCardsWithForm, FuelCard>({
    uniqField: 'id',
    createAction: autobaseActions.autobaseCreateFuelCard,
    updateAction: autobaseActions.fuelCardsUpdate,
    mergeElement: (props) => {
      const { companyOptions, userCompanyId, userStructureId } = props;

      const IS_CREATING = !get(props, 'element.id', null);
      const companiesFieldIsDisable = companyOptions.length <= 1 ? true : false;

      const companiesDefaultValue =
        IS_CREATING && companiesFieldIsDisable
          ? userCompanyId
          : props.element.company_id;

      const newElement: Partial<FuelCard> = {
        ...props.element,
        company_id: companiesDefaultValue,
        structure_id: IS_CREATING ? (get(props, 'element.structure_id') || userStructureId) : get(props, 'element.structure_id'),
      };

      return getDefaultFuelCardElement(newElement);
    },
    schema: fuelCardsFormSchema,
    permissions: fuelCardsPermissions,
  }),
)(FuelCardsForm);
