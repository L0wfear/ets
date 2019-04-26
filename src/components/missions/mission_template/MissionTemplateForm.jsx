import React from 'react';
import connectToStores from 'flummox/connect';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Col from 'react-bootstrap/lib/Col';
import * as Row from 'react-bootstrap/lib/Row';
import * as Button from 'react-bootstrap/lib/Button';
import * as Dropdown from 'react-bootstrap/lib/Dropdown';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';
import * as MenuItem from 'react-bootstrap/lib/MenuItem';

import {
  uniqBy,
  find,
  get,
} from 'lodash';

import ModalBody from 'components/ui/Modal';
import { ExtField } from 'components/ui/new/field/ExtField';
import Div from 'components/ui/Div';
import RouteInfo from 'components/new/pages/routes_list/route-info/RouteInfo';
import { DivNone } from 'global-styled/global-styled';
import RouteFormWrap from 'components/new/pages/routes_list/form/RouteFormWrap';
import { isEmpty } from 'utils/functions';
import InsideField from 'components/missions/mission_template/inside_fields/index';
import { MissionForm } from 'components/missions//mission/MissionForm/MissionForm';
import HiddenMapForPrint from 'components/missions/mission_template/print/HiddenMapForPrint';

import missionTemplatePermission from 'components/missions/mission_template/config-data/permissions';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';

import {
  getDataByNormatives,
  getDataBySelectedRoute,
  getRoutesByMissionId,
  getTechnicalOperationData,
  handleRouteFormHide,
  isOdhRouteTypePermitted,
} from 'components/missions/mission/MissionForm/utils';
import { isArray } from 'util';

const ButtonSaveMissionTemplate = withRequirePermissionsNew({
  permissions: missionTemplatePermission.update,
})(Button);

const modalKey = 'mission_template';

class MissionTemplateForm extends MissionForm {
  constructor(props) {
    super(props);

    this.state = {
      available_route_types: [],
      selectedRoute: null,
      showRouteForm: false,
      carsList: [],
      routesList: [],
      technicalOperationsList: [],
      columnPermittedTechOps: [],
      showColumnAssignment: false,
      isTemplate: true,
      firstFormState: {
        ...this.props.formState,
      },
    };
  }

  componentDidMount() {
    const { flux } = this.context;
    const technicalOperationsActions = flux.getActions('technicalOperation').getTechnicalOperations;
    const routesActions = flux.getActions('routes');
    const missionsActions = flux.getActions('missions').getMissionSources;

    const { formState } = this.props;

    Promise.all([
      getTechnicalOperationData(formState, this.props.template, this.props.fromOrder, this.props.fromWaybill, missionsActions, technicalOperationsActions),
      getDataBySelectedRoute(formState, routesActions.getRouteById),
      getRoutesByMissionId(formState, this.props.template, routesActions.getRoutesByMissionId, this.props.routesList),
    ])
      .then(([technicalOperationsData, selectedRoute, routesList]) => {
        this.setState({
          ...technicalOperationsData,
          selectedRoute,
          routesList,
          carsList: this.props.carsList,
        });
      });
  }

  handleRouteChange = (route_id) => {
    this.handleRouteIdChange(route_id);
  }

  handleRouteIdChange = async (route_id, fullRoute) => {
    const { flux } = this.context;
    if (route_id) {
      let route = fullRoute;
      if (!fullRoute) {
        route = await flux.getActions('routes').getRouteById(route_id, false);
      }
      this.setState({ selectedRoute: route });
    } else {
      this.setState({ selectedRoute: null });
    }

    this.props.handleMultiFormChange({
      route_id,
    });
  }

  handleCarIdChange = (value) => {
    const { formState } = this.props;

    const car_ids = isArray(value) ? value : [value];

    if (car_ids !== formState.car_ids) {
      this.props.handleMultiFormChange({
        car_ids,
      });

      this.handleRouteIdChange(null);
    }
  }

  handleColumnFlag = (e) => {
    const for_column = get(e, ['target', 'checked']);

    const {
      formState: {
        car_ids,
      },
    } = this.props;

    this.props.handleMultiFormChange({
      car_ids: car_ids ? car_ids.slice(0, 1) : [],
      for_column,
    });
  }

  handleTechnicalOperationChange = (technical_operation_id) => {
    this.props.handleMultiFormChange({
      technical_operation_id,
      municipal_facility_id: null,
      for_column: false,
      car_ids: [],
    });

    this.handleRouteIdChange(null);
  }

  handleChangeMF = (name, value) => {
    this.handleChange(name, value);
    if (!this.props.fromWaybill) {
      this.handleChange('car_ids', []);
    }
    this.handleRouteIdChange(null);
  }

  handleStructureIdChange = (structure_id) => {
    const changesObj = {
      structure_id,
    };

    const car = this.props.carsIndex[this.props.formState.car_ids]; // посмотреть
    if (!structure_id) {
      if (car && !car.is_common) {
        this.handleChange('car_ids', []);
      }
    } else {
      if (car && structure_id !== car.company_structure_id) {
        changesObj.car_ids = [];
      }
      if (this.state.selectedRoute && structure_id !== this.state.selectedRoute.structure_id) {
        this.handleRouteIdChange(null);
      }
    }

    this.props.handleMultiFormChange(changesObj);
  }

