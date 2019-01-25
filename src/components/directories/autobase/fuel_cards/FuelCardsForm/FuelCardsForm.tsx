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
import {
  autobaseCreateFuelCards,
  fuelCardsUpdate,
  fuelTypeGet,
} from 'redux-main/reducers/modules/autobase/fuel_cards/actions-fuelcards';

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
  getAutobaseState,
} from 'redux-main/reducers/selectors';

class FuelCardsForm extends React.PureComponent<PropsFuelCards, StateFuelCards> {
  state = {
    fuelTypeOptions: [],
    companyOptions: [],
  };

  componentDidMount() {
    // this.loadFuelType(); // пока что выпилен на беке
    this.setCompaniesListOptionsFromProps();
  }
  async loadFuelType() {
    const { payload: { data } } = await this.props.getFuelType();

    this.setState({ fuelTypeOptions: data.map(defaultSelectListMapper) });
  }

  setCompaniesListOptionsFromProps() {
    const {
      companiesList,
    } = this.props;
    // asuods_id
    this.setState({
      companyOptions: companiesList.map(({ asuods_id, name, ...other }) =>
      ({
        value: asuods_id,
        label: name,
        rowData: {
          asuods_id,
          name,
          ...other,
        }
      })),
    });
  }

  handleChange = (name, value) => {
    this.props.handleChange({
      [name]: get(value, ['target', 'value'], value),
    });
  }
  handleHide = () => {
    this.props.handleHide(false);
  }
  render() {
    const {
      formState: state,
      formErrors: errors,
      page,
      path,
    } = this.props;
    const {
      fuelTypeOptions,
      companyOptions,
    } = this.state;

    const IS_CREATING = !state.id;

    const title = !IS_CREATING ? 'Изменение записи' : 'Создание записи';
    const isPermitted = !IS_CREATING ? this.props.isPermittedToUpdate : this.props.isPermittedToCreate;

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
                onChange={this.handleChange}
                boundKeys="number"
                disabled={!isPermitted}
              />
              <ExtField
                type="select"
                label="Тип топлива"
                error={errors.fuel_type}
                options={fuelTypeOptions}
                value={state.fuel_type}
                onChange={this.handleChange}
                boundKeys="fuel_type"
                disabled={!isPermitted}
              />
              <ExtField
                type="select"
                label="Организация"
                error={errors.company_id}
                options={companyOptions}
                value={state.company_id}
                onChange={this.handleChange}
                boundKeys="company_id"
                disabled={!isPermitted}
              />
            </Col>
          </Row>
        </ModalBodyPreloader>
        <Modal.Footer>
        {
          isPermitted // либо обновление, либо создание
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
      companiesList: getSessionState(state).userData.companies,
      fuelTypeList: getAutobaseState(state).fuelTypeList,
    }),
    (dispatch, { page, path }) => ({
      createAction: (formState) => (
        dispatch(
          autobaseCreateFuelCards(
            formState,
            { page, path },
          ),
        )
      ),
      updateAction: (formState) => (
        dispatch(
          fuelCardsUpdate(
            formState,
            { page, path },
          ),
        )
      ),
      getFuelType: () => (
        dispatch(
          fuelTypeGet(
            {},
            { page, path },
          ),
        )
      ),
    }),
  ),
  withForm<PropsFuelCardsWithForm, FuelCards>({
    uniqField: 'id',
    mergeElement: (props) => {
      return getDefaultFuelCardsElement(props.element);
    },
    schema: fuelCardsFormSchema,
    permissions: fuelCardsPermissions,
  }),
)(FuelCardsForm);
