import React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Button from 'react-bootstrap/lib/Button';
import * as Nav from 'react-bootstrap/lib/Nav';
import * as NavItem from 'react-bootstrap/lib/NavItem';
import * as NavDropdown from 'react-bootstrap/lib/NavDropdown';
import * as MenuItem from 'react-bootstrap/lib/MenuItem';

import connectToStores from 'flummox/connect';
import { changeCompanyStructureIdNotyfication } from 'utils/notifications';
import * as queryString from 'query-string';
import createFio from 'utils/create-fio';
import { diffDates } from 'utils/dates';
import { isFourDigitGovNumber } from 'utils/functions';

import { tabable } from 'components/compositions/hoc';
import ModalBody from 'components/ui/Modal';
import TabContent from 'components/ui/containers/TabContent';
import Form from 'components/compositions/Form';
import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import { isArray } from 'util';
import { DivNone } from 'global-styled/global-styled';

import insurancePolicyComponents from 'components/directories/autobase/insurance_policy/config-data/components';
import techInspectionComponents from 'components/directories/autobase/tech_inspection/config-data/components';
import techMaintComponents from 'components/directories/autobase/tech_maintenance_registry/config-data/components';
import repairComponents from 'components/directories/autobase/repair/config-data/components';
import roadAccidenComponents from 'components/directories/autobase/road_accident/config-data/components';

import MainInfoTab from 'components/directories/autobase/cars/tabs/MainInfoTab';
import RegisterInfoTab from 'components/directories/autobase/cars/tabs/RegisterInfoTab';
import PasportInfoTab from 'components/directories/autobase/cars/tabs/PasportInfoTab';
import BatteryTab from 'components/directories/autobase/cars/tabs/BatteryTab';
import TireTab from 'components/directories/autobase/cars/tabs/TireTab';
import TechMaintTab from 'components/directories/autobase/cars/tabs/TechMaintTab';