  createNewRoute = () => {
    this.setState({
      showRouteForm: true,
      selectedRoute: {
        is_main: true,
        name: '',
        municipal_facility_id: this.props.formState.municipal_facility_id,
        municipal_facility_name: '',
        technical_operation_id: this.props.formState.technical_operation_id,
        technical_operation_name: '',
        structure_id: this.props.formState.structure_id,
        structure_name: '',
        type: null,
        object_list: [],
        input_lines: [],
        draw_object_list: [],
      },
    });
  }

  onFormHide = (isSubmitted, route) => {
    const { flux } = this.context;
    const routesActions = flux.getActions('routes');
    const { formState } = this.props;

    if (isSubmitted) {
      handleRouteFormHide(
        formState,
        this.state,
        routesActions.getRoutesBySomeData,
      ).then((ans) => {
        this.setState({ ...ans });
      });

      this.handleRouteIdChange(route.id);
    }

    this.setState({ showRouteForm: false });
  }

  getDataByNormatives = (normatives) => {
    const { formState } = this.props;

    const trigger = (
      !formState.normatives
      || normatives.some(({ id }) => (
        !formState.normatives.find(({ id: formStateNormativeId }) => (
          id === formStateNormativeId
        ))
      ))
      || formState.can_edit_car_and_route
    );

    if (trigger) {
      const { flux } = this.context;
      const { fromWaybill } = this.props;

      return getDataByNormatives(
        normatives,
        this.state.kind_task_ids,
        formState,
        fromWaybill,
        flux.getActions('technicalOperation').getTechOperationsByNormIds,
        flux.getActions('routes').getRoutesBySomeData,
        flux.getActions('cars').getCarsByNormIds,
      ).then((newStateData) => {
        const changesObj = {
          normatives,
        };

        this.props.handleMultiFormChange(changesObj);

        this.setState(({ carsList }) => ({
          ...newStateData,
          carsList: newStateData.carsList || carsList,
        }));
      });
    }

    return Promise.resolve(false);
  }

  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;
    const {
      TECH_OPERATIONS,
      technicalOperationsList = [],
      routesList = [],
      carsList = [],
      selectedRoute: route = null,
      available_route_types = [],
    } = this.state;

    const currentStructureId = this.context.flux.getStore('session').getCurrentUser().structure_id;
    const STRUCTURES = this.context.flux.getStore('session').getCurrentUser().structures.map(({ id, name }) => ({ value: id, label: name }));

    let STRUCTURE_FIELD_VIEW = false;
    let STRUCTURE_FIELD_READONLY = false;
    let STRUCTURE_FIELD_DELETABLE = false;

    if (currentStructureId !== null && STRUCTURES.length === 1 && currentStructureId === STRUCTURES[0].value) { // когда пользователь привязан к конкретному подразделению
      STRUCTURE_FIELD_VIEW = true;
      STRUCTURE_FIELD_READONLY = true;
    } else if (currentStructureId !== null && STRUCTURES.length > 1 && find(STRUCTURES, el => el.value === currentStructureId)) {
      STRUCTURE_FIELD_VIEW = true;
    } else if (currentStructureId === null && STRUCTURES.length > 0) {
      STRUCTURE_FIELD_VIEW = true;
      STRUCTURE_FIELD_DELETABLE = true;
    }

    const routes = routesList.filter(r => (!state.structure_id || r.structure_id === state.structure_id));

    const filteredRoutes = (
      route !== null
      && route.id !== undefined
      && routes.find(item => item.value === route.id) === undefined
    ) ? routes.concat([route]) : routes;

    const ROUTES = uniqBy(
      filteredRoutes.map(({ id, name }) => ({ value: id, label: name })),
      'value',
    );

    const CARS = carsList.map(c => ({
      value: c.asuods_id,
      label: `${c.gov_number} [${c.model_name || ''}${c.model_name ? '/' : ''}${c.special_model_name || ''}${c.type_name ? '/' : ''}${c.type_name || ''}]`,
      type_id: c.type_id,
    }));

    const IS_CREATING = true;

    let title = 'Задание';

    if (IS_CREATING) {
      title = 'Создание шаблона задания';
    }

    const columnFlagDisability = (
      isEmpty(state.technical_operation_id)
      || isEmpty(state.municipal_facility_id)
      || !isOdhRouteTypePermitted(this.state.available_route_types)
    );

