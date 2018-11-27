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
} from 'lodash';

import ModalBody from 'components/ui/Modal';
import Field from 'components/ui/Field';
import { ExtField } from 'components/ui/new/field/ExtField';
import Div from 'components/ui/Div';
import RouteInfo from 'components/route/route-info/RouteInfo';
import { DivNone } from 'global-styled/global-styled';
import RouteFormWrap from 'components/route/form/RouteFormWrap';
import { isEmpty } from 'utils/functions';
import InsideField from 'components/missions/mission_template/inside_fields/index';
import { MissionForm } from 'components/missions//mission/MissionForm/MissionForm';
import HiddenMapForPrint from 'components/missions/mission_template/print/HiddenMapForPrint';

import missionTemplatePermission from 'components/missions/mission_template/config-data/permissions';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';

const ButtonSaveMissionTemplate = withRequirePermissionsNew({
  permissions: missionTemplatePermission.update,
})(Button);


const modalKey = 'mission_template';

class MissionTemplateForm extends MissionForm {
  constructor(props) {
    super(props);

    this.state = {
      ...this.state,
      isTemplate: true,
    };
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
      && routes.find((item) => item.value === route.id) === undefined
    ) ? routes.concat([route]) : routes;

    const ROUTES = uniqBy(
      filteredRoutes.map(({ id, name }) => ({ value: id, label: name })),
      'value',
    );

    const CARS = carsList.map((c) => ({
      value: c.asuods_id,
      label: `${c.gov_number} [${c.special_model_name || ''}${c.special_model_name ? '/' : ''}${c.model_name || ''}${c.type_name ? '/' : ''}${c.type_name || ''}]`,
      type_id: c.type_id,
    }));

    const IS_CREATING = true;

    let title = 'Задание';

    if (IS_CREATING) {
      title = 'Создание шаблона задания';
    }

    return (
      <Modal id="modal-mission-template" show={this.props.show} onHide={this.props.onHide} bsSize="large" backdrop="static">

        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>

        <ModalBody>
          <Row>
            <Col md={STRUCTURE_FIELD_VIEW ? 9 : 12}>
              <Field
                type="select"
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
              <Field
                type="select"
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
                error={errors.municipal_facility_id}
                name={state.municipal_facility_name}
                value={state.municipal_facility_id}
                technical_operation_id={state.technical_operation_id}
                norm_id={state.norm_id}
                clearable={false}
                disabled={state.route_id}
                handleChange={this.handleChangeMF}
                technicalOperationsList={technicalOperationsList}
                getCleaningMunicipalFacilityList={this.context.flux.getActions('missions').getCleaningMunicipalFacilityList}
                typeIdWraomWaybill={this.props.fromWaybill ? state.type_id : null}
                getDataByNormatives={this.getDataByNormatives}
                alreadyDefineNormId={!IS_CREATING}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <ExtField
                type="select"
                modalKey={modalKey}
                label="Транспортное средство"
                error={errors.car_id}
                className="white-space-pre-wrap"
                options={CARS}
                disabled={isEmpty(state.technical_operation_id) || isEmpty(state.municipal_facility_id)}
                value={state.car_id}
                onChange={this.handleCarIdChange}
              />
              <Field
                type="number"
                label="Количество циклов"
                error={errors.passes_count}
                value={state.passes_count}
                onChange={this.handleChange.bind(this, 'passes_count')}
                min="0"
              />
            </Col>

            <Col md={6}>
              <Field
                type="string"
                label="Комментарий"
                value={state.comment}
                onChange={this.handleChange.bind(this, 'comment')}
                error={errors.comment}
              />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Field
                type="select"
                modalKey={modalKey}
                label="Маршрут"
                error={errors.route_id}
                options={ROUTES}
                value={state.route_id}
                disabled={!state.car_id}
                onChange={this.handleRouteIdChange}
                clearable
              />
              <Div hidden={state.route_id}>
                <Button onClick={this.createNewRoute} disabled={!state.technical_operation_id}>Создать новый</Button>
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
          onFormHide={this.onFormHide}
          showForm={this.state.showRouteForm}
          structureId={state.structure_id}
          fromMission
          available_route_types={available_route_types}
        />

      </Modal>
    );
  }
}

export default connectToStores(MissionTemplateForm, ['objects', 'employees', 'missions', 'routes', 'session']);
