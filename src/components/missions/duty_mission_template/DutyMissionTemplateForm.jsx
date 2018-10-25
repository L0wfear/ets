import * as React from 'react';
import connectToStores from 'flummox/connect';
import { Modal, Row, Col, Button } from 'react-bootstrap';
import { find } from 'lodash';

import ModalBody from 'components/ui/Modal';
import Field from 'components/ui/Field.jsx';
import Div from 'components/ui/Div.jsx';

import RouteInfo from '../../route/RouteInfo.jsx';
import RouteFormWrap from '../../route/RouteFormWrap.jsx';
import { DutyMissionForm } from '../duty_mission/DutyMissionForm.jsx';

const modalKey = 'duty_mission_template';

class MissionTemplateForm extends DutyMissionForm {
  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;
    const {
      employeesList = [],
      technicalOperationsList = [],
    } = this.props;

    const {
      routesList = [],
    } = this.state;

    const TECH_OPERATIONS = technicalOperationsList.map(({ id, name }) => ({ value: id, label: name }));
    const ROUTES = routesList
      .filter(route => !state.structure_id || route.structure_id === state.structure_id)
      .map(({ id, name }) => ({ value: id, label: name }));

    const IS_CREATING = true;

    let title = 'Задание';

    if (IS_CREATING) {
      title = 'Создание шаблона задания';
    }

    const currentStructureId = this.context.flux.getStore('session').getCurrentUser().structure_id;
    const STRUCTURES = this.context.flux.getStore('session').getCurrentUser().structures.map(({ id, name }) => ({ value: id, label: name }));

    const EMPLOYEES = employeesList.reduce((newArr, employee) => {
      if (employee.active && (!state.structure_id || (employee.company_structure_id === state.structure_id))) {
        return [
          ...newArr,
          {
            value: employee.id,
            label: `${employee.last_name || ''} ${employee.first_name || ''} ${employee.middle_name || ''}`,
          },
        ];
      }

      return [...newArr];
    }, []);
    let hasNotActiveEmployees = false;
    const FOREMANS = [...EMPLOYEES];
    if (state.foreman_id && !FOREMANS.some(({ value }) => value === state.foreman_id)) {
      const employee = this.props.employeesIndex[state.foreman_id] || {};

      FOREMANS.push({
        value: state.foreman_id,
        label: `${employee.last_name || ''} ${employee.first_name || ''} ${employee.middle_name || ''} (Неактивный сотрудник)`,
      });
      hasNotActiveEmployees = true;
    }

    const BRIGADES = [...EMPLOYEES];
    state.brigade_employee_id_list.forEach(({ id, employee_id }) => {
      const key = id || employee_id;
      if (!BRIGADES.some(({ value }) => value === key)) {
        const employee = this.props.employeesIndex[key] || {};

        BRIGADES.push({
          value: key,
          label: `${employee.last_name || ''} ${employee.first_name || ''} ${employee.middle_name || ''} (Неактивный сотрудник)`,
        });
        hasNotActiveEmployees = true;
      }
    });


    let STRUCTURE_FIELD_VIEW = false;
    let STRUCTURE_FIELD_READONLY = false;
    let STRUCTURE_FIELD_DELETABLE = false;

    if (currentStructureId !== null && STRUCTURES.length === 1 && currentStructureId === STRUCTURES[0].value) {
      STRUCTURE_FIELD_VIEW = true;
      STRUCTURE_FIELD_READONLY = true;
    } else if (currentStructureId !== null && STRUCTURES.length > 1 && find(STRUCTURES, el => el.value === currentStructureId)) {
      STRUCTURE_FIELD_VIEW = true;
    } else if (currentStructureId === null && STRUCTURES.length > 1) {
      STRUCTURE_FIELD_VIEW = true;
      STRUCTURE_FIELD_DELETABLE = true;
    }

    const route = this.state.selectedRoute;
    const brigade_employee_id_list = !state.brigade_employee_id_list
    ? []
    : state.brigade_employee_id_list.filter(b => b.id || b.employee_id).map(b => b.id || b.employee_id).join(',');

    return (
      <Modal {...this.props} id="modal-duty-missio-template" bsSize="large" backdrop="static">

        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>

        <ModalBody>

          <Row>
            <Col md={6}>
              <Field
                type="select"
                modalKey={modalKey}
                label="Технологическая операция"
                error={errors.technical_operation_id}
                options={TECH_OPERATIONS}
                disabled={!!state.route_id}
                value={state.technical_operation_id}
                onChange={this.handleTechnicalOperationChange.bind(this)}
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
                label="Бригадир"
                error={errors.foreman_id}
                disabled={false}
                options={FOREMANS}
                value={state.foreman_id}
                onChange={this.handleForemanIdChange}
              />
            </Col>
            <Col md={6}>
              <Field
                type="select"
                modalKey={modalKey}
                label="Бригада"
                error={errors.brigade_employee_id_list}
                multi
                disabled={false}
                options={BRIGADES}
                value={brigade_employee_id_list}
                onChange={this.handleBrigadeIdListChange}
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
                onChange={this.handleRouteIdChange.bind(this)}
                clearable
              />
              <Div hidden={state.route_id}>
                <Button onClick={this.createNewRoute.bind(this)} disabled={!state.technical_operation_id}>Создать новый</Button>
              </Div>
            </Col>
            {STRUCTURE_FIELD_VIEW && <Col md={6}>
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
                onChange={this.handleChangeStructureId}
              />
            </Col>}
          </Row>
          <Row>
            <Col md={12}>
              <Div hidden={route ? route.id == null : true} className="mission-form-map-wrapper">
                <RouteInfo route={this.state.selectedRoute} mapOnly />
              </Div>
            </Col>
          </Row>

        </ModalBody>

        <Modal.Footer>
          <Div hidden={state.status === 'closed'}>
            <Button onClick={this.handleSubmit.bind(this)} disabled={!this.props.canSave || hasNotActiveEmployees}>{'Сохранить'}</Button>
          </Div>
        </Modal.Footer>

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
