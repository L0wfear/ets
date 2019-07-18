import React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';

import connectToStores from 'flummox/connect';
import moment from 'moment';
import { cloneDeep, keyBy, isEmpty } from 'lodash';

import {
  OBJ_TAB_INDEX,
  ELEMENT_NULL_OBJECT,
} from 'components/program_registry/UpdateFrom/inside_components/program_object/ProgramObjectFormDT.h';

import { tabable } from 'components/compositions/hoc';

import UNSAFE_Form from 'components/compositions/UNSAFE_Form';

import Div from 'components/ui/Div';
import { ExtField } from 'components/ui/new/field/ExtField';
import ModalBody from 'components/ui/Modal';

import TabInfo from 'components/program_registry/UpdateFrom/inside_components/program_object/tabs/TabInfo';
import MapInfo from 'components/program_registry/UpdateFrom/inside_components/program_object/tabs/MapInfo';

import { PercentModalList } from 'components/program_registry/UpdateFrom/inside_components/program_object/inside_components';
import {
  SpanContractor,
  PanelObjectInfo,
} from 'components/program_registry/UpdateFrom/inside_components/program_object/styled/styled';
import { compose } from 'redux';
import { connect } from 'react-redux';
import geoobjectActions from 'redux-main/reducers/modules/geoobject/actions';
import { getGeoobjectState } from 'redux-main/reducers/selectors';
import { polyState } from 'constants/polygons';
import memoizeOne from 'memoize-one';

const getObjectsType = (slug) => {
  switch (slug) {
    case 'dt':
      return 'simple_dt';
    case 'mixed':
      return 'mixed';
    default:
      return 'simple_dt';
  }
};
const log = {};

const makeSelector = memoizeOne((dtPolys) =>
  Object.entries(dtPolys).reduce((newObj, [key, data]) => {
    newObj[key] = {
      ...data,
      state: polyState.ENABLE,
    };

    return newObj;
  }, {}),
);

class ProgramObjectFormDT extends UNSAFE_Form {
  static defaultProps = {
    tabKey: OBJ_TAB_INDEX.PLAN,
  };

  constructor(props) {
    super(props);

    this.state = {
      manual: false,
      showPercentForm: false,
      selectedObj: {},
      IS_CREATING: !props.formState.id,
      polys: {},
      VERSIONS_OPTIONS: [],
    };
  }

  async componentDidMount() {
    const { IS_CREATING } = this.state;

    this.context.flux
      .getActions('repair')
      .getObjectProperty({ object_type: 'dt' })
      .then(({ data: { result: { rows: objectPropertyList } } }) => {
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
          changesState.OBJECT_OPTIONS = Object.values(changesState.dtPolys).map(
            ({
              yard_id: value,
              object_address: label,
              total_area,
              id,
              name,
            }) => ({
              value,
              label,
              total_area,
              id,
              name,
            }),
          );

          const { id: object_id }
            = changesState.OBJECT_OPTIONS.find(
              ({ value: yard_id }) => yard_id === asuods_id,
            ) || {};

          changesState.selectedObj = changesState.dtPolys[object_id];

          changesFormState.elements = elements.map((d) => ({
            ...d,
            measure_unit_name: (
              objectPropertyList.find(
                ({ id }) => id === d.object_property_id,
              ) || {}
            ).measure_unit_name,
          }));
          this.props.handleMultiChange({ ...changesFormState });
          this.setState({ ...changesState });
        } else {
          this.props.actionGetGetDt().then(({ dtList: data }) => {
            const changesState = { manual };
            changesState.dtPolys = makeSelector(keyBy(data, 'yard_id'));

            changesState.OBJECT_OPTIONS = Object.values(
              changesState.dtPolys,
            ).map(
              ({
                yard_id: value,
                object_address: label,
                total_area,
                id,
                name,
                company_name,
              }) => ({
                value,
                label,
                company_name,
                total_area,
                id,
                name,
              }),
            );

            this.setState({ ...changesState });
          });
        }
      });

