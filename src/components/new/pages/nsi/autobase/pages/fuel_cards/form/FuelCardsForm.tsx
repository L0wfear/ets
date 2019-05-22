import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';
import * as Button from 'react-bootstrap/lib/Button';
import { ExtField } from 'components/ui/new/field/ExtField';
import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { get } from 'lodash';

import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnFuelCardsProps,
  PropsFuelCards,
  StatePropsFuelCards,
  DispatchPropsFuelCards,
  PropsFuelCardsWithForm,
} from 'components/new/pages/nsi/autobase/pages/fuel_cards/form/@types/FuelCardsForm';
import { FuelCards } from 'redux-main/reducers/modules/autobase/fuel_cards/@types/fuelcards.h';
import { DivNone } from 'global-styled/global-styled';
import { getSessionState } from 'redux-main/reducers/selectors';
import {
  getSessionCompanyOptions,
  getSessionFuelTypeOptions,
} from 'redux-main/reducers/modules/session/selectors';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';
import FieldStructureDutyMission from 'components/new/pages/missions/duty_mission/form/main/inside_fields/structure/FieldStructureDutyMission';
import { getSessionStructuresParams } from 'redux-main/reducers/modules/session/selectors';
import * as Popover from 'react-bootstrap/lib/Popover';
import * as OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';
import fuelCardsPermissions from '../_config-data/permissions';
import { fuelCardsFormSchema } from './schema';
import { getDefaultFuelCardsElement } from './utils';
import { FuelCardsIsCommonWrapper } from './styled';

const popover = (
  <Popover
    id="fuel_card-popover"
    className="car-usage-report-title__popover"
  >
    При установленном флаге "Общая" данная топливная карта будет доступна
    для всех подразделений организации, Если данный флаг не установлен, то
    топливная карта доступна тому подразделению, которое указано в карточке.
    Если подразделение не указано и не установлен признак "Общая", то
    топливная карта доступна только головной организации.
  </Popover>
);

const FuelCardsForm: React.FC<PropsFuelCards> = React.memo(
  (props) => {
    const handleSubmit = React.useCallback(
      async () => {
        const {
          originalFormState,
          formState,
          userStructureId,
        } = props;

        if (
          originalFormState.is_common
          && !formState.is_common
          && formState.structure_id !== userStructureId
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
      STRUCTURE_FIELD_VIEW,
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
      <Modal
        id="modal-fuel-cards"
        show
        onHide={props.hideWithoutChanges}
        backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <Row>
            <Col md={9}>
              <ExtField
                type="string"
                label="Номер"
                value={state.number}
                error={errors.number}
                onChange={props.handleChange}
                boundKeys="number"
                disabled={!isPermitted}
              />
            </Col>
            <Col md={3}>
              <FuelCardsIsCommonWrapper>
                <ExtField
                  id="is_common"
                  type="boolean"
                  label="Общая"
                  value={state.is_common}
                  error={errors.is_common}
                  disabled={!isPermitted}
                  onChange={props.handleChangeBoolean}
                  boundKeys="is_common"
                  modalKey={page}
                />
                <OverlayTrigger
                  trigger={['hover', 'focus']}
                  overlay={popover}
                  placement="bottom">
                  <Glyphicon glyph="question-sign" />
                </OverlayTrigger>
              </FuelCardsIsCommonWrapper>
            </Col>

            <Col md={12}>
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
              {STRUCTURE_FIELD_VIEW ? (
                <FieldStructureDutyMission
                  value={state.structure_id}
                  name={state.structure_name}
                  error={errors.structure_id}
                  isPermitted={isPermitted}
                  onChange={props.handleChange}
                  page={page}
                  path={path}
                  disabled={!isPermitted}
                />
              ) : (
                <DivNone />
              )}
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
            </Col>
          </Row>
        </ModalBodyPreloader>
        <Modal.Footer>
          <div>
            {
              isPermitted
                ? (
                  <Button
                    disabled={!props.canSave}
                    onClick={handleSubmit}
                  >
                    Сохранить
                  </Button>
                ) : (
                  <DivNone />
                )
            }
            <Button onClick={props.hideWithoutChanges}>Отменить</Button>
          </div>
        </Modal.Footer>
      </Modal>
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
  withForm<PropsFuelCardsWithForm, FuelCards>({
    uniqField: 'id',
    createAction: autobaseActions.autobaseCreateFuelCards,
    updateAction: autobaseActions.fuelCardsUpdate,
    mergeElement: (props) => {
      const { companyOptions, userCompanyId, userStructureId } = props;

      const IS_CREATING = !get(props, 'element.id', null);
      const companiesFieldIsDisable = companyOptions.length <= 1 ? true : false;

      const companiesDefaultValue =
        IS_CREATING && companiesFieldIsDisable
          ? userCompanyId
          : props.element.company_id;

      const newElement: Partial<FuelCards> = {
        ...props.element,
        company_id: companiesDefaultValue,
        structure_id: IS_CREATING ? userStructureId : null,
      };

      return getDefaultFuelCardsElement(newElement);
    },
    schema: fuelCardsFormSchema,
    permissions: fuelCardsPermissions,
  }),
)(FuelCardsForm);
