import React from 'react';
import { Modal, Button, Tab, Tabs } from 'react-bootstrap';

import ModalBody from 'components/ui/Modal';
import Form from 'components/compositions/Form.jsx';
import connectToStores from 'flummox/connect';
import { tabable } from 'components/compositions/hoc';
import InfoTab from './tabs/InfoTab';
import BatteryTab from './tabs/BatteryTab';
import TireTab from './tabs/TireTab';

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
      this.props.handleTabSelect(1);
      const payload = {
        car_id: nextState.asuods_id,
      };

      flux.getActions('autobase').getAutobaseListByType('btr', payload);
      flux.getActions('autobase').getAutobaseListByType('tire', payload);
    }
  }
  async componentWillMount() {
    const { flux } = this.context;
    const companyStructureList = await flux.getActions('companyStructure').getLinearCompanyStructureForUser();
    this.setState({ companyStructureList });
  }
  render() {
    const state = this.props.formState;
    const { isPermitted = false } = this.props;
    const { companyStructureList = [] } = this.state;
    const COMPANY_ELEMENTS = companyStructureList.map(el => ({ value: el.id, label: el.name }));

    return (
      <Modal {...this.props} backdrop="static">

        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">Карточка транспортного средства</Modal.Title>
        </Modal.Header>

        <ModalBody>
          <Tabs activeKey={this.props.tabKey} onSelect={this.props.handleTabSelect} id="refs-car-tabs">
            <Tab eventKey={1} title="Информация">
              <InfoTab
                state={state}
                companyElements={COMPANY_ELEMENTS}
                isPermitted={isPermitted}
                onChange={this.handleChange}
              />
            </Tab>
            <Tab eventKey={2} title="Аккумуляторы">
              <BatteryTab
                data={this.props.btrList}
              />
            </Tab>
            <Tab eventKey={3} title="Шины">
              <TireTab
                data={this.props.tireList}
              />
            </Tab>
            <Tab eventKey={4} title="Страхование" disabled>Tab 3 content</Tab>
            <Tab eventKey={5} title="ДТП" disabled>Tab 3 content</Tab>
            <Tab eventKey={6} title="ТО и ремонты" disabled>Tab 3 content</Tab>
            <Tab eventKey={7} title="Техосмотр" disabled>Tab 3 content</Tab>
          </Tabs>
        </ModalBody>

        <Modal.Footer>
          <Button disabled={!isPermitted} onClick={this.handleSubmit.bind(this)}>Сохранить</Button>
        </Modal.Footer>

      </Modal>
    );
  }
}

export default tabable(connectToStores(CarForm, ['objects', 'autobase']));
