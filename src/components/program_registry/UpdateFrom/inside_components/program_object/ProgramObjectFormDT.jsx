import React from 'react';
import { Row, Col, Modal, Button, Nav, NavItem } from 'react-bootstrap';
import connectToStores from 'flummox/connect';
import moment from 'moment';

import { OBJ_TAB_INDEX, ELEMENT_NULL_OBJECT } from 'components/program_registry/UpdateFrom/inside_components/program_object/ProgramObjectFormDT.h';

import { tabable } from 'components/compositions/hoc';

import Form from 'components/compositions/Form.jsx';

import Div from 'components/ui/Div.jsx';
import { ExtField } from 'components/ui/Field.jsx';
import ModalBody from 'components/ui/Modal';

import TabInfo from 'components/program_registry/UpdateFrom/inside_components/program_object/tabs/TabInfo.tsx';
import MapInfo from 'components/program_registry/UpdateFrom/inside_components/program_object/tabs/MapInfo.tsx';

class ProgramObjectFormDT extends Form {
  static defaultProps = {
    tabKey: OBJ_TAB_INDEX.PLAN,
  }

  constructor(props) {
    super(props);
    const {
      formState: {
        id,
      },
    } = props;

    this.state = {
      manual: false,
      showPercentForm: false,
      selectedObj: {},
      IS_CREATING: !id,
    };
  }

  async componentDidMount() {
    const {
      IS_CREATING,
    } = this.state;
    const { data: { result: { rows: objectPropertyList } } } = await this.context.flux.getActions('repair').getObjectProperty();
    this.context.flux.getActions('geoObjects').getGeozoneByTypeWithGeometry('dt').then((ans) => {
      const {
        formState: {
          asuods_id = null,
          type_slug: type,
          plan_shape_json,
          elements = [],
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

      if (!IS_CREATING) {
        const { id: object_id, label: object_address } = OBJECT_OPTIONS.find(({ value: yard_id }) => yard_id === asuods_id) || {};
        const selectedObj = {
          data: rows.find(({ id }) => id === object_id),
        };

        const polys = {
          [object_id]: {
            name: object_address,
            object_id,
            state: 2,
            type,
            shape: plan_shape_json,
          },
        };

        const newElements = elements.map(d => (
          {
            ...d,
            measure_unit_name: (objectPropertyList.find(({ id }) => id === d.object_property_id) || {}).measure_unit_name,
          }
        ));
        this.setState({ selectedObj });
        this.props.handleMultiChange({
          polys,
          elements: newElements,
        });
      }

      this.setState({ OBJECT_OPTIONS });

      return ans;
    });
  }
  setManualOnFalse = () => this.setState({ manual: false });
  setManualOnTrue = () => this.setState({ manual: false });

  showPercentForm = () => this.setState({ showPercentForm: true });
  hidePercentForm = () => this.setState({ showPercentForm: false });

  handleSubmitWrap = () => this.handleSubmit();
  handleChangeInfoObject = (field, value) => {
    this.handleChange(field, value);

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

    const {
      name,
      id: object_id,
      label: object_address,
      total_area: info_total_area,
    } = OBJECT_OPTIONS.find(({ value: yard_id }) => yard_id === asuods_id) || {};

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

    const info = {
      ...this.props.formState.info,
      total_area: info_total_area,
    };
    this.setState({ selectedObj });
    this.props.handleMultiChange({
      info,
      polys,
      elements,
      name,
    });
  }

  pushElement = () => {
    const {
      formState: {
        elements = [],
      },
    } = this.props;
    const newElements = [
      ...elements,
      { ...ELEMENT_NULL_OBJECT },
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
      showPercentForm,
      selectedObj,
      IS_CREATING,
    } = this.state;

    const {
      asuods_id,
      info: {
        total_area = null,
      } = {},
    } = state;

    const title = IS_CREATING ? 'Создание замечания (ДТ)' : 'Карточка дворовой территории капитального ремонта';

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
                label="Наименование ДТ"
                error={errors.asuods_id}
                options={OBJECT_OPTIONS}
                value={state.asuods_id}
                onChange={this.handleChangeInfoObject}
                boundKeys={['asuods_id']}
                disabled={!IS_CREATING}
                clearable={false}
              />
            </Col>
          </Row>
          <div>
            <Row style={{ marginBottom: 20 }}>
              <Col md={12}>
                <span style={{ fontWeight: 600 }}>Информация об объекте</span>
              </Col>
              <Col md={8}>
                <Row>
                  <Col md={6}>
                    <Col md={9}>Общая площадь по паспорту, кв.м.:</Col>
                    <Col md={3}>{total_area}</Col>
                  </Col>
                  <Col md={6}>
                    <Col md={9}>Площадь проезда, км.м.:</Col>
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
              <Col md={12} style={{ fontWeight: 600, marginBottom: 5 }}>
                <span >Подрядчик</span>
              </Col>
              <Col md={6}>
                <ExtField
                  type="string"
                  label="Номер контракта"
                  value={state.contract_number}
                  error={errors.name}
                  onChange={this.handleChange}
                  boundKeys={['contract_number']}
                  disabled={false}
                />
              </Col>
              <Col style={{ marginBottom: 20 }} md={6}>
                <ExtField
                  type="select"
                  label="Подрядчик"
                  error={errors.contractor_id}
                  options={CONTRACTOR_OPTIONS}
                  value={state.contractor_id}
                  onChange={this.handleChange}
                  boundKeys={['contractor_id']}
                  disabled={false}
                />
              </Col>
            </Row>
            <Nav style={{ marginBottom: 20 }} bsStyle="tabs" activeKey={tabKey} onSelect={this.props.handleTabSelect} id="refs-car-tabs">
              <NavItem eventKey={OBJ_TAB_INDEX.PLAN}>План</NavItem>
              <NavItem eventKey={OBJ_TAB_INDEX.FACT} >Факт</NavItem>
            </Nav>
            <Div hidden={tabKey !== OBJ_TAB_INDEX.FACT}>
              <Row style={{ marginBottom: 20 }}>
                <Col md={3}>
                  <div className="pr-object-data">
                    <span>Процент выполнения</span>
                    <span>{state.percent}</span>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="pr-object-data">
                    <span>Процент выполнения</span>
                    <span>{moment(state.reviewed_at).format(global.APP_DATE_FORMAT)}</span>
                  </div>
                </Col>
                <Col md={2} xsOffset={1}>
                  <Col md={12}>
                    <Button className="active" onClick={this.showPercentForm}>
                      <div style={{ width: 200, textAlign: 'center' }}>
                        %
                      </div>
                    </Button>
                  </Col>
                </Col>
              </Row>
            </Div>
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
                <MapInfo
                  manual={manual}
                  polys={state.polys}
                  setManualOnTrue={this.setManualOnTrue}
                />
              </Col>
            </Row>
          </div>
        </Div>
        <Div hidden={!showPercentForm}>
          {/* Здесь форма процентов */ }
          {/*
            onHide={this.hidePercentForm};
          */ }
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