    return (
      <Modal id="modal-mission-template" show={this.props.show} onHide={this.props.onHide} bsSize="large" backdrop="static">

        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>

        <ModalBody>
          <Row>
            <Col md={STRUCTURE_FIELD_VIEW ? 9 : 12}>
              <ExtField
                type="select"
                id="technical_operation_id"
                modalKey={modalKey}
                label="Технологическая операция"
                error={errors.technical_operation_id}
                options={TECH_OPERATIONS}
                clearable={false}
                value={state.technical_operation_id}
                onChange={this.handleTechnicalOperationChange}
              />
            </Col>
            {STRUCTURE_FIELD_VIEW && (
            <Col md={3}>
              <ExtField
                type="select"
                id="structure_id"
                modalKey={modalKey}
                label="Подразделение"
                error={errors.structure_id}
                disabled={STRUCTURE_FIELD_READONLY}
                clearable={STRUCTURE_FIELD_DELETABLE}
                options={STRUCTURES}
                emptyValue={null}
                value={state.structure_id}
                onChange={this.handleStructureIdChange}
              />
            </Col>
            )}
          </Row>
          <Row>
            <Col md={12}>
              <InsideField.MunicipalFacility
                modalKey={modalKey}
                id="municipal_facility_id"
                error={errors.municipal_facility_id}
                name={state.municipal_facility_name}
                value={state.municipal_facility_id}
                technical_operation_id={state.technical_operation_id}
                clearable={false}
                disabled={state.route_id}
                handleChange={this.handleChangeMF}
                technicalOperationsList={technicalOperationsList}
                getCleaningMunicipalFacilityList={this.context.flux.getActions('missions').getCleaningMunicipalFacilityList}
                getDataByNormatives={this.getDataByNormatives}
                alreadyDefineNormId={!IS_CREATING}
              />
            </Col>
          </Row>
          <Row>
            <Col md={8}>
              <ExtField
                type="select"
                id="car_ids"
                modalKey={modalKey}
                label="Транспортное средство"
                error={errors.car_ids}
                className="white-space-pre-wrap"
                options={CARS}
                disabled={isEmpty(state.technical_operation_id) || isEmpty(state.municipal_facility_id)}
                multi={state.for_column}
                value={state.for_column ? state.car_ids : state.car_ids[0]}
                onChange={this.handleCarIdChange}
              />
            </Col>
            <Col md={4}>
              <ExtField
                id="for_column"
                type="boolean"
                className="checkbox-input flex-reverse column_checkbox"
                label="Создать шаблон задания на колонну"
                disabled={columnFlagDisability}
                value={state.for_column}
                onChange={this.handleColumnFlag}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <ExtField
                type="number"
                modalKey={modalKey}
                id="passes_count"
                label="Количество циклов"
                error={errors.passes_count}
                value={state.passes_count}
                onChange={this.handleChange}
                boundKeys="passes_count"
                min="0"
              />
            </Col>
            <Col md={6}>
              <ExtField
                id="comment"
                type="string"
                modalKey={modalKey}
                label="Комментарий"
                value={state.comment}
                onChange={this.handleChange}
                error={errors.comment}
                boundKeys="comment"
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <ExtField
                type="select"
                id="route_id"
                modalKey={modalKey}
                label="Маршрут"
                error={errors.route_id}
                options={ROUTES}
                value={state.route_id}
                disabled={!state.car_ids.length}
                onChange={this.handleRouteChange}
                clearable
              />
              <Div hidden={state.route_id}>
                <Button id="mt-create-route" onClick={this.createNewRoute} disabled={!state.municipal_facility_id}>Создать новый</Button>
              </Div>
            </Col>
            <Col md={6}>
              {
                route && route.id !== null
                  ? (
                    <RouteInfo
                      route={route}
                      noRouteName
                      mapKey="mapMissionTemplateFrom"
                    />
                  )
                  : (
                    <DivNone />
                  )
              }
            </Col>
          </Row>

        </ModalBody>

        <Modal.Footer>
          <Div className="text-right-flex">
            {
              state.id
                ? (
                  <Dropdown id="waybill-print-dropdown" dropup onSelect={this.props.handlePrint}>
                    <Dropdown.Toggle>
                      <Glyphicon id="m-print" glyph="print" />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <MenuItem eventKey={this.props.printMapKeyBig}>Формате А3</MenuItem>
                      <MenuItem eventKey={this.props.printMapKeySmall}>Формате А4</MenuItem>
                    </Dropdown.Menu>
                  </Dropdown>
                )
                : (
                  <DivNone />
                )
            }
            <Div hidden={state.status === 'closed'}>
              <ButtonSaveMissionTemplate onClick={this.handleSubmit} disabled={!this.props.canSave}>Сохранить</ButtonSaveMissionTemplate>
            </Div>
          </Div>


        </Modal.Footer>
        <HiddenMapForPrint
          route={route}
          printMapKeyBig={this.props.printMapKeyBig}
          printMapKeySmall={this.props.printMapKeySmall}
        />
        <RouteFormWrap
          element={route}
          showForm={this.state.showRouteForm}
          handleHide={this.onFormHide}
          hasMissionStructureId={!!state.structure_id}
          missionAvailableRouteTypes={state.for_column ? available_route_types.filter(type => type === 'mixed') : available_route_types}
          fromMission
        />

      </Modal>
    );
  }
}

export default connectToStores(MissionTemplateForm, ['objects', 'employees', 'missions', 'session']);
