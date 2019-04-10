import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';
import * as Button from 'react-bootstrap/lib/Button';
import { ExtField } from 'components/ui/new/field/ExtField';
import fuelCardsPermissions from 'components/directories/autobase/fuel_cards/config-data/permissions';
import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { fuelCardsFormSchema } from 'components/directories/autobase/fuel_cards/FuelCardsForm/fuel-cards-from-schema';
import { get } from 'lodash';

import { getDefaultFuelCardsElement } from 'components/directories/autobase/fuel_cards/FuelCardsForm/utils';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnFuelCardsProps,
  PropsFuelCards,
  StateFuelCards,
  StatePropsFuelCards,
  DispatchPropsFuelCards,
  PropsFuelCardsWithForm,
} from 'components/directories/autobase/fuel_cards/FuelCardsForm/@types/FuelCards.h';
import { FuelCards } from 'redux-main/reducers/modules/autobase/fuel_cards/@types/fuelcards.h';
import { DivNone } from 'global-styled/global-styled';
import { getSessionState } from 'redux-main/reducers/selectors';
import {
  getSessionCompanyOptions,
  getSessionFuelTypeOptions,
} from 'redux-main/reducers/modules/session/selectors';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';
import FieldStructureDutyMission from 'components/missions/duty_mission/form/main/inside_fields/structure/FieldStructureDutyMission';
import { getSessionStructuresParams } from 'redux-main/reducers/modules/session/selectors';
import * as Popover from 'react-bootstrap/lib/Popover';
import * as OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { FuelCardsIsCommonWrapper } from 'components/directories/autobase/fuel_cards/styled/styled';

class FuelCardsForm extends React.PureComponent<PropsFuelCards, StateFuelCards> {
  handleSubmit = async () => {
    const {
      originalFormState,
      formState,
      userStructureId,
    } = this.props;

    if (
      originalFormState.is_common
      && !formState.is_common
      && formState.structure_id !== userStructureId
      && userStructureId
    ) {
      try {
        await global.confirmDialog({
          title: 'Внимание',
          body:
            'При сохранении карточки Вам не будет больше доступна данная топливная карта. Продолжить?',
        });
      } catch (e) {
        return;
      }
    }

    this.props.defaultSubmit();
  }

  render() {
    const {
      formState: state,
      formErrors: errors,
      page,
      path,
      companyOptions,
      userCompanyId,
      fuelTypeOptions,
      STRUCTURE_FIELD_VIEW,
    } = this.props;

    const IS_CREATING = !state.id;
    const title = (
      !IS_CREATING
        ? 'Изменение записи'
        : 'Создание записи'
    );

    const isPermitted = !IS_CREATING
      ? this.props.isPermittedToUpdate
      : this.props.isPermittedToCreate;

    const companiesFieldIsDisable = companyOptions.length <= 1 ? true : false;

    const companiesDefaultValue =
      IS_CREATING && companiesFieldIsDisable ? userCompanyId : state.company_id;

    const popover = (
      <Popover
        id="route-odh-coverage-popover"
        className="car-usage-report-title__popover">
        При установленном флаге "Общая" данная топливная карта будет доступна
        для всех подразделений организации, Если данный флаг не установлен, то
        топливная карта доступна тому подразделению, которое указано в карточке.
        Если подразделение не указано и не установлен признак "Общая", то
        топливная карта доступна только головной организации.
      </Popover>
    );
    return (
      <Modal
        id="modal-fuel-cards"
        show
        onHide={this.props.hideWithoutChanges}
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
                onChange={this.props.handleChange}
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
                  onChange={this.props.handleChangeBoolean}
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
                onChange={this.props.handleChange}
                boundKeys="fuel_type"
                disabled={!isPermitted}
              />
              {STRUCTURE_FIELD_VIEW ? (
                <FieldStructureDutyMission
                  value={state.structure_id}
                  name={state.structure_name}
                  error={errors.structure_id}
                  isPermitted={isPermitted}
                  onChange={this.props.handleChange}
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
                onChange={this.props.handleChange}
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
                    disabled={!this.props.canSave}
                    onClick={this.handleSubmit}
                  >
                    Сохранить
                  </Button>
                ) : (
                  <DivNone />
                )
            }
            <Button onClick={this.props.hideWithoutChanges}>Отменить</Button>
          </div>
        </Modal.Footer>
      </Modal>
    );
  }
}

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
      const { companyOptions, userCompanyId } = props;

      const IS_CREATING = !get(props, ['element', 'id'], null);
      const companiesFieldIsDisable = companyOptions.length <= 1 ? true : false;

      const companiesDefaultValue =
        IS_CREATING && companiesFieldIsDisable
          ? userCompanyId
          : props.element.company_id;

      const newElement = {
        ...props.element,
        company_id: companiesDefaultValue,
      };

      return getDefaultFuelCardsElement(newElement);
    },
    schema: fuelCardsFormSchema,
    permissions: fuelCardsPermissions,
  }),
)(FuelCardsForm);
