import React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Button from 'react-bootstrap/lib/Button';
import * as Nav from 'react-bootstrap/lib/Nav';
import * as NavDropdown from 'react-bootstrap/lib/NavDropdown';
import * as MenuItem from 'react-bootstrap/lib/MenuItem';

import connectToStores from 'flummox/connect';
import { changeCompanyStructureIdNotyfication } from 'utils/notifications';
import * as queryString from 'query-string';

import { tabable } from 'components/compositions/hoc';
import ModalBody from 'components/ui/Modal';
import TabContent from 'components/ui/containers/TabContent';
import Form from 'components/compositions/Form';
import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';

import PasportInfoTab from 'components/directories/autobase/cars/tabs/PasportInfoTab';

import { connect } from 'react-redux';
import { getAutobaseState } from 'redux-main/reducers/selectors';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';

export const CAR_TAB_INDEX = {
  info: '1',
  main_info: '1.1',
  register_info: '1.2',
  passport_info: '1.3',
};

class CarForm extends Form {
  static defaultProps = {
    tabKey: CAR_TAB_INDEX.main_info,
  };

  componentDidUpdate(prevProps) {
    const lastFormState = prevProps.formState;
    const currentFormState = this.props.formState;

    if (
      currentFormState.asuods_id !== lastFormState.asuods_id
      && currentFormState.asuods_id
    ) {
      this.props.handleTabSelect(CAR_TAB_INDEX.main_info);
    }
  }

  async componentDidMount() {
    const {
      location: { search },
    } = this.props;
    if (search) {
      this.props.handleTabSelect(queryString.parse(search).active_tab);
    }

    const { flux } = this.context;
    flux.getActions('objects').getCountry();

    this.props.carCategoryGetAndSetInStore();
    this.props.engineTypeGetAndSetInStore();
    this.props.propulsionTypeGetAndSetInStore();
  }

  handleChangeMainInfoTab = (key, value) => {
    if (key === 'company_structure_id') {
      global.NOTIFICATION_SYSTEM.notify(changeCompanyStructureIdNotyfication);
    }

    this.handleChange(key, value);
  };

  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;
    const {
      isPermitted = false,
      tabKey,
      countryOptions = [],
      engineTypeList = [],
      propulsionTypeList = [],
      carCategoryList = [],
      typesList = [],
    } = this.props;

    const engineTypeOptions = engineTypeList.map(defaultSelectListMapper);
    const propulsionTypeOptions = propulsionTypeList.map(
      defaultSelectListMapper,
    );
    const carCategoryOptions = carCategoryList.map(defaultSelectListMapper);
    const typesOptions = typesList.map((el) => ({
      value: el.asuods_id,
      label: el.short_name,
    }));

    return (
      <Modal
        id="modal-car"
        show={this.props.show}
        onHide={this.props.onHide}
        bsSize="large"
        backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Карточка транспортного средства</Modal.Title>
        </Modal.Header>

        <ModalBody>
          <Nav
            bsStyle="tabs"
            activeKey={tabKey}
            onSelect={this.props.handleTabSelect}
            id="refs-car-tabs">
            <NavDropdown id={1} eventKey="1" title="Информация">
              <MenuItem
                eventKey={CAR_TAB_INDEX.main_info}
                active={tabKey === CAR_TAB_INDEX.main_info}>
                Общая информация
              </MenuItem>
              <MenuItem
                eventKey={CAR_TAB_INDEX.register_info}
                active={tabKey === CAR_TAB_INDEX.register_info}>
                Информация о регистрации
              </MenuItem>
              <MenuItem
                eventKey={CAR_TAB_INDEX.passport_info}
                active={tabKey === CAR_TAB_INDEX.passport_info}>
                Паспорт ТС
              </MenuItem>
            </NavDropdown>
          </Nav>

          <TabContent eventKey={CAR_TAB_INDEX.passport_info} tabKey={tabKey}>
            <PasportInfoTab
              state={state}
              errors={errors}
              isPermitted={isPermitted}
              onChange={this.handleChange}
              handleTabSelect={this.props.handleTabSelect}
              countryOptions={countryOptions}
              engineTypeOptions={engineTypeOptions}
              propulsionTypeOptions={propulsionTypeOptions}
              carCategoryOptions={carCategoryOptions}
              typesOptions={typesOptions}
            />
          </TabContent>
        </ModalBody>

        <Modal.Footer>
          <Button disabled={!this.props.canSave} onClick={this.handleSubmit}>
            Сохранить
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default connect(
  (state) => ({
    engineTypeList: getAutobaseState(state).engineTypeList,
    propulsionTypeList: getAutobaseState(state).propulsionTypeList,
    carCategoryList: getAutobaseState(state).carCategoryList,
  }),
  (dispatch, { page, path }) => ({
    carCategoryGetAndSetInStore: () =>
      dispatch(autobaseActions.carCategoryGetAndSetInStore({}, { page, path })),
    engineTypeGetAndSetInStore: () =>
      dispatch(autobaseActions.engineTypeGetAndSetInStore({}, { page, path })),
    propulsionTypeGetAndSetInStore: () =>
      dispatch(
        autobaseActions.propulsionTypeGetAndSetInStore({}, { page, path }),
      ),
  }),
)(tabable(connectToStores(CarForm, ['objects', 'employees'])));
