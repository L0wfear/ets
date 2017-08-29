import React from 'react';
import { Modal, Button, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import connectToStores from 'flummox/connect';

import { tabable } from 'components/compositions/hoc';
import ModalBody from 'components/ui/Modal';
import TabContent from 'components/ui/containers/TabContent';
import Form from 'components/compositions/Form.jsx';
import { defaultSelectListMapper } from 'components/ui/input/EtsSelect';

import InsurancePolicyList from 'components/directories/autobase/insurance_policy/InsurancePolicyList.jsx';
import TechInspectionList from 'components/directories/autobase/tech_inspection/TechInspectionList.jsx';
import TechMaintList from 'components/directories/autobase/tech_maintenance_registry/TechMaintList.jsx';
import RepairList from 'components/directories/autobase/repair/RepairList.jsx';
import RoadAccidentList from 'components/directories/autobase/road_accident/RoadAccidentList.jsx';

import MainInfoTab from './tabs/MainInfoTab';
import RegisterInfoTab from './tabs/RegisterInfoTab';
import PasportInfoTab from './tabs/PasportInfoTab';
import BatteryTab from './tabs/BatteryTab';
import TireTab from './tabs/TireTab';
import TechMaintTab from './tabs/TechMaintTab.tsx';

export const CAR_TAB_INDEX = {
  info: '1',
  main_info: '1.1',
  register_info: '1.2',
  passport_info: '1.3',
  battery: '2',
  tire: '3',
  insurance_policy: '4',
  road_accident: '5',
  tech_maintenance: '6.1',
  repair: '6.2',
  tech_inspection: '7',
};

class CarForm extends Form {
  static defaultProps = {
    tabKey: CAR_TAB_INDEX.main_info,
  }
  constructor(props) {
    super(props);

    this.state = {
      type_image_name: null,
      companyStructureList: [],
    };
  }
  componentWillReceiveProps(props) {
    const { flux } = this.context;
    const currentState = this.props.formState;
    const nextState = props.formState;

    if (nextState.asuods_id !== currentState.asuods_id && nextState.asuods_id) {
      this.props.handleTabSelect(CAR_TAB_INDEX.main_info);
      const payload = {
        car_id: nextState.asuods_id,
      };

      flux.getActions('autobase').getAutobaseListByType('actualBatteriesOnCar', payload);
      flux.getActions('autobase').getAutobaseListByType('actualTiresOnCar', payload);
      flux.getActions('autobase').getAutobaseListByType('techMaint', payload);
    }
  }
  async componentDidMount() {
    if (Object.keys(this.props.location.query).length > 0) {
      this.props.handleTabSelect(this.props.location.query.active_tab);
    }

    const { flux } = this.context;
    const companyStructureList = await flux.getActions('companyStructure').getLinearCompanyStructureForUser();
    flux.getActions('objects').getCountry();
    flux.getActions('autobase').getAutobaseListByType('engineType');
    flux.getActions('autobase').getAutobaseListByType('propulsionType');
    flux.getActions('autobase').getAutobaseListByType('carCategory');
    flux.getActions('objects').getTypes();

    this.setState({ companyStructureList });
  }
  handleSave = () => {
    if (Object.keys(this.props.location.query).length > 0) {
      this.props.history.replaceState(null, this.props.location.pathname, {});
    }

    if (this.props.tabKey !== CAR_TAB_INDEX.main_info) {
      this.props.handleTabSelect(CAR_TAB_INDEX.main_info);
    } else {
      this.handleSubmit();
    }
  }
  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;
    const {
      isPermitted = false,
      techMaintListExtra = {},
      tabKey,
      countryOptions = [],
      engineTypeList = [],
      propulsionTypeList = [],
      carCategoryList = [],
      typesList = [],
    } = this.props;
    const { companyStructureList = [] } = this.state;
    const COMPANY_ELEMENTS = companyStructureList.map(defaultSelectListMapper);
    const engineTypeOptions = engineTypeList.map(defaultSelectListMapper);
    const propulsionTypeOptions = propulsionTypeList.map(defaultSelectListMapper);
    const carCategoryOptions = carCategoryList.map(defaultSelectListMapper);
    const typesOptions = typesList.map(el => ({ value: el.asuods_id, label: el.short_name }));
    
    return (
      <Modal {...this.props} bsSize="lg" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">Карточка транспортного средства</Modal.Title>
        </Modal.Header>

        <ModalBody>
          <Nav bsStyle="tabs" activeKey={tabKey} onSelect={this.props.handleTabSelect} id="refs-car-tabs">
            <NavDropdown eventKey="1" title="Информация">
              <MenuItem
                eventKey={CAR_TAB_INDEX.main_info}
                active={tabKey === CAR_TAB_INDEX.main_info}
              >Общая информация</MenuItem>
              <MenuItem
                eventKey={CAR_TAB_INDEX.register_info}
                active={tabKey === CAR_TAB_INDEX.register_info}
              >Информация о регистрации</MenuItem>
              <MenuItem
                eventKey={CAR_TAB_INDEX.passport_info}
                active={tabKey === CAR_TAB_INDEX.passport_info}
              >Паспорт ТС</MenuItem>
            </NavDropdown>
            <NavItem eventKey={CAR_TAB_INDEX.battery}>Аккумуляторы</NavItem>
            <NavItem eventKey={CAR_TAB_INDEX.tire} >Шины</NavItem>
            <NavItem eventKey={CAR_TAB_INDEX.insurance_policy}>Страхование</NavItem>
            <NavItem eventKey={CAR_TAB_INDEX.road_accident} >ДТП</NavItem>
            <NavDropdown eventKey="6" title="ТО и ремонты">
              <MenuItem
                eventKey={CAR_TAB_INDEX.tech_maintenance}
                active={tabKey === CAR_TAB_INDEX.tech_maintenance}
              >Тех. обслуживание</MenuItem>
              <MenuItem
                eventKey={CAR_TAB_INDEX.repair}
                active={tabKey === CAR_TAB_INDEX.repair}
              >Ремонты ТС</MenuItem>
            </NavDropdown>
            <NavItem eventKey={CAR_TAB_INDEX.tech_inspection} >Техосмотр</NavItem>
          </Nav>

          <TabContent eventKey={CAR_TAB_INDEX.main_info} tabKey={tabKey}>
            <MainInfoTab
              state={state}
              errors={errors}
              companyElements={COMPANY_ELEMENTS}
              isPermitted={isPermitted}
              onChange={this.handleChange}
            />
          </TabContent>

          <TabContent eventKey={CAR_TAB_INDEX.register_info} tabKey={tabKey}>
            <RegisterInfoTab
              state={state}
              errors={errors}
              isPermitted={isPermitted}
              onChange={this.handleChange}
            />
          </TabContent>
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

          <TabContent eventKey={CAR_TAB_INDEX.battery} tabKey={tabKey}>
            <BatteryTab
              data={this.props.actualBatteriesOnCarList}
            />
          </TabContent>

          <TabContent eventKey={CAR_TAB_INDEX.tire} tabKey={tabKey}>
            <TireTab
              data={this.props.actualTiresOnCarList}
            />
          </TabContent>

          <TabContent eventKey={CAR_TAB_INDEX.insurance_policy} tabKey={tabKey}>
            <InsurancePolicyList
              car_id={state.asuods_id}
            />
          </TabContent>

          <TabContent eventKey={CAR_TAB_INDEX.road_accident} tabKey={tabKey}>
            <RoadAccidentList
              car_id={state.asuods_id}
            />
          </TabContent>

          <TabContent eventKey={CAR_TAB_INDEX.tech_maintenance} tabKey={tabKey}>
            <TechMaintTab
              type={state.gov_number && !!(state.gov_number).toString().match(/\d{4}/)}
              techMaintListExtra={techMaintListExtra}
            >
              <TechMaintList
                car_id={state.asuods_id}
                car_model_id={state.special_model_id}
                gov_number={state.gov_number}
              />
            </TechMaintTab>
          </TabContent>
          <TabContent eventKey={CAR_TAB_INDEX.repair} tabKey={tabKey}>
            <RepairList
              car_id={state.asuods_id}
            />
          </TabContent>

          <TabContent eventKey={CAR_TAB_INDEX.tech_inspection} tabKey={tabKey}>
            <TechInspectionList
              car_id={state.asuods_id}
            />
          </TabContent>
        </ModalBody>

        <Modal.Footer>
          <Button disabled={!this.props.canSave} onClick={this.handleSave}>Сохранить</Button>
        </Modal.Footer>

      </Modal>
    );
  }
}

export default tabable(connectToStores(CarForm, ['objects', 'autobase']));
