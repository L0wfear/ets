import React from 'react';
import { Row, Col, Modal, Button, Nav, NavItem } from 'react-bootstrap';
import connectToStores from 'flummox/connect';

import { OBJ_TAB_INDEX } from './ProgramObjectFormDT.h';

import { tabable } from 'components/compositions/hoc';

import Form from 'components/compositions/Form.jsx';

import Div from 'components/ui/Div.jsx';
import Field, { ExtField } from 'components/ui/Field.jsx';
import ModalBody from 'components/ui/Modal';

import TabContent from 'components/ui/containers/TabContent';
import TabInfo from 'components/program_registry/UpdateFrom/inside_components/program_object/tabs/TabInfo.tsx';
import MapField from 'components/program_registry/UpdateFrom/inside_components/program_object/inside_fields/FieldMap.tsx';


class ProgramObjectFormDT extends Form {
  static defaultProps = {
    tabKey: OBJ_TAB_INDEX.PLAN,
  }

  constructor(props) {
    super(props);

    this.state = {
      manual: false,
      selectedObj: {},
    };
  }

  componentDidMount() {
    this.context.flux.getActions('repair').getObjectProperty();
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


      const OBJECT_OPTIONS = rows.map(({ yard_id: value, object_address: label, total_area, id, name }) => ({ value, label, total_area, id, name }));

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
        objectPropertyList = [],
      } = this.props;
      const {
        OBJECT_OPTIONS = [],
      } = this.state;

      const { id: object_id, label: object_address, total_area, name } = OBJECT_OPTIONS.find(({ value: yard_id }) => yard_id === asuods_id) || {};

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
        const selectedObj = dtPolys[object_id];

        const elements = this.props.formState.elements.map((d) => {
          const newD = { ...d };
          const { original_name } = objectPropertyList.find(({ object_property_id }) => object_property_id === d.id);
          newD.value = selectedObj.data[original_name];
          return newD;
        });

        this.handleChange('polys', polys);
        this.handleChange('elements', elements);
        this.setState({
          ...this.state,
          selectedObj,
        });
      }

      const info = {
        ...this.props.formState.info,
        total_area,
      };

      this.handleChange('name', name);
      this.handleChange('info', info);
    }
  }

  pushElement = () => {
    const {
      formState: {
        elements = [],
      },
    } = this.props;
    const newElements = [
      ...elements,
      {
        object_property_id: null,
        value: null,
        measure_unit_name: null,
        plan: null,
        fact: null,
        warranty_up_to: null,
      },
    ];

    this.handleChange('elements', newElements);
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
      selectedObj,
    } = this.state;

    const {
      id,
      asuods_id,
      info: {
        total_area = null,
      } = {},
    } = state;

    const IS_CREATE = !!!id;

    const title = IS_CREATE ? 'Создание замечания (ДТ)' : 'Просмотр замечания (ДТ)';

    const CONTRACTOR_OPTIONS = contractorList.map(({ id: value, name: label }) => ({ value, label }));

    return (
      <Modal {...this.props} dialogClassName="modal-xlg" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{title}</Modal.Title>
        </Modal.Header>
        <Div style={{ padding: 15 }}>
          <Row>
            <Col md={6}>
              <ExtField
                type="select"
                label="Наименование объекта"
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
                  <label>Информаця об объекте</label>
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
                    disabled={false || !asuods_id}
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
                    disabled={false || !asuods_id}
                    clearable={false}
                  />
                </Col>
              </Row>
              <Nav bsStyle="tabs" activeKey={tabKey} onSelect={this.props.handleTabSelect} id="refs-car-tabs">
                <NavItem eventKey={OBJ_TAB_INDEX.PLAN}>План</NavItem>
                <NavItem eventKey={OBJ_TAB_INDEX.FACT} >Факт</NavItem>
              </Nav>
              <Row>
                <Col md={7}>
                  <TabInfo
                    isPermitted={!(false || !asuods_id)}
                    whatSelectedTab={tabKey}
                    state={state}
                    errors={errors}
                    objectList={dtPolys}
                    handleChange={this.handleChange}
                    pushElement={this.pushElement}
                    selectedObj={selectedObj}
                  />
                </Col>
                <Col md={5}>
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
                  { false &&
                    <Col md={4}>
                      <input
                        type='radio'
                        checked={manual}
                        onChange={this.setManualOnTrue}
                      />Отрисовать границы ремонта
                    </Col>
                  }
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

