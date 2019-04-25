import * as React from 'react';
import connectToStores from 'flummox/connect';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Button from 'react-bootstrap/lib/Button';
import * as Col from 'react-bootstrap/lib/Col';
import * as Row from 'react-bootstrap/lib/Row';

import { find } from 'lodash';

import ModalBody from 'components/ui/Modal';
import Field from 'components/ui/Field';
import Div from 'components/ui/Div';
import InsideField from 'components/missions/duty_mission_template/inside_fields/index';
import RouteInfo from 'components/new/pages/routes_list/route-info/RouteInfo';
import { DivNone } from 'global-styled/global-styled';

import RouteFormWrap from 'components/new/pages/routes_list/form/RouteFormWrap';

import { DutyMissionForm } from 'components/missions/duty_mission/DutyMissionForm';
import { makeRoutesForDutyMissionForm, getEmployeeFormDutyMission } from 'components/missions/duty_mission/utils';

import dutyMissionTemplatePermission from 'components/missions/duty_mission_template/config-data/permissions';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';

const ButtonSaveDutyMissionTemplate = withRequirePermissionsNew({
  permissions: dutyMissionTemplatePermission.update,
})(Button);

const modalKey = 'duty_mission_template';

class MissionTemplateForm extends DutyMissionForm {
  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;
    const {
      available_route_types = [],
      technicalOperationsList = [],
      TECH_OPERATIONS = [],
      selectedRoute: route = null,
    } = this.state;

    const ROUTES = makeRoutesForDutyMissionForm(this.state, this.props);
    const IS_CREATING = true;

    let title = 'Задание';

    if (IS_CREATING) {
      title = 'Создание шаблона наряд-задания';
    }

    const currentStructureId = this.context.flux.getStore('session').getCurrentUser().structure_id;
    const STRUCTURES = this.context.flux.getStore('session').getCurrentUser().structures.map(({ id, name }) => ({ value: id, label: name }));

    const {
      FOREMANS,
      BRIGADES,
      hasNotActiveEmployees,
    } = getEmployeeFormDutyMission(this.props);

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

    return (
      <Modal id="modal-duty-missio-template" show={this.props.show} onHide={this.props.onHide} bsSize="large" backdrop="static">

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
                onChange={this.handleTechnicalOperationChange}
                clearable={false}
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
            <Col md={12}>
              <InsideField.MunicipalFacility
                modalKey={modalKey}
                error={errors.municipal_facility_id}
                name={state.municipal_facility_name}
                value={state.municipal_facility_id}
                technical_operation_id={state.technical_operation_id}
                norm_id={state.norm_id}
                clearable={false}
                disabled={!!state.route_id}
                alreadyDefineNormId={!IS_CREATING}
                handleChange={this.handleChange}
                technicalOperationsList={technicalOperationsList}
                getCleaningMunicipalFacilityList={this.context.flux.getActions('missions').getCleaningMunicipalFacilityList}
                getDataByNormatives={this.getDataByNormatives}
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
                multiValueContainerReander={this.multiValueContainerReander}
                disabled={false}
                options={BRIGADES}
                value={state.brigade_employee_id_list}
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
                disabled={!state.municipal_facility_id}
                onChange={this.handleRouteChange}
                clearable
              />
              <Div hidden={state.route_id}>
                <Button
                  id="dmt-create-route"
                  onClick={this.createNewRouteNew}
                  disabled={!state.municipal_facility_id}
                >
                  Создать новый
                </Button>
              </Div>
            </Col>
            {STRUCTURE_FIELD_VIEW && (
            <Col md={6}>
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
            </Col>
            )}
          </Row>
          <Row>
            <Col md={12}>
              {
                !this.state.showRouteForm && route && route.id !== null
                  ? (
                    <RouteInfo
                      route={route}
                      noRouteName
                      mapKey="mapDutyMissionTemplateFrom"
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
          <Div hidden={state.status === 'closed'}>
            <ButtonSaveDutyMissionTemplate onClick={this.handleSubmit.bind(this)} disabled={!this.props.canSave || hasNotActiveEmployees}>{'Сохранить'}</ButtonSaveDutyMissionTemplate>
          </Div>
        </Modal.Footer>
        <RouteFormWrap
          element={route}
          showForm={this.state.showRouteForm}
          handleHide={this.onFormHide}
          hasMissionStructureId={!!state.structure_id}
          missionAvailableRouteTypes={available_route_types}
          fromMission
        />

      </Modal>
    );
  }
}

export default connectToStores(MissionTemplateForm, ['objects', 'employees', 'missions', 'session']);
