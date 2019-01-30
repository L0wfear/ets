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

import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
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
import {
  getSessionState,
} from 'redux-main/reducers/selectors';
import { getSessionCompanyOptions } from 'redux-main/reducers/modules/session/selectors';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';

class FuelCardsForm extends React.PureComponent<PropsFuelCards, StateFuelCards> {
  state = {
    fuelTypeOptions: [],
  };

  componentDidMount() {
    this.loadFuelType();
  }
  loadFuelType() {
    const fuelTypeList = this.getFuelTypesList(this.props.fuelType);
    this.setState({ fuelTypeOptions: fuelTypeList.map(defaultSelectListMapper) });
  }

  handleHide = () => {
    this.props.handleHide(false);
  }

  getFuelTypesList = (fuelTypeObj) =>
    Object.keys(fuelTypeObj).map((elem) => {
      return {
        id: elem,
        name: fuelTypeObj[elem],
      };
    })

  render() {
    const {
      formState: state,
      formErrors: errors,
      page,
      path,
      companyOptions,
      userCompany,
    } = this.props;
    const {
      fuelTypeOptions,
    } = this.state;

    const IS_CREATING = !state.id;

    const title = (
      !IS_CREATING
        ? 'Изменение записи'
        : 'Создание записи'
    );

    const isPermitted =
          !IS_CREATING
          ? this.props.isPermittedToUpdate
          : this.props.isPermittedToCreate;

    const companiesFieldIsDisable =
        companyOptions.length <= 1
          ? true
          : false;

    const companiesDefaultValue =
          IS_CREATING && companiesFieldIsDisable
          ? userCompany.company_id
          : state.company_id;

    return (
      <Modal id="modal-fuel-cards" show onHide={this.handleHide} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{ title }</Modal.Title>
        </Modal.Header>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <Row>
            <Col md={12}>
              <ExtField
                type="string"
                label="Номер"
                value={state.number}
                error={errors.number}
                onChange={this.props.handleChange}
                boundKeys="number"
                disabled={!isPermitted}
              />
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
        {
          isPermitted
          ? (
            <Button disabled={!this.props.canSave} onClick={this.props.defaultSubmit}>Сохранить</Button>
          )
          : (
            <DivNone />
          )
        }
        <Button onClick={this.handleHide}>Отменить</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default compose<PropsFuelCards, OwnFuelCardsProps>(
  connect<StatePropsFuelCards, DispatchPropsFuelCards, OwnFuelCardsProps, ReduxState>(
    (state) => ({
      companyOptions: getSessionCompanyOptions(state),
      userCompany: { // в два свойства или в userData
        company_id: getSessionState(state).userData.company_id,
        name: getSessionState(state).userData.company_name,
      },
      fuelType: getSessionState(state).appConfig.enums.FUEL_TYPE,
    }),
    (dispatch, { page, path }) => ({
      createAction: (formState) => (
        dispatch(
          autobaseActions.autobaseCreateFuelCards(
            formState,
            { page, path },
          ),
        )
      ),
      updateAction: (formState) => (
        dispatch(
          autobaseActions.fuelCardsUpdate(
            formState,
            { page, path },
          ),
        )
      ),
    }),
  ),
  withForm<PropsFuelCardsWithForm, FuelCards>({
    uniqField: 'id',
    mergeElement: (props) => {
      const {
        companyOptions,
        userCompany,
      } = props;

      const IS_CREATING = !get(props, ['element', 'id'], null);
      const companiesFieldIsDisable =
        companyOptions.length <= 1
              ? true
              : false;

      const companiesDefaultValue =
            IS_CREATING && companiesFieldIsDisable
              ? userCompany.company_id
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
