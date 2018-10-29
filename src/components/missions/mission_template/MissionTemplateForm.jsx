import React from 'react';
import connectToStores from 'flummox/connect';
import { Modal, Row, Col, Button, Dropdown, Glyphicon, MenuItem } from 'react-bootstrap';
import ModalBody from 'components/ui/Modal';
import Field from 'components/ui/Field.jsx';
import Div from 'components/ui/Div.jsx';
import RouteInfo from 'components/route/RouteInfo.jsx';
import RouteFormWrap from 'components/route/RouteFormWrap.jsx';
import { isEmpty } from 'utils/functions';
import HiddenMapForPrint from 'components/missions/mission_template/print/HiddenMapForPrint';
import { MissionForm } from '../mission/MissionForm.jsx';


const modalKey = 'mission_template';

class MissionTemplateForm extends MissionForm {

  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;
    const { technicalOperationsList = [], routesList = [], carsList = [] } = this.state;

    const currentStructureId = this.context.flux.getStore('session').getCurrentUser().structure_id;
    const STRUCTURES = this.context.flux.getStore('session').getCurrentUser().structures.map(({ id, name }) => ({ value: id, label: name }));

    let STRUCTURE_FIELD_VIEW = false;
    let STRUCTURE_FIELD_READONLY = false;
    let STRUCTURE_FIELD_DELETABLE = false;

    if (currentStructureId !== null && STRUCTURES.length === 1 && currentStructureId === STRUCTURES[0].value) {
      STRUCTURE_FIELD_VIEW = true;
      STRUCTURE_FIELD_READONLY = true;
    } else if (currentStructureId !== null && STRUCTURES.length > 1 && _.find(STRUCTURES, el => el.value === currentStructureId)) {
      STRUCTURE_FIELD_VIEW = true;
    } else if (currentStructureId === null && STRUCTURES.length > 1) {
      STRUCTURE_FIELD_VIEW = true;
      STRUCTURE_FIELD_DELETABLE = true;
    }

    const TECH_OPERATIONS = technicalOperationsList.map(({ id, name }) => ({ value: id, label: name }));

    const ROUTES = routesList
      .filter(route => (
        (!state.structure_id || route.structure_id === state.structure_id) &&
        (route.technical_operation_id === state.technical_operation_id)
      ))
      .map(({ id, name }) => ({ value: id, label: name }));

    const CARS = carsList.map(c => ({
      value: c.asuods_id,
      label: `${c.gov_number} [${c.special_model_name || ''}${c.special_model_name ? '/' : ''}${c.model_name || ''}]`,
    }));

    const IS_CREATING = true;

    let title = 'Задание';

    if (IS_CREATING) {
      title = 'Создание шаблона задания';
    }

    const route = this.state.selectedRoute;

    return (
      <Modal {...this.props} id="modal-mission-template" bsSize="large" backdrop="static">

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
                value={state.technical_operation_id}
                onChange={this.handleTechnicalOperationChange.bind(this)}
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
                onChange={this.handleStructureIdChange.bind(this)}
              />
            </Col>}
          </Row>
          <Row>
            <Col md={6}>
              <Field
                type="select"
                modalKey={modalKey}
                label="Транспортное средство"
                error={errors.car_id}
                className="white-space-pre-wrap"
                options={CARS}
                disabled={isEmpty(state.technical_operation_id) || !CARS.length}
                value={state.car_id}
                onChange={this.handleChange.bind(this, 'car_id')}
              />
              <Field
                type="number"
                label="Количество проходов"
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
                disabled={!state.technical_operation_id}
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
            {
              state.id
              ? (
                <Dropdown id="waybill-print-dropdown" dropup onSelect={this.props.handlePrint}>
                  <Dropdown.Toggle>
                    <Glyphicon id="m-print" glyph="print" />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <MenuItem eventKey={3}>Формате А3</MenuItem>
                    <MenuItem eventKey={4}>Формате А4</MenuItem>
                  </Dropdown.Menu>
                </Dropdown>
              )
              : (
                <div className="none"></div>
              )
            }
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
        />

      </Modal>
    );
  }
}

export default connectToStores(MissionTemplateForm, ['objects', 'employees', 'missions', 'routes']);
