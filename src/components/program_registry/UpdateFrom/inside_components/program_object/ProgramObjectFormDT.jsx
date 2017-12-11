import React from 'react';
import { Row, Col, Modal, Button, Nav, NavItem } from 'react-bootstrap';
import connectToStores from 'flummox/connect';
import moment from 'moment';
import { cloneDeep, isEmpty } from 'lodash';

import { OBJ_TAB_INDEX, ELEMENT_NULL_OBJECT } from 'components/program_registry/UpdateFrom/inside_components/program_object/ProgramObjectFormDT.h';

import { tabable } from 'components/compositions/hoc';

import Form from 'components/compositions/Form.jsx';

import Div from 'components/ui/Div.jsx';
import { ExtField } from 'components/ui/Field.jsx';
import ModalBody from 'components/ui/Modal';

import TabInfo from 'components/program_registry/UpdateFrom/inside_components/program_object/tabs/TabInfo.tsx';
import MapInfo from 'components/program_registry/UpdateFrom/inside_components/program_object/tabs/MapInfo.tsx';

import { PercentModalList } from 'components/program_registry/UpdateFrom/inside_components/program_object/inside_components';

const getObjectsType = (slug) => {
  switch (slug) {
    case 'dt': return 'simple_dt';
    case 'mixed': return 'mixed';
    default: return 'simple_dt';
  }
};
const log = {};

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
      polys: {},
    };
  }

  async componentDidMount() {
    const {
      IS_CREATING,
    } = this.state;

    this.context.flux.getActions('repair').getObjectProperty({ object_type: 'odh' }).then(({ data: { result: { rows: objectPropertyList } } }) => {
      const {
        formState: {
          asuods_id = null,
          type_slug: type,
          plan_shape_json: {
            manual,
            dtPolys: dtPolysOut,
            draw_object_list = [],
            object_list,
          },
          elements = [],
        },
      } = this.props;

      if (!IS_CREATING) {
        const changesState = { manual };

        const changesFormState = {};
        if (manual) {
          changesFormState.draw_object_list = draw_object_list;
          changesFormState.objectsType = getObjectsType('mixed');
        } else {
          changesFormState.object_list = object_list;
          changesFormState.objectsType = getObjectsType(type);
        }
        changesState.dtPolys = dtPolysOut;
        changesState.OBJECT_OPTIONS = Object.values(changesState.dtPolys).map(({ data: { yard_id: value, object_address: label, total_area, id, name } }) => ({ value, label, total_area, id, name }));

        const { id: object_id } = changesState.OBJECT_OPTIONS.find(({ value: yard_id }) => yard_id === asuods_id) || {};

        changesState.selectedObj = changesState.dtPolys[object_id];

        changesFormState.elements = elements.map(d => ({
          ...d,
          measure_unit_name: (objectPropertyList.find(({ id }) => id === d.object_property_id) || {}).measure_unit_name,
        }));
        this.props.handleMultiChange({ ...changesFormState });
        this.setState({ ...changesState });
      } else {
        this.context.flux.getActions('geoObjects').getGeozoneByTypeWithGeometry('dt').then((ans) => {
          const {
            dtPolys: dtPolysOrigal = {},
          } = this.props;

          const changesState = { manual };
          changesState.dtPolys = cloneDeep(dtPolysOrigal);

          changesState.OBJECT_OPTIONS = Object.values(changesState.dtPolys).map(({ data: { yard_id: value, object_address: label, total_area, id, name } }) => ({ value, label, total_area, id, name }));

          this.setState({ ...changesState });

          return ans;
        });
      }
    });
  }

  setManualOnFalse = () => {
    const { formState: { draw_object_list = [] } } = this.props;
    const { dtPolys: dtPolysOld } = this.props;
    const { object_list, object_list: [selectedShape] } = log;

    const dtPolys = cloneDeep(dtPolysOld);

    dtPolys[selectedShape.object_id].state = selectedShape.state;

    log.draw_object_list = cloneDeep(draw_object_list);

    this.props.handleMultiChange({
      draw_object_list,
      object_list,
      objectsType: log.objectsType,
    });
    this.setState({ manual: false, dtPolys });
  }
  setManualOnTrue = () => {
    const { formState: { objectsType, object_list, object_list: [selectedShape] } } = this.props;
    const { dtPolys: dtPolysOld } = this.props;

    const dtPolys = {
      [selectedShape.object_id]: {
        ...dtPolysOld[selectedShape.object_id],
      },
    };

    log.object_list = cloneDeep(object_list);
    log.objectsType = objectsType;

    this.props.handleMultiChange({
      object_list,
      draw_object_list: log.draw_object_list || [],
      objectsType: getObjectsType('mixed'),
    });
    this.setState({ manual: true, dtPolys });
  }

  showPercentForm = () => this.setState({ showPercentForm: true });
  hidePercentForm = () => this.setState({ showPercentForm: false });

  handleSubmitWrap = () => {
    const { manual, IS_CREATING } = this.state;
    if (IS_CREATING) {
      const { dtPolys } = this.state;

      const plan_shape_json = {
        manual,
      };

      if (manual) {
        const { formState: { draw_object_list } } = this.props;

        plan_shape_json.dtPolys = dtPolys;
        plan_shape_json.draw_object_list = draw_object_list;
      } else {
        const { formState: { object_list, object_list: [selectedShape] } } = this.props;
        const { object_id } = selectedShape;

        plan_shape_json.dtPolys = { [object_id]: dtPolys[object_id] };
        plan_shape_json.object_list = object_list;
      }
      this.handleChange('plan_shape_json', plan_shape_json);
    }
    return new Promise(() => this.handleSubmit());
  }
  handleFeatureClick = ({ id: object_id }) => {
    const { dtPolys } = this.state;
    const { data: { yard_id: asuods_id } } = dtPolys[object_id];

    this.handleChangeInfoObject('asuods_id', asuods_id);
  }

  startDraw = () => {
    this.handleChange('draw_object_list', []);
  }
  handleDrawFeatureAdd = ({ drawObjectNew }) => {
    const { formState: { draw_object_list = [] } } = this.props;

    draw_object_list.push(drawObjectNew);

    this.handleChange('draw_object_list', draw_object_list);
  }
  handleDrawFeatureClick = ({ index, nextState }) => {
    const { formState: { draw_object_list: draw_object_list_old = [] } } = this.props;
    const draw_object_list = cloneDeep(draw_object_list_old);

    draw_object_list[index].state = nextState;

    this.handleChange('draw_object_list', draw_object_list);
  }
  handleRemoveLastDrawFeature = () => {
    const { formState: { draw_object_list: draw_object_list_old = [] } } = this.props;
    const draw_object_list = cloneDeep(draw_object_list_old);
    draw_object_list.pop();

    this.handleChange('draw_object_list', draw_object_list);
  }

  handleChangeInfoObject = (field, value) => {
    const asuods_id = value;

    const {
      formState: {
        type_slug,
        object_list: object_list_old,
        info: info_old,
        elements: elements_old,
      },
      objectPropertyList = [],
    } = this.props;

    const {
      OBJECT_OPTIONS = [],
      dtPolys: dtPolysOld = {},
    } = this.state;

    const dtPolys = cloneDeep(dtPolysOld);

    const {
      name,
      id: object_id,
      label: object_address,
      total_area: info_total_area,
    } = OBJECT_OPTIONS.find(({ value: yard_id }) => yard_id === asuods_id) || {};

    if (!isEmpty(object_list_old)) {
      const [{ object_id: object_id_old }] = object_list_old;

      if (object_id_old === object_id) {
        return;
      }

      dtPolys[object_id_old].state = 1;
    }
    dtPolys[object_id].state = 2;

    const selectedObj = dtPolys[object_id];

    const changeObject = {
      asuods_id,
      name,
      elements: elements_old.map((d) => {
        const newD = { ...d };
        const { original_name } = objectPropertyList.find(({ object_property_id }) => object_property_id === d.id);
        newD.value = selectedObj.data[original_name];
        return newD;
      }),
      info: {
        ...info_old,
        total_area: info_total_area,
      },
      objectsType: getObjectsType(type_slug),
      object_list: [{
        name: object_address,
        object_id,
        state: dtPolys[object_id].state,
        type: type_slug,
      }],
    };

    this.setState({ selectedObj, dtPolys });
    this.props.handleMultiChange({ ...changeObject });
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
      isPermitted,
    } = this.props;

    const {
      OBJECT_OPTIONS = [],
      manual,
      showPercentForm,
      selectedObj,
      IS_CREATING,
      dtPolys = {},
    } = this.state;

    const {
      id,
      name,
      asuods_id,
      info: {
        total_area = null,
      } = {},
      objectsType,
      object_list: objectList,
      draw_object_list: drawObjectList,
    } = state;

    const title = IS_CREATING ? 'Создание карточки ДТ капитального ремонта.' : `Карточка ДТ капитального ремонта. Объект: ${name}. ID ${asuods_id}`;

    const CONTRACTOR_OPTIONS = contractorList.map(({ id: value, name: label }) => ({ value, label }));
    const buttonPercentProps = {
      className: !id ? undefined : 'active',
      disabled: !id,
      onClick: this.showPercentForm,
    };

    return (
      <Modal {...this.props} bsSize="lg" backdrop="static">
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
                disabled={!IS_CREATING || !isPermitted}
                clearable={false}
              />
            </Col>
          </Row>
          <div>
            <Row style={{ marginBottom: 20 }}>
              <Col md={12}>
                <span style={{ fontWeight: 600 }}>Информация об объекте</span>
              </Col>
              <Col md={6}>
                <Row>
                  <Col md={12}>
                    Общая площадь по паспорту, кв.м.: {total_area}
                  </Col>
                  <Col md={12}>
                    Площадь проезда, кв.м.: {0}
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    Площадь пешеходной дорожки, кв.м.: {0}
                  </Col>
                  <Col md={12}>
                    Площадь тротуаров, кв.м.: {0}
                  </Col>
                </Row>
              </Col>
              <Col md={6}>
                Заказчик {'-'}
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
                  disabled={!isPermitted}
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
                  disabled={!isPermitted}
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
                    <span>Дата осмотра</span>
                    <span>{moment(state.reviewed_at).format(`${global.APP_DATE_FORMAT} HH:mm`)}</span>
                  </div>
                </Col>
                <Col md={2} xsOffset={1}>
                  <Col md={12}>
                    <Button {...buttonPercentProps}>
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
                  isPermitted={!(!asuods_id || !isPermitted)}
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
                <Div hidden={!IS_CREATING && isEmpty(dtPolys)} >
                  <MapInfo
                    handleFeatureClick={this.handleFeatureClick}
                    manual={manual}
                    polys={dtPolys}
                    objectList={objectList}
                    objectsType={objectsType}
                    startDraw={this.startDraw}
                    drawObjectList={drawObjectList}
                    setManualOnTrue={this.setManualOnTrue}
                    setManualOnFalse={this.setManualOnFalse}
                    isPermitted={asuods_id && isPermitted && IS_CREATING}
                    isPermittedMap={IS_CREATING && isPermitted}
                    handleDrawFeatureAdd={this.handleDrawFeatureAdd}
                    handleDrawFeatureClick={this.handleDrawFeatureClick}
                    handleRemoveLastDrawFeature={this.handleRemoveLastDrawFeature}
                  />
                </Div>
              </Col>
            </Row>
          </div>
        </Div>
        <Div hidden={!showPercentForm}>
          <PercentModalList
            object_id={id}
            onHide={this.hidePercentForm}
            updateObjectData={this.props.updateObjectData}
          />
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

