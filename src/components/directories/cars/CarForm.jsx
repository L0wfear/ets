import React from 'react';
import { Modal, Button, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import connectToStores from 'flummox/connect';

import { tabable } from 'components/compositions/hoc';
import ModalBody from 'components/ui/Modal';
import TabContent from 'components/ui/containers/TabContent';
import Form from 'components/compositions/Form.jsx';

import InsurancePolicyList from 'components/directories/autobase/insurance_policy/InsurancePolicyList.jsx';
import TechInspectionList from 'components/directories/autobase/tech_inspection/TechInspectionList.jsx';
import TechMaintList from 'components/directories/autobase/tech_maintenance_registry/TechMaintList.jsx';
import RepairList from 'components/directories/autobase/repair/RepairList.jsx';
import RoadAccidentList from 'components/directories/autobase/road_accident/RoadAccidentList.jsx';

import InfoTab from './tabs/InfoTab';
import BatteryTab from './tabs/BatteryTab';
import TireTab from './tabs/TireTab';
import TechMaintTab from './tabs/TechMaintTab.tsx';

export const CAR_TAB_INDEX = {
  info: '1',
  battery: '2',
  tire: '3',
  insurance_policy: '4',
  road_accident: '5',
  tech_maintenance: '6.1',
  repair: '6.2',
  tech_inspection: '7',
};

class CarForm extends Form {
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
      this.props.handleTabSelect('1');
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
    this.setState({ companyStructureList });
  }
  handleSave = () => {
    if (Object.keys(this.props.location.query).length > 0) {
      this.props.history.replaceState(null, this.props.location.pathname, {});
    }

    if (this.props.tabKey !== CAR_TAB_INDEX.info) {
      this.props.handleTabSelect(CAR_TAB_INDEX.info);
    } else {
      this.handleSubmit();
    }
  }
  render() {
    const state = this.props.formState;
    const { isPermitted = false, techMaintListExtra = {} } = this.props;
    const { companyStructureList = [] } = this.state;
    const COMPANY_ELEMENTS = companyStructureList.map(el => ({ value: el.id, label: el.name }));

    return (
      <Modal {...this.props} bsSize="lg" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">Карточка транспортного средства</Modal.Title>
        </Modal.Header>

        <ModalBody>
          <Nav bsStyle="tabs" activeKey={this.props.tabKey} onSelect={this.props.handleTabSelect} id="refs-car-tabs">
            <NavItem eventKey={CAR_TAB_INDEX.info}>Информация</NavItem>
            <NavItem eventKey={CAR_TAB_INDEX.battery}>Аккумуляторы</NavItem>
            <NavItem eventKey={CAR_TAB_INDEX.tire} >Шины</NavItem>
            <NavItem eventKey={CAR_TAB_INDEX.insurance_policy}>Страхование</NavItem>
            <NavItem eventKey={CAR_TAB_INDEX.road_accident} >ДТП</NavItem>
            <NavDropdown eventKey="6" title="ТО и ремонты" id="nav-dropdown">
              <MenuItem eventKey={CAR_TAB_INDEX.tech_maintenance} active={this.props.tabKey === '6.1'}>Тех. обслуживание</MenuItem>
              <MenuItem eventKey={CAR_TAB_INDEX.repair} active={this.props.tabKey === '6.2'}>Ремонты ТС</MenuItem>
            </NavDropdown>
            <NavItem eventKey={CAR_TAB_INDEX.tech_inspection} >Техосмотр</NavItem>
          </Nav>

          <TabContent eventKey={CAR_TAB_INDEX.info} tabKey={this.props.tabKey}>
            <InfoTab
              state={state}
              companyElements={COMPANY_ELEMENTS}
              isPermitted={isPermitted}
              onChange={this.handleChange}
            />
          </TabContent>

          <TabContent eventKey={CAR_TAB_INDEX.info} tabKey={this.props.tabKey}>
            <BatteryTab
              data={this.props.actualBatteriesOnCarList}
            />
          </TabContent>

          <TabContent eventKey={CAR_TAB_INDEX.tire} tabKey={this.props.tabKey}>
            <TireTab
              data={this.props.actualTiresOnCarList}
            />
          </TabContent>

          <TabContent eventKey={CAR_TAB_INDEX.insurance_policy} tabKey={this.props.tabKey}>
            <InsurancePolicyList
              car_id={state.asuods_id}
            />
          </TabContent>

          <TabContent eventKey={CAR_TAB_INDEX.road_accident} tabKey={this.props.tabKey}>
            <RoadAccidentList
              car_id={state.asuods_id}
            />
          </TabContent>

          <TabContent eventKey={CAR_TAB_INDEX.tech_maintenance} tabKey={this.props.tabKey}>
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
          <TabContent eventKey={CAR_TAB_INDEX.repair} tabKey={this.props.tabKey}>
            <RepairList
              car_id={state.asuods_id}
            />
          </TabContent>

          <TabContent eventKey={CAR_TAB_INDEX.tech_inspection} tabKey={this.props.tabKey}>
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
