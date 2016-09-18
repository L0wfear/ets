import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import { Modal, Row, Col, Button } from 'react-bootstrap';
import Field from 'components/ui/Field.jsx';
import Div from 'components/ui/Div.jsx';
import RouteInfo from '../../route/RouteInfo.jsx';
import RouteFormWrap from '../../route/RouteFormWrap.jsx';
import { DutyMissionForm } from '../duty_mission/DutyMissionForm.jsx';

class MissionTemplateForm extends DutyMissionForm {

  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;
    const { technicalOperationsList = [], routesList = [] } = this.state;

    const TECH_OPERATIONS = technicalOperationsList.map(({ id, name }) => ({ value: id, label: name }));
    const ROUTES = routesList.map(({ id, name }) => ({ value: id, label: name }));

    console.log('form state is ', state);

    const IS_CREATING = true;

    let title = 'Задание';

    if (IS_CREATING) {
      title = 'Создание шаблона задания';
    }

    const route = this.state.selectedRoute;

    return (
      <Modal {...this.props} bsSize="large" backdrop="static">

        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>

          <Row>
            <Col md={6}>
              <Field type="select" label="Технологическая операция" error={errors.technical_operation_id}
                options={TECH_OPERATIONS}
                disabled={!!state.route_id}
                value={state.technical_operation_id}
                onChange={this.handleTechnicalOperationChange.bind(this)}
              />
            </Col>

            <Col md={6}>
              <Field type="string" label="Комментарий" value={state.comment} onChange={this.handleChange.bind(this, 'comment')} error={errors.comment} />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Field type="select" label="Маршрут" error={errors.route_id}
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
            <Col md={6}>
              <Div hidden={this.state.selectedRoute === null} className="mission-form-map-wrapper">
                <RouteInfo route={this.state.selectedRoute} mapOnly />
              </Div>
            </Col>
          </Row>

        </Modal.Body>

        <Modal.Footer>
          <Div hidden={state.status === 'closed'}>
            <Button onClick={this.handleSubmit.bind(this)} disabled={!this.props.canSave}>{'Сохранить'}</Button>
          </Div>
        </Modal.Footer>

        <RouteFormWrap element={route}
          onFormHide={this.onFormHide.bind(this)}
          showForm={this.state.showRouteForm}
          fromMission
        />

      </Modal>
    );
  }
}

export default connectToStores(MissionTemplateForm, ['objects', 'employees', 'missions', 'routes']);