    if (!IS_CREATING) {
      this.context.flux
        .getActions('repair')
        .getObjectVersions(this.props.formState.id)
        .then((ans) =>
          this.setState({
            VERSIONS_OPTIONS: ans.map(
              ({ object_id, program_version_id }, index) => ({
                value: object_id,
                label: `Версия №${index}`,
                object_id,
                program_version_id,
              }),
            ),
          }),
        );
    }
  }

  handleChangeVersion = (value, versionAllData) =>
    this.props.changeVersionWithObject(versionAllData);

  setManualOnFalse = () => {
    const {
      formState: { draw_object_list = [] },
    } = this.props;
    const { dtPolys: dtPolysOld } = this.props;
    const {
      object_list,
      object_list: [selectedShape],
    } = log;

    const dtPolys = cloneDeep(dtPolysOld);

    dtPolys[selectedShape.object_id].state = selectedShape.state;

    log.draw_object_list = cloneDeep(draw_object_list);

    this.props.handleMultiChange({
      draw_object_list,
      object_list,
      objectsType: log.objectsType,
    });
    this.setState({ manual: false, dtPolys });
  };

  setManualOnTrue = () => {
    const {
      formState: {
        objectsType,
        object_list,
        object_list: [selectedShape],
      },
    } = this.props;
    const { dtPolys: dtPolysOld } = this.state;

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
  };

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
        const {
          formState: { draw_object_list },
        } = this.props;

        plan_shape_json.dtPolys = dtPolys;
        plan_shape_json.draw_object_list = draw_object_list;
      } else {
        const {
          formState: {
            object_list,
            object_list: [selectedShape],
          },
        } = this.props;
        const { object_id } = selectedShape;

        plan_shape_json.dtPolys = { [object_id]: dtPolys[object_id] };
        plan_shape_json.object_list = object_list;
      }
      this.handleChange('plan_shape_json', plan_shape_json);
    }
    return new Promise(() => this.handleSubmit());
  };

  handleFeatureClick = ({ id: object_id }) => {
    const { dtPolys } = this.state;
    const { yard_id: asuods_id } = dtPolys[object_id];

    this.handleChangeInfoObject('asuods_id', asuods_id);
  };

  startDraw = () => {
    this.handleChange('draw_object_list', []);
  };

  handleAddDrawLines = (drawObjectNew) => {
    const {
      formState: { draw_object_list = [] },
    } = this.props;

    draw_object_list.push(...drawObjectNew);

    this.handleChange('draw_object_list', draw_object_list);
  };

  handleDrawFeatureClick = ({ index, state }) => {
    const {
      formState: { draw_object_list: draw_object_list_old = [] },
    } = this.props;
    const draw_object_list = cloneDeep(draw_object_list_old);

    draw_object_list[index].state = state;

    this.handleChange('draw_object_list', draw_object_list);
  };

  handleRemoveLastDrawFeature = () => {
    const {
      formState: { draw_object_list: draw_object_list_old = [] },
    } = this.props;
    const draw_object_list = cloneDeep(draw_object_list_old);
    draw_object_list.pop();

    this.handleChange('draw_object_list', draw_object_list);
  };

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

    const { dtPolys: dtPolysOld = {} } = this.state;

    const { OBJECT_OPTIONS = [] } = this.state;

    const dtPolys = cloneDeep(dtPolysOld);

    const {
      name,
      id: object_id,
      label: object_address,
      total_area: info_total_area,
      company_name: info_company_name,
    }
      = OBJECT_OPTIONS.find(({ value: yard_id }) => yard_id === asuods_id) || {};

    if (!isEmpty(object_list_old)) {
      const [{ object_id: object_id_old }] = object_list_old;

      if (object_id_old === object_id) {
        return;
      }

      dtPolys[object_id_old].state = polyState.ENABLE;
    }

    dtPolys[object_id].state = polyState.SELECTED;

    const selectedObj = dtPolys[object_id];

    const changeObject = {
      asuods_id,
      name,
      elements: elements_old.map((d) => {
        const newD = { ...d };
        const { original_name } = objectPropertyList.find(
          ({ object_property_id }) => object_property_id === d.id,
        );
        newD.value = selectedObj[original_name];
        return newD;
      }),
      info: {
        ...info_old,
        total_area: info_total_area,
        company_name: info_company_name,
      },
      objectsType: getObjectsType(type_slug),
      object_list: [
        {
          name: object_address,
          object_id,
          state: dtPolys[object_id].state,
          type: type_slug,
        },
      ],
      draw_object_list: [],
    };

    this.setState({ selectedObj, dtPolys, manual: false });
    this.props.handleMultiChange({ ...changeObject });
  };

  pushElement = () => {
    this.handleChange('elements', [
      ...this.props.formState.elements,
      { ...ELEMENT_NULL_OBJECT },
    ]);
  };

  render() {
    const {
      formState: state,
      formErrors: errors,
      tabKey,
      contractorList = [],
      isPermitted: isPermittedDefault,
      isPermittedByStatus,
      prCompanyName,
    } = this.props;

    const {
      OBJECT_OPTIONS = [],
      manual,
      showPercentForm,
      selectedObj,
      IS_CREATING,
      dtPolys = {},
      VERSIONS_OPTIONS = [],
    } = this.state;

    const {
      id,
      name,
      asuods_id,
      info: { total_area = null, company_name = null } = {},
      objectsType,
      object_list: objectList,
      draw_object_list: drawObjectList,
    } = state;

    const title = IS_CREATING
      ? 'Создание карточки ДТ капитального ремонта.'
      : `Карточка ДТ капитального ремонта. Объект: ${name}. ID ${asuods_id}`;
    const isPermitted = isPermittedDefault && isPermittedByStatus;

    const CONTRACTOR_OPTIONS = contractorList.map(
      ({ id: value, name: label }) => ({ value, label }),
    );

    return (
      <EtsBootstrap.ModalContainer
        id="modal-program-object-dt"
        show={this.props.show}
        onHide={this.props.onHide}
        bsSize="large">
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>{title}</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBody style={{ padding: 15 }}>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={6}>
              <ExtField
                type="select"
                label="Наименование ДТ"
                error={errors.asuods_id}
                options={OBJECT_OPTIONS}
                value={state.asuods_id}
                onChange={this.handleChangeInfoObject}
                boundKeys="asuods_id"
                disabled={!IS_CREATING || !isPermitted}
                clearable={false}
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col mdOffset={3} md={3}>
              <ExtField
                hidden={!state.id}
                type="select"
                label="Версия"
                options={VERSIONS_OPTIONS}
                onChange={this.handleChangeVersion}
                value={state.id}
                clearable={false}
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          <div>
            <EtsBootstrap.Row style={{ marginBottom: 20 }}>
              <EtsBootstrap.Col md={12}>
                <PanelObjectInfo>
                  <EtsBootstrap.Col md={12}>
                    <span style={{ fontWeight: 600 }}>
                      Информация об объекте
                    </span>
                  </EtsBootstrap.Col>
                  <EtsBootstrap.Col md={4}>
                    <EtsBootstrap.Col md={12}>
                      <span>{`Общая площадь по паспорту, кв.м.: ${Number(
                        total_area,
                      )}`}</span>
                    </EtsBootstrap.Col>
                    <EtsBootstrap.Col md={12}>
                      <span>{`Площадь пешеходной дорожки, кв.м.: ${0}`}</span>
                    </EtsBootstrap.Col>
                  </EtsBootstrap.Col>
                  <EtsBootstrap.Col md={4}>
                    <EtsBootstrap.Col md={12}>
                      <span>{`Площадь проезда, кв.м.: ${0}`}</span>
                    </EtsBootstrap.Col>
                    <EtsBootstrap.Col md={12}>
                      <span>{`Площадь тротуара, кв.м.: ${0}`}</span>
                    </EtsBootstrap.Col>
                  </EtsBootstrap.Col>
                  <EtsBootstrap.Col md={4}>
                    <EtsBootstrap.Col md={12}>
                      <span>{`Заказчик: ${company_name
                        || prCompanyName}`}</span>
                    </EtsBootstrap.Col>
                  </EtsBootstrap.Col>
                </PanelObjectInfo>
              </EtsBootstrap.Col>
            </EtsBootstrap.Row>
            <EtsBootstrap.Row>
              <EtsBootstrap.Col md={12}>
                <EtsBootstrap.Panel>
                  <EtsBootstrap.Col
                    md={12}
                    style={{ fontWeight: 600, marginBottom: 5 }}>
                    <span>Подрядчик</span>
                  </EtsBootstrap.Col>
                  <div>
                    <EtsBootstrap.Col md={2}>
                      <SpanContractor>Номер контракта</SpanContractor>
                    </EtsBootstrap.Col>
                    <EtsBootstrap.Col md={3}>
                      <ExtField
                        type="string"
                        value={state.contract_number}
                        error={errors.name}
                        onChange={this.handleChange}
                        boundKeys="contract_number"
                        disabled={!isPermitted}
                      />
                    </EtsBootstrap.Col>
                    <EtsBootstrap.Col mdOffset={2} md={1}>
                      <SpanContractor>Подрядчик</SpanContractor>
                    </EtsBootstrap.Col>
                    <EtsBootstrap.Col
                      style={{ position: 'relative', top: -20 }}
                      md={4}>
                      <ExtField
                        type="select"
                        error={errors.contractor_id}
                        options={CONTRACTOR_OPTIONS}
                        value={state.contractor_id}
                        onChange={this.handleChange}
                        boundKeys="contractor_id"
                        disabled={!isPermitted}
                      />
                    </EtsBootstrap.Col>
                  </div>
                </EtsBootstrap.Panel>
              </EtsBootstrap.Col>
            </EtsBootstrap.Row>
            <EtsBootstrap.Nav
              style={{ marginBottom: 20 }}
              bsStyle="tabs"
              activeKey={tabKey}
              onSelect={this.props.handleTabSelect}
              id="refs-car-tabs">
              <EtsBootstrap.NavItem eventKey={OBJ_TAB_INDEX.PLAN}>
                План
              </EtsBootstrap.NavItem>
              <EtsBootstrap.NavItem eventKey={OBJ_TAB_INDEX.FACT}>
                Факт
              </EtsBootstrap.NavItem>
            </EtsBootstrap.Nav>
            <Div hidden={tabKey !== OBJ_TAB_INDEX.FACT}>
              <EtsBootstrap.Row style={{ marginBottom: 20 }}>
                <EtsBootstrap.Col md={3}>
                  <div className="pr-object-data">
                    <span>Процент выполнения</span>
                    <span>{state.percent}</span>
                  </div>
                </EtsBootstrap.Col>
                <EtsBootstrap.Col md={3}>
                  <div className="pr-object-data">
                    <span>Дата осмотра</span>
                    <span>
                      {state.reviewed_at
                        ? moment(state.reviewed_at).format(
                          `${global.APP_DATE_FORMAT} ${global.APP_TIME_FORMAT}`,
                        )
                        : '---'}
                    </span>
                  </div>
                </EtsBootstrap.Col>
                <EtsBootstrap.Col md={2} xsOffset={1}>
                  <EtsBootstrap.Col md={12}>
                    <EtsBootstrap.Button
                      className={!id ? undefined : 'active'}
                      disabled={!id}
                      onClick={this.showPercentForm}>
                      <div style={{ width: 200, textAlign: 'center' }}>%</div>
                    </EtsBootstrap.Button>
                  </EtsBootstrap.Col>
                </EtsBootstrap.Col>
              </EtsBootstrap.Row>
            </Div>
            <EtsBootstrap.Row>
              <EtsBootstrap.Col md={7}>
                <TabInfo
                  isPermitted={!(!asuods_id || !isPermitted)}
                  isPermittetForObjectFact={
                    !(!asuods_id || !this.props.isPermittetForObjectFact)
                  }
                  whatSelectedTab={tabKey}
                  state={state}
                  errors={errors}
                  objectList={dtPolys}
                  handleChange={this.handleChange}
                  pushElement={this.pushElement}
                  selectedObj={selectedObj}
                />
              </EtsBootstrap.Col>
              <EtsBootstrap.Col md={5}>
                <Div hidden={!IS_CREATING && isEmpty(dtPolys)}>
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
                    handleAddDrawLines={this.handleAddDrawLines}
                    handleDrawFeatureClick={this.handleDrawFeatureClick}
                    handleRemoveLastDrawFeature={
                      this.handleRemoveLastDrawFeature
                    }
                  />
                </Div>
              </EtsBootstrap.Col>
            </EtsBootstrap.Row>
          </div>
        </ModalBody>
        {showPercentForm && (
          <PercentModalList
            object_id={id}
            onHide={this.hidePercentForm}
            updateObjectData={this.props.updateObjectData}
            isPermittedByStatus={isPermittedByStatus}
          />
        )}
        <EtsBootstrap.ModalFooter>
          <EtsBootstrap.Button
            disabled={!this.props.canSave}
            onClick={isPermitted ? this.handleSubmitWrap : this.props.onHide}>
            {isPermitted ? 'Сохранить' : 'Закрыть'}
          </EtsBootstrap.Button>
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  }
}

export default compose(
  tabable,
  connect(
    (state) => ({
      dtPolys: makeSelector(getGeoobjectState(state).dtPolys),
    }),
    (dispatch) => ({
      actionGetGetDt: () =>
        dispatch(
          geoobjectActions.actionGetAndSetInStoreDt(null, {
            page: null,
            path: null,
          }),
        ),
    }),
  ),
)(connectToStores(ProgramObjectFormDT, ['repair']));
