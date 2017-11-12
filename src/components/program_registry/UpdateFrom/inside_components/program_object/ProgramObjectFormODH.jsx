import React from 'react';
import { Row, Col, Modal, Button, Nav, NavItem } from 'react-bootstrap';
import { isEmpty } from 'lodash';
import connectToStores from 'flummox/connect';

import { tabable } from 'components/compositions/hoc';

import Form from 'components/compositions/Form.jsx';

import Div from 'components/ui/Div.jsx';
import Field, { ExtField } from 'components/ui/Field.jsx';
import ModalBody from 'components/ui/Modal';

import TabContent from 'components/ui/containers/TabContent';
import PlanTab from 'components/program_registry/UpdateFrom/inside_components/program_object/tabs/PlanTab.tsx';

export const OBJ_TAB_INDEX = {
  PLAN: '1',
  FACT: '2',
};

class ProgramObjectFormDT extends Form {
  static defaultProps = {
    tabKey: OBJ_TAB_INDEX.PLAN,
  }

  componentDidMount() {
    this.context.flux.getActions('geoObjects').getGeozoneByType('odh').then((ans) => {
      const {
        data: {
          result: {
            rows = [],
          },
        },
      } = ans;
      if (!isEmpty(rows)) {
        const { yard_id } = rows[0];
        this.handleChange('asuods_id', yard_id);
      }

      return ans;
    });
  }
  handleSubmitWrap = () => this.handleSubmit();

  render() {
    const [
      state,
      errors,
    ] = [
      this.props.formState,
      this.props.formErrors,
    ];
    const {
      tabKey,
      isPermitted = false,
      dtsList = [],
      contractorList = [],
    } = this.props;

    const OBJECT_OPTIONS = dtsList.map(({ yard_id: value, object_address: label, total_area }) => ({ value, label, total_area }));
    const CONTRACTOR_OPTIONS = contractorList.map(({ id: value, name: label }) => ({ value, label }));

    const { total_area = '', company_name } = dtsList.find(({ yard_id }) => yard_id === state.asuods_id) || {};
    return (
      <Modal {...this.props} bsSize="lg" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{'Создание замечания'}</Modal.Title>
        </Modal.Header>
        <Div style={{ padding: 15 }}>
          <Row>
            <Col md={5} xsOffset={7}>
              <Field
                type="select"
                label="Версии"
                options={[]}
                value={0}
                onChange={this.props.changeVersion}
                clearable={false}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <ExtField
                type="select"
                label="Информация об объекте"
                error={errors.asuods_id}
                options={OBJECT_OPTIONS}
                value={state.asuods_id}
                onChange={this.handleChange}
                boundKeys={['asuods_id']}
                disabled={false}
                clearable={false}
              />
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <label>Информаци об объекте</label>
            </Col>
            <Col md={8}>
              <Row>
                <Col md={6}>
                  <Col md={9}>Общая площадь по паспорту, кв.м:</Col>
                  <Col md={3}>{total_area}</Col>
                </Col>
                <Col md={6}>
                  <Col md={9}>Площадь проезда, км.м:</Col>
                  <Col md={3}>{0}</Col>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Col md={9}>Площадь пешеходной дорожки, км.м:</Col>
                  <Col md={3}>{0}</Col>
                </Col>
                <Col md={6}>
                  <Col md={9}>Площадь тротуаров, км.м:</Col>
                  <Col md={3}>{0}</Col>
                </Col>
              </Row>
            </Col>
            <Col md={4}>
              <Col md={6}>Заказчик</Col>
              <Col md={6}>{company_name}</Col>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <label>Подрядчик</label>
            </Col>
            <Col md={6}>
              <span>Номер контракта</span>
              <ExtField
                type="string"
                value={state.contractor_number}
                error={errors.name}
                onChange={this.handleChange}
                boundKeys={['contractor_number']}
                disabled={false}
              />
            </Col>
            <Col md={6}>
              <span>Подрядчик</span>
              <ExtField
                type="select"
                error={errors.contractor_id}
                options={CONTRACTOR_OPTIONS}
                value={state.contractor_id}
                onChange={this.handleChange}
                boundKeys={['contractor_id']}
                disabled={false}
                clearable={false}
              />
            </Col>
          </Row>
          <Nav bsStyle="tabs" activeKey={tabKey} onSelect={this.props.handleTabSelect} id="refs-car-tabs">
            <NavItem eventKey={OBJ_TAB_INDEX.PLAN}>План</NavItem>
            <NavItem eventKey={OBJ_TAB_INDEX.FACT} >Факт</NavItem>
          </Nav>
          <TabContent eventKey={OBJ_TAB_INDEX.PLAN} tabKey={tabKey}>
            <PlanTab
              isPermitted={true}
              state={state}
              errors={errors}
              handleChange={this.handleChange}
            />
          </TabContent>
          <TabContent eventKey={OBJ_TAB_INDEX.FACT} tabKey={tabKey}>
            fact
          </TabContent>
        </Div>
        <ModalBody />
        <Modal.Footer>
          <Button disabled={!this.props.canSave} onClick={this.handleSubmitWrap}>Сохранить</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}


export default tabable(connectToStores(ProgramObjectFormDT, ['repair', 'geoObjects']));