const InsurancePolicyList = insurancePolicyComponents[0].component;
const TechInspectionList = techInspectionComponents[0].component;
const TechMaintList = techMaintComponents[0].component;
const RepairList = repairComponents[0].component;
const RoadAccidentList = roadAccidenComponents[0].component;

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
    };
  }

  componentDidUpdate(prevProps) {
    const lastFormState = prevProps.formState;
    const currentFormState = this.props.formState;

    if (currentFormState.asuods_id !== lastFormState.asuods_id && currentFormState.asuods_id) {
      this.props.handleTabSelect(CAR_TAB_INDEX.main_info);
      const payload = {
        car_id: currentFormState.asuods_id,
      };
      const { flux } = this.context;

      flux.getActions('autobase').getAutobaseListByType('actualBatteriesOnCar', payload);
      flux.getActions('autobase').getAutobaseListByType('actualTiresOnCar', payload);
      flux.getActions('autobase').getAutobaseListByType('techMaint', payload);
    }
  }

  async componentDidMount() {
    const { location: { search } } = this.props;
    if (search) {
      this.props.handleTabSelect(queryString.parse(search).active_tab);
    }
    const nextState = this.props.formState;
    const linear = true;
    const descendants_by_user = true;

    const payload = {
      car_id: nextState.asuods_id,
    };

    const { flux } = this.context;
    flux.getActions('employees').getEmployees();
    flux.getActions('employees').getDrivers();
    flux.getActions('companyStructure').getCompanyStructure(linear, descendants_by_user);
    flux.getActions('objects').getCountry();
    flux.getActions('autobase').getAutobaseListByType('engineType');
    flux.getActions('autobase').getAutobaseListByType('propulsionType');
    flux.getActions('autobase').getAutobaseListByType('carCategory');
    flux.getActions('autobase').getAutobaseListByType('actualBatteriesOnCar', payload);
    flux.getActions('autobase').getAutobaseListByType('actualTiresOnCar', payload);
    flux.getActions('autobase').getAutobaseListByType('techMaint', payload);
  }

  handleChangeMainInfoTab = (key, value) => {
    if (key === 'company_structure_id') {
      global.NOTIFICATION_SYSTEM.notify(changeCompanyStructureIdNotyfication);
    }

    this.handleChange(key, value);
  }

  handleSave = () => {
    if (this.props.tabKey !== CAR_TAB_INDEX.main_info) {
      this.props.handleFormOnlySubmit().then(() => this.props.handleTabSelect(CAR_TAB_INDEX.main_info));
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
      companyStructureLinearForUserList = [],
      countryOptions = [],
      engineTypeList = [],
      propulsionTypeList = [],
      carCategoryList = [],
      employeesIndex = {},
      typesList = [],
      driversList = [],
    } = this.props;

    const COMPANY_ELEMENTS = companyStructureLinearForUserList.map(defaultSelectListMapper);
    const engineTypeOptions = engineTypeList.map(defaultSelectListMapper);
    const propulsionTypeOptions = propulsionTypeList.map(defaultSelectListMapper);
    const carCategoryOptions = carCategoryList.map(defaultSelectListMapper);
    const typesOptions = typesList.map(el => ({ value: el.asuods_id, label: el.short_name }));

    /**
     * TODO Сделать виртуализацию списка, если список ТС будет тормозить из-за большого количества записей.
     * Может с помощью этой штуки https://github.com/bvaughn/react-virtualized
     */
    const isFourInGovNumver = isFourDigitGovNumber(state.gov_number);

    const selectedDriverArr = [];
    if (isArray(state.car_drivers_primary_drivers)) {
      selectedDriverArr.push(...state.car_drivers_primary_drivers);
    }
    if (isArray(state.car_drivers_secondary_drivers)) {
      selectedDriverArr.push(...state.car_drivers_secondary_drivers);
    }

    const DRIVERS = driversList.filter((driver) => {
      const driverData = employeesIndex[driver.id];
      if (driverData) {
        if (selectedDriverArr.includes(driver.id)) {
          return true;
        }
        if (driver.active) {
          if (isFourInGovNumver) {
            return driverData.special_license && driverData.special_license_date_end && diffDates(driverData.special_license_date_end, new Date()) > 0;
          }

          return driverData.drivers_license && driverData.drivers_license_date_end && diffDates(driverData.drivers_license_date_end, new Date()) > 0;
        }
      }
      return false;
    }).map(driver => ({ value: driver.id, label: createFio(driver), allData: driver }));

    return (
      <Modal id="modal-car" show={this.props.show} onHide={this.props.onHide} bsSize="large" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Карточка транспортного средства</Modal.Title>
        </Modal.Header>

        <ModalBody>
          <Nav bsStyle="tabs" activeKey={tabKey} onSelect={this.props.handleTabSelect} id="refs-car-tabs">
            <NavDropdown id={1} eventKey="1" title="Информация">
              <MenuItem
                eventKey={CAR_TAB_INDEX.main_info}
                active={tabKey === CAR_TAB_INDEX.main_info}
              >
                Общая информация
              </MenuItem>
              <MenuItem
                eventKey={CAR_TAB_INDEX.register_info}
                active={tabKey === CAR_TAB_INDEX.register_info}
              >
                Информация о регистрации
              </MenuItem>
              <MenuItem
                eventKey={CAR_TAB_INDEX.passport_info}
                active={tabKey === CAR_TAB_INDEX.passport_info}
              >
                Паспорт ТС
              </MenuItem>
            </NavDropdown>
            <NavItem eventKey={CAR_TAB_INDEX.battery}>Аккумуляторы</NavItem>
            <NavItem eventKey={CAR_TAB_INDEX.tire}>Шины</NavItem>
            <NavItem eventKey={CAR_TAB_INDEX.insurance_policy}>Страхование</NavItem>
            <NavItem eventKey={CAR_TAB_INDEX.road_accident}>ДТП</NavItem>
            <NavDropdown id={6} eventKey="6" title="ТО и ремонты">
              <MenuItem
                eventKey={CAR_TAB_INDEX.tech_maintenance}
                active={tabKey === CAR_TAB_INDEX.tech_maintenance}
              >
                Тех. обслуживание
              </MenuItem>
              <MenuItem
                eventKey={CAR_TAB_INDEX.repair}
                active={tabKey === CAR_TAB_INDEX.repair}
              >
                Ремонты ТС
              </MenuItem>
            </NavDropdown>
            <NavItem eventKey={CAR_TAB_INDEX.tech_inspection}>Техосмотр</NavItem>
          </Nav>

          <TabContent eventKey={CAR_TAB_INDEX.main_info} tabKey={tabKey}>
            <MainInfoTab
              state={state}
              errors={errors}
              companyElements={COMPANY_ELEMENTS}
              DRIVERS={DRIVERS}
              isPermitted={isPermitted}
              onChange={this.handleChangeMainInfoTab}
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
            {
              tabKey === CAR_TAB_INDEX.insurance_policy
                ? (
                  <InsurancePolicyList
                    car_id={state.asuods_id}
                  />
                )
                : (
                  <DivNone />
                )
            }
          </TabContent>

          <TabContent eventKey={CAR_TAB_INDEX.road_accident} tabKey={tabKey}>
            {
              tabKey === CAR_TAB_INDEX.road_accident
                ? (
                  <RoadAccidentList
                    car_id={state.asuods_id}
                  />
                )
                : (
                  <DivNone />
                )
            }
          </TabContent>

          <TabContent eventKey={CAR_TAB_INDEX.tech_maintenance} tabKey={tabKey}>
            {
              tabKey === CAR_TAB_INDEX.tech_maintenance
                ? (
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
                )
                : (
                  <DivNone />
                )
            }
          </TabContent>
          <TabContent eventKey={CAR_TAB_INDEX.repair} tabKey={tabKey}>
            {
              tabKey === CAR_TAB_INDEX.repair
                ? (
                  <RepairList
                    car_id={state.asuods_id}
                  />
                )
                : (
                  <DivNone />
                )
            }
          </TabContent>

          <TabContent eventKey={CAR_TAB_INDEX.tech_inspection} tabKey={tabKey}>
            {
              tabKey === CAR_TAB_INDEX.tech_inspection
                ? (
                  <TechInspectionList
                    car_id={state.asuods_id}
                  />
                )
                : (
                  <DivNone />
                )
            }
          </TabContent>
        </ModalBody>

        <Modal.Footer>
          <Button disabled={!this.props.canSave} onClick={this.handleSave}>Сохранить</Button>
        </Modal.Footer>

      </Modal>
    );
  }
}

export default tabable(connectToStores(CarForm, ['objects', 'employees', 'autobase']));
