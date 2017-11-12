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
import FactTab from 'components/program_registry/UpdateFrom/inside_components/program_object/tabs/FactTab.tsx';
import MapField from 'components/program_registry/UpdateFrom/inside_components/program_object/inside_fields/FieldMap.tsx';

export const OBJ_TAB_INDEX = {
  PLAN: '1',
  FACT: '2',
};

class ProgramObjectFormDT extends Form {
  static defaultProps = {
    tabKey: OBJ_TAB_INDEX.PLAN,
  }

  constructor(props) {
    super(props);
    
    this.state = {
      manual: false,
    };
  }

  componentDidMount() {
    this.context.flux.getActions('geoObjects').getGeozoneByTypeWithGeometry('dt').then((ans) => {
      const {
        formState: {
          asuods_id = null,
          type_slug: type,
        },
      } = this.props;

      const {
        data: {
          result: {
            rows = [],
          },
        },
      } = ans;


      const OBJECT_OPTIONS = rows.map(({ yard_id: value, object_address: label, total_area, id }) => ({ value, label, total_area, id }));

      if (asuods_id) {
        const {
          dtPolys = {},
        } = this.props;

        const { id: object_id, label: object_address } = OBJECT_OPTIONS.find(({ value: yard_id }) => yard_id === asuods_id) || {};

        if (object_id) {
          const polys = {
            [object_id]: {
              name: object_address,
              object_id,
              state: 2,
              type,
              shape: dtPolys[object_id].shape,
            },
          };
          this.handleChange('polys', polys);
        }
      }
      this.setState({ OBJECT_OPTIONS });

      return ans;
    });
  }
  setManualOnFalse = () => this.setState({ manual: false });
  setManualOnTrue = () => this.setState({ manual: false });

  handleSubmitWrap = () => this.handleSubmit();
  handleChangeInfoObject = (field, value) => {
    this.handleChange(field, value);

    if (value) {
      const {
        formState: {
          type_slug: type,
          asuods_id,
        },
        dtPolys = {},
      } = this.props;
      const {
        OBJECT_OPTIONS = [],
      } = this.state;

      const { id: object_id, label: object_address, total_area } = OBJECT_OPTIONS.find(({ value: yard_id }) => yard_id === asuods_id) || {};

      if (object_id) {
        const polys = {
          [object_id]: {
            name: object_address,
            object_id,
            state: 2,
            type,
            shape: dtPolys[object_id].shape,
          },
        };
        this.handleChange('polys', polys);
      }
      const info = {
        ...this.props.formState.info,
        total_area,
      };

      this.handleChange('info', info);
    }
  }

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
      contractorList = [],
      dtPolys = [],
    } = this.props;

    const {
      OBJECT_OPTIONS = [],
      manual,
    } = this.state;

    const {
      info: {
        total_area = null,
      } = {},
    } = state;

    const CONTRACTOR_OPTIONS = contractorList.map(({ id: value, name: label }) => ({ value, label }));

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
                onChange={this.handleChangeInfoObject}
                boundKeys={['asuods_id']}
                disabled={false}
                clearable={false}
              />
            </Col>
          </Row>
          <div>
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
                <Col md={6}>{0}</Col>
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
            <Row>
              <Col md={6}>
                <TabContent eventKey={OBJ_TAB_INDEX.PLAN} tabKey={tabKey}>
                  <PlanTab
                    isPermitted={true}
                    state={state}
                    errors={errors}
                    objectList={dtPolys}
                    handleChange={this.handleChange}
                  />
                </TabContent>
                <TabContent eventKey={OBJ_TAB_INDEX.FACT} tabKey={tabKey}>
                  <FactTab
                    isPermitted={true}
                    state={state}
                    errors={errors}
                    objectList={dtPolys}
                    handleChange={this.handleChange}
                  />
                </TabContent>
              </Col>
              <Col md={6}>
                <Col md={12}>
                  <label>Отрисовка границ ремонта</label>
                </Col>
                <Col md={6}>
                  <input
                  type='radio'
                  checked={!manual}
                  onChange={this.setManualOnFalse}
                />Отрисовать весь объект
                </Col>
                <Col md={6}>
                  <input
                  type='radio'
                    checked={manual}
                    onChange={this.setManualOnTrue}
                  />Отрисовать границы ремонта
                </Col>
                <Col md={12}>
                  <MapField
                    state={state}
                    manualDraw={manual}
                  />
                </Col>
              </Col>
            </Row>
          </div>
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

