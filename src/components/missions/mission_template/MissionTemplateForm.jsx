import React from 'react';
import connectToStores from 'flummox/connect';
import { Modal, Row, Col, Button, Dropdown, Glyphicon, MenuItem } from 'react-bootstrap';
import {
  uniqBy,
} from 'lodash';

import { checkRouteByNew } from 'components/missions/utils/utils.ts';

import ModalBody from 'components/ui/Modal';
import Field, { ExtField } from 'components/ui/Field.jsx';
import Div from 'components/ui/Div.jsx';
import RouteInfo from 'components/route/RouteInfo.jsx';
import RouteFormWrap from 'components/route/RouteFormWrap.jsx';
import { isEmpty } from 'utils/functions';
import InsideField from 'components/missions/mission_template/inside_fields/index';
import { MissionForm } from 'components/missions//mission/MissionForm/MissionForm.jsx';
import HiddenMapForPrint from 'components/missions/mission_template/print/HiddenMapForPrint';


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
    } else if (currentStructureId !== null && STRUCTURES.length > 1 && _.find(STRUCTURES, el => el.value === currentStructureId)) {
      STRUCTURE_FIELD_VIEW = true;
    } else if (currentStructureId === null && STRUCTURES.length > 0) {
      STRUCTURE_FIELD_VIEW = true;
      STRUCTURE_FIELD_DELETABLE = true;
    }

    const routes = routesList.filter(r => (!state.structure_id || r.structure_id === state.structure_id) && checkRouteByNew(state, r, available_route_types));

    const filteredRoutes = (
      route !== null &&
      route.id !== undefined &&
      routes.find(item => item.value === route.id) === undefined
    ) ? routes.concat([route]) : routes;

    const ROUTES = uniqBy(
      filteredRoutes.map(({ id, name }) => ({ value: id, label: name })),
      'value',
    );

    const CARS = carsList.map(c => ({
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
            {STRUCTURE_FIELD_VIEW && <Col md={3}>
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
            </Col>}
          </Row>
          <Row>
            <Col md={12}>
              <InsideField.MunicipalFacility
                id={'municipal_facility_id'}
                label={'municipal_facility_name'}
                errors={errors}
                state={state}
                clearable={false}
                disabled={!!state.route_id}
                handleChange={this.handleChangeMF}
                getDataByNormatives={this.getDataByNormatives}
                technicalOperationsList={technicalOperationsList}
                getNormIdFromState={!IS_CREATING}
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
                onChange={this.handleChange.bind(this, 'passes_count')} min="0"
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
                <Button onClick={this.createNewRoute.bind(this)} disabled={!state.technical_operation_id}>Создать новый</Button>
              </Div>
            </Col>
            <Col md={6}>
              <Div hidden={route ? route.id == null : true} className="mission-form-map-wrapper">
                <RouteInfo route={this.state.selectedRoute} mapOnly />
              </Div>
            </Col>
          </Row>

        </ModalBody>

        <Modal.Footer>
          <Div className="text-right-flex">
            <Dropdown id="waybill-print-dropdown" dropup disabled={!state.id} onSelect={this.props.handlePrint}>
              <Dropdown.Toggle>
                <Glyphicon id="m-print" glyph="print" />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <MenuItem eventKey={3}>Формате А3</MenuItem>
                <MenuItem eventKey={4}>Формате А4</MenuItem>
              </Dropdown.Menu>
            </Dropdown>
            <Div hidden={state.status === 'closed'}>
              <Button onClick={this.handleSubmit.bind(this)} disabled={!this.props.canSave}>{'Сохранить'}</Button>
            </Div>
          </Div>

          
        </Modal.Footer>
        <HiddenMapForPrint printFormat={this.props.printFormat} route={this.state.selectedRoute} keyGlobal={this.props.keyGlobal} />

        <RouteFormWrap
          element={route}
          onFormHide={this.onFormHide.bind(this)}
          showForm={this.state.showRouteForm}
          structureId={state.structure_id}
          fromMission
          available_route_types={available_route_types}
        />

      </Modal>
    );
  }
}

export default connectToStores(MissionTemplateForm, ['objects', 'employees', 'missions', 'routes']);
